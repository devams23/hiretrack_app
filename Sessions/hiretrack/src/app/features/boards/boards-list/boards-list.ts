import { Component, inject, signal } from '@angular/core';
import { Board } from '../../../core/models/hire-track-app/board';
import { BoardService } from '../../../core/services/board-service';
import { Router } from '@angular/router';
import { RelativeDatePipe } from '../../../shared/pipes/relative-date/relative-date-pipe';

@Component({
  selector: 'app-boards-list',
  imports: [RelativeDatePipe],
  templateUrl: './boards-list.html',
  styleUrl: './boards-list.css',
})
export class BoardsList {
  boardsList = signal<Board[]>([]);
  private boardService = inject(BoardService);
  private router = inject(Router);

  navigateToBoard(boardid: string) {
    this.router.navigate(['/boards', boardid]);
  }

  navigateToCreateBoard() {
    this.router.navigate(['/boards/create']);
  }

  ngOnInit() {
    this.boardService.getAllBoards().subscribe({
      next: (boards) => {
        this.boardsList.set(boards);
      },
      error: (error) => {
        console.error('Error fetching boards:', error);
      }
    });
  }
}
