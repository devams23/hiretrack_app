import { Component, computed, inject, Signal, signal, ViewChild, OnDestroy } from '@angular/core';
import confetti from 'canvas-confetti';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnService } from '../../../core/services/column-service';
import { JobService } from '../../../core/services/job-service';

import { JobForm } from '../../job-application/job-form/job-form';
import { DecimalPipe } from '@angular/common';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { RelativeDatePipe } from '../../../shared/pipes/relative-date/relative-date-pipe';
import { JobCountPipe } from '../../../shared/pipes/job-count/job-count-pipe';
import { SearchService } from '../../../shared/services/search';
import { BoardService } from '../../../core/services/board-service';
import { Board, KanbanColumn } from '../../../core/models/hire-track-app/board-model';
import { JobApplication } from '../../../core/models/hire-track-app/jobs-model';
import { BoardForm } from '../../boards/board-form/board-form';
import { ToastService } from '../../../core/services/toast-service';

@Component({
  selector: 'app-board-view',
  imports: [JobForm, DecimalPipe, ConfirmDialog, RelativeDatePipe, JobCountPipe ],
  templateUrl: './board-view.html',
  styleUrl: './board-view.css',
})
export class BoardView implements OnDestroy {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private columnService = inject(ColumnService);
  private jobService = inject(JobService);
  protected searchService = inject(SearchService);
  protected currentBoard = signal<Board|null>(null);
  private boardService = inject(BoardService);
  protected boardId = signal<string>('');
  protected columns = signal<KanbanColumn[]>([]);
  @ViewChild('appjobform') appJobForm!:JobForm;


  /**
   * Derived signal — filters columns' job_applications by the debounced
   * search query (company_name OR role, case-insensitive).
   * When query is empty, returns columns as-is. Zero extra API calls.
   */
  protected filteredColumns = computed<KanbanColumn[]>(() => {
    const query = this.searchService.filteredQuery();
    const cols = this.columns();
    if (!query){
      return cols
    };
    return cols.map((col) => ({
      ...col,
      job_applications: col.job_applications.filter(
        (job) =>
          job.company_name.toLowerCase().includes(query) ||
          job.role.toLowerCase().includes(query),
      ),
    }));
  });

  protected columnsTypeCount: Signal<{[columnId:string]:number}>= computed(() => {
    const counts: { [columnId: string]: number } = {};
    this.columns().forEach((col) => {
      counts[col.id] = col.job_applications.length;
    });
    return counts;
  }); 
  protected showJobModal = signal<boolean>(false);
  protected selectedColumnId = signal<string>('');
  protected selectedColumnName = signal<string>('');
  protected toastService = inject(ToastService);
  // Delete confirm dialog
  protected jobToDelete = signal<JobApplication | null>(null);

  // Drag state (kept in plain properties — no need fo signals)
  private draggedJob: JobApplication | null = null;
  private draggedFromColumnId: string | null = null;
  protected dragOverColumnId = signal<string | null>(null);
  
  private subscription = new Subscription();

