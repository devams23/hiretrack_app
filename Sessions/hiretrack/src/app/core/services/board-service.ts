import { inject, Injectable, signal } from '@angular/core';
import { AuthService } from './auth-service';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { devenvironment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { Board, CreateBoardDto } from '../models/hire-track-app/board-model';



interface CreateBoardDtoWithUserId extends CreateBoardDto {
  user_id: string | undefined;
}
@Injectable({
  providedIn: 'root',
})
export class BoardService {

  private boardsData = signal<Board[]>([]);
  private authService:AuthService = inject(AuthService);
  private http: HttpClient = inject(HttpClient);
  private boardsApi = devenvironment.supabaseUrl + '/rest/v1/boards';
  private currentUser = this.authService.getCurrentUser();

  getAllBoards() : Observable<Board[]> {

    const params = new HttpParams().set('user_id', `eq.${this.currentUser?.userId}`);
    return this.http.get<Board[]>(this.boardsApi, { params });


  } 

  getBoardDetailsById(id:string | null):Observable<Board[]>{
    const params = new HttpParams().set('id', `eq.${id}`);
    return this.http.get<Board[]>(this.boardsApi, { params });
  }

  createBoard(board:CreateBoardDto):  Observable<Board[]> {
    const user_board:CreateBoardDtoWithUserId = {...board, user_id: this.currentUser?.userId}
    return this.http.post<Board[]>(this.boardsApi, user_board);
  } 
}
