import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { KanbanColumn } from '../models/hire-track-app/board-model';

@Injectable({
  providedIn: 'root',
})
export class ColumnService {
  private  columnsApiUrl = environment.supabaseUrl + '/rest/v1/columns';
  private http = inject(HttpClient);

  getAllJobsWithColumns(boardId: string) : Observable<KanbanColumn[]> {

    const params = new HttpParams()
      .set('select', '*,job_applications(*)')
      .set('board_id', `eq.${boardId}`)
      .set('order', 'position.asc'); // Optional: Keep your columns in order

    return this.http.get<KanbanColumn[]>(this.columnsApiUrl, {  
      params 
    });
  }
}