  ngOnInit() {
    this.subscription.add(
      this.route.paramMap.subscribe((params) => {
        if (params.get('board_id')) {
          this.subscription.add(
            this.boardService.getBoardDetailsById(params.get('board_id')).subscribe({
             next: (board) => {
              //console.log('current board ' ,board);
              
                this.currentBoard.set(board[0]);
              },
              error: (error) => {
                this.toastService.showError('Error fetching board');
              }
            })
          );
          this.boardId.set(params.get('board_id')!);
          this.subscription.add(
            this.columnService.getAllJobsWithColumns(this.boardId()).subscribe({
              next: (columns) => {
                //console.log(columns)
                this.columns.set(columns)},
              error: (err) => console.error(err),
            })
          );
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // ─── Job creation modal ─────────────────────────────────────────
  openJobModal(columnId: string, columnName: string) {
    this.selectedColumnId.set(columnId);
    this.selectedColumnName.set(columnName);
    this.showJobModal.set(true);
  }

  closeJobModal() {

    //console.log("close job modal called");

        if(this.appJobForm.hasUnsavedChanges()){
      if(confirm("Do you want to discard the changes")){
        this.localColumnCleanUp()
      }
    }
    else{
this.localColumnCleanUp();

    }

  }

  localColumnCleanUp(){
          this.showJobModal.set(false);
    this.selectedColumnId.set('');
    this.selectedColumnName.set('');
  }
  
  closeJobModalAfterJobCreation(job: JobApplication) {
    // Optimistic update — no extra API call
    // event.stopPropagation();
    this.columns.update((columns) => {
      const column = columns.find((c) => c.id === job.column_id);
      if (column) column.job_applications.push(job);
      return [...columns];
    });
    this.localColumnCleanUp();
  }

  // ─── Navigate to job detail ──────────────────────────────────────
  openJobDetail(job: JobApplication , columnName:string) {
    //console.log("JOB DETAIL CALLED");
    
    this.router.navigate(['/boards', this.boardId(), 'jobs', job.id] , {queryParams:{column_name:columnName}});
  }

  
  onDragStart(event: DragEvent, job: JobApplication, columnId: string) {
    this.draggedJob = job;
    this.draggedFromColumnId = columnId;
    event.dataTransfer!.effectAllowed = 'move';

  
  }

  onDragEnd(event: DragEvent) {
    event.preventDefault()
    this.dragOverColumnId.set(null);
  }

  onDragOver(event: DragEvent, columnId: string) {
    event.preventDefault();
    event.dataTransfer!.dropEffect = 'move';
    this.dragOverColumnId.set(columnId);
  }

  onDragLeave(event: DragEvent, columnId: string) { 
    // Only clear if we've truly left the column (not entered a child)
    const related = event.relatedTarget as HTMLElement | null;
    if (!related || !(event.currentTarget as HTMLElement).contains(related)) {
      if (this.dragOverColumnId() === columnId) {
        this.dragOverColumnId.set(null);
      }
    }
  }

  onDrop(event: DragEvent, targetColumnId: string) {
    event.preventDefault();
    this.dragOverColumnId.set(null);

    if (!this.draggedJob || this.draggedFromColumnId === targetColumnId) {
      // Same column — nothing to do
      this.draggedJob = null;
      this.draggedFromColumnId = null;
      return;
    }

    const job = this.draggedJob;
    const fromColId = this.draggedFromColumnId!;

    // Optimistic local update first (instant UI feedback, zero wait)
    this.columns.update((cols) => {
      const fromCol = cols.find((c) => c.id === fromColId);
      const toCol = cols.find((c) => c.id === targetColumnId);
      if (fromCol && toCol) {
        fromCol.job_applications = fromCol.job_applications.filter((j) => j.id !== job.id);
        toCol.job_applications = [...toCol.job_applications, { ...job, column_id: targetColumnId }];
      }
      return [...cols];
    });

    // Determine if shifted to an "offer" column for celebration
    const targetColName = this.columns().find((c) => c.id === targetColumnId)?.name?.toLowerCase();
    if (targetColName && targetColName.includes('offer')) {
      this.triggerOfferCelebration();
    }

    // Persist to backend
    this.subscription.add(
      this.jobService.updateJobColumn(job.id, targetColumnId).subscribe({
        error: (err) => {
          this.toastService.showError('Drop failed, reverting');
          // Revert on error
          this.columns.update((cols) => {
            const fromCol = cols.find((c) => c.id === fromColId);
            const toCol = cols.find((c) => c.id === targetColumnId);
            if (fromCol && toCol) {
              toCol.job_applications = toCol.job_applications.filter((j) => j.id !== job.id);
              fromCol.job_applications = [...fromCol.job_applications, job];
            }
            return [...cols];
          });
        },
      })
    );

    this.draggedJob = null;
    this.draggedFromColumnId = null;
  }

  // ─── Celebration ─────────────────────────────────────────────────
  private triggerOfferCelebration() {
    const duration = 2500;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: number = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  }

  // ─── Delete job ─────────────────────────────────────────────────
  promptDeleteJob(event: Event, job: JobApplication) {
    event.stopPropagation();
    //console.log('DELETING JOB');
    
    this.jobToDelete.set(job);
  }

  confirmDelete() {
    const job = this.jobToDelete();
    if (!job) return;
    this.subscription.add(
      this.jobService.deleteJob(job.id).subscribe({
        next: () => {
          this.toastService.showSuccess('Job deleted successfully');
          // Remove locally — no refetch needed
          this.columns.update((cols) => {
            const col = cols.find((c) => c.id === job.column_id);
            if (col) col.job_applications = col.job_applications.filter((j) => j.id !== job.id);
            return [...cols];
          });
          this.jobToDelete.set(null);
        },
        error: (err) => {
          console.error('Delete failed:', err);
          this.jobToDelete.set(null);
        },
      })
    );
  }

  cancelDelete() {
    this.jobToDelete.set(null);
  }

  // ─── UI helpers ─────────────────────────────────────────────────
    getColumnHeaderClass(index: number): string {
    const colors = [
      'text-blue-600 bg-blue-50',
      'text-amber-600 bg-amber-50',
      'text-green-600 bg-green-50',
      'text-purple-600 bg-purple-50',
      'text-rose-600 bg-rose-50',
      'text-cyan-600 bg-cyan-50',
    ];
    return colors[index % colors.length];
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'high': return 'bg-rose-50 text-rose-600 border border-rose-100';
      case 'medium': return 'bg-amber-50 text-amber-600 border border-amber-100';
      case 'low': return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
      default: return 'bg-slate-50 text-slate-500';
    }
  }

  getPriorityDot(priority: string): string {
    switch (priority) {
      case 'high': return 'bg-rose-500';
      case 'medium': return 'bg-amber-500';
      case 'low': return 'bg-emerald-500';
      default: return 'bg-slate-400';
    }
  }
}
