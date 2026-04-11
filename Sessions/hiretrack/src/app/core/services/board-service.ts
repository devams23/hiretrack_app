import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth-service';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { devenvironment } from '../../../environments/environment.development';
import { Board, CreateBoardDto } from '../models/job';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BoardService {

  private authService:AuthService = inject(AuthService);
  private http: HttpClient = inject(HttpClient);
  private boardsApi = devenvironment.supabaseUrl + '/rest/v1/boards';
  private currentUser = this.authService.getCurrentUser();

  getAllBoards() : Observable<Board[]> {
    const params = new HttpParams().set('user_id', `eq.${this.currentUser?.userId}`);
    return this.http.get<Board[]>(this.boardsApi, { params });

  } 

  createBoard(board:CreateBoardDto): Observable<HttpResponse<Board>> {
    const user_board = {...board, user_id: this.currentUser?.userId}
    return this.http.post<Board>(this.boardsApi, user_board , {
      observe: 'response',
    })
  } 
}
