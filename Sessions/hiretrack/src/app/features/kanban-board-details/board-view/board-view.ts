import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnService } from '../../../core/services/column-service';
import { JobService } from '../../../core/services/job-service';
import { JobApplication, KanbanColumn } from '../../../core/models/job';
import { JobForm } from '../../job-application/job-form/job-form';
import { TitleCasePipe, DecimalPipe } from '@angular/common';
import { ConfirmDialog } from '../../../shared/confirm-dialog/confirm-dialog';
import { RelativeDatePipe } from '../../../shared/pipes/relative-date/relative-date-pipe';
import { JobCountPipe } from '../../../shared/pipes/job-count/job-count-pipe';
import { SearchService } from '../../../shared/services/search';

@Component({
  selector: 'app-board-view',
  imports: [JobForm, TitleCasePipe, DecimalPipe, ConfirmDialog, RelativeDatePipe, JobCountPipe],
  templateUrl: './board-view.html',
  styleUrl: './board-view.css',
})
export class BoardView {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private columnService = inject(ColumnService);
  private jobService = inject(JobService);
  protected searchService = inject(SearchService);

  protected boardId = signal<string>('');
  protected columns = signal<KanbanColumn[]>([]);

  /**
   * Derived signal — filters columns' job_applications by the debounced
   * search query (company_name OR role, case-insensitive).
   * When query is empty, returns columns as-is. Zero extra API calls.
   */
  protected filteredColumns = computed<KanbanColumn[]>(() => {
    const query = this.searchService.filteredQuery();
    const cols = this.columns();
    if (!query) return cols;
    return cols.map((col) => ({
      ...col,
      job_applications: col.job_applications.filter(
        (job) =>
          job.company_name.toLowerCase().includes(query) ||
          job.role.toLowerCase().includes(query),
      ),
    }));
  });

  // Job creation modal
  protected showJobModal = signal<boolean>(false);
  protected selectedColumnId = signal<string>('');
  protected selectedColumnName = signal<string>('');

  // Delete confirm dialog
  protected jobToDelete = signal<JobApplication | null>(null);

  // Drag state (kept in plain properties — no need fo signals)
  private draggedJob: JobApplication | null = null;
  private draggedFromColumnId: string | null = null;
  protected dragOverColumnId = signal<string | null>(null);

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      if (params.get('board_id')) {
        this.boardId.set(params.get('board_id')!);
        this.columnService.getAllJobsWithColumns(this.boardId()).subscribe({
          next: (columns) => {
            //console.log(columns)
            this.columns.set(columns)},
          error: (err) => console.error(err),
        });
      }
    });
  }

  // ─── Job creation modal ─────────────────────────────────────────
  openJobModal(columnId: string, columnName: string) {
    this.selectedColumnId.set(columnId);
    this.selectedColumnName.set(columnName);
    this.showJobModal.set(true);
  }

  closeJobModal() {
    this.showJobModal.set(false);
    this.selectedColumnId.set('');
    this.selectedColumnName.set('');
  }

  closeJobModalAfterJobCreation(job: JobApplication) {
    // Optimistic update — no extra API call
    this.columns.update((columns) => {
      const column = columns.find((c) => c.id === job.column_id);
      if (column) column.job_applications.push(job);
      return [...columns];
    });
    this.closeJobModal();
  }

  // ─── Navigate to job detail ──────────────────────────────────────
  openJobDetail(job: JobApplication) {
    this.router.navigate(['/boards', this.boardId(), 'jobs', job.id]);
  }

  // ─── Drag & Drop (native HTML5) ─────────────────────────────────
  onDragStart(event: DragEvent, job: JobApplication, columnId: string) {
    this.draggedJob = job;
    this.draggedFromColumnId = columnId;
    event.dataTransfer!.effectAllowed = 'move';
    // Add slight opacity via CSS class handled in template
  
  }

  onDragEnd(event: DragEvent) {
    
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

    // Persist to backend
    this.jobService.updateJobColumn(job.id, targetColumnId).subscribe({
      error: (err) => {
        console.error('Drop failed, reverting:', err);
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
    });

    this.draggedJob = null;
    this.draggedFromColumnId = null;
  }

  // ─── Delete job ─────────────────────────────────────────────────
  promptDeleteJob(event: MouseEvent, job: JobApplication) {
    event.stopPropagation(); // don't navigate to detail
    this.jobToDelete.set(job);
  }

  confirmDelete() {
    const job = this.jobToDelete();
    if (!job) return;
    this.jobService.deleteJob(job.id).subscribe({
      next: () => {
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
    });
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
