import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ColumnService } from '../../../core/services/column-service';
import { JobApplication, KanbanColumn } from '../../../core/models/job';
import { JobForm } from '../../job-application/job-form/job-form';
import { DatePipe, TitleCasePipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-board-view',
  imports: [JobForm, DatePipe, TitleCasePipe, DecimalPipe],
  templateUrl: './board-view.html',
  styleUrl: './board-view.css',
})
export class BoardView {

  private route = inject(ActivatedRoute);
  private columnService = inject(ColumnService);

  protected boardId = signal<string>('');
  protected columns = signal<KanbanColumn[]>([]);
  protected showJobModal = signal<boolean>(false);
  protected selectedColumnId = signal<string>('');
  protected selectedColumnName = signal<string>('');

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      if (params.get('board_id')) {
        this.boardId.set(params.get('board_id')!);
        this.columnService.getAllJobsWithColumns(this.boardId()).subscribe({
          next: (columns) => {
            this.columns.set(columns);
        },
        error: (err) => console.error(err),
      });
    }
  })
  }

  openJobModal(columnId: string, columnName: string) {
    this.selectedColumnId.set(columnId);
    this.selectedColumnName.set(columnName);
    this.showJobModal.set(true);
  }

  closeJobModal(){
    this.showJobModal.set(false);
    this.selectedColumnId.set('');
    this.selectedColumnName.set('');
    
  }
  closeJobModalAfterJobCreation(job:JobApplication) {
    this.columns.update((columns) => {
      const column = columns.find((column) => column.id === job.column_id);
      if(column){
        column.job_applications.push(job);
      }
      return columns;
    }); 
    this.showJobModal.set(false);
    this.selectedColumnId.set('');
    this.selectedColumnName.set('');

  }

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
