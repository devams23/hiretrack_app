import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JobService } from '../../../core/services/job-service';
import { ColumnService } from '../../../core/services/column-service';
import { Column, KanbanColumn } from '../../../core/models/job';
import { JobForm } from '../../job-application/job-form/job-form';

@Component({
  selector: 'app-board-view',
  imports: [JobForm],
  templateUrl: './board-view.html',
  styleUrl: './board-view.css',
})
export class BoardView {

  private route = inject(ActivatedRoute);
   
  private columnService = inject(ColumnService);
  protected boardId = signal<string>('');
  protected columns = signal<KanbanColumn[]>([]);

  ngOnInit(){

    if(this.route.snapshot.paramMap.get('board_id')){
      console.log('GETTING COLUMNS DATA...')
      this.boardId.set(this.route.snapshot.paramMap.get('board_id')!);
      this.columnService.getAllJobsWithColumns(this.boardId()).subscribe({
        next: (columns) => {
          console.log('Columns for board:', columns);
          this.columns.set(columns);
        }
      });
    }
  }
}
