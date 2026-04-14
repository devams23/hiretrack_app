import { Component, inject, signal, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Board } from '../../../core/models/hire-track-app/board-model';
import { BoardService } from '../../../core/services/board-service';
import { Router } from '@angular/router';
import { RelativeDatePipe } from '../../../shared/pipes/relative-date/relative-date-pipe';

@Component({
  selector: 'app-boards-list',
  imports: [RelativeDatePipe],
  templateUrl: './boards-list.html',
  styleUrl: './boards-list.css',
})
export class BoardsList implements OnDestroy {
  boardsList = signal<Board[]>([]);
  private boardService = inject(BoardService);
  private router = inject(Router);

  navigateToBoard(boardid: string) {
    this.router.navigate(['/boards', boardid]);
  }

  navigateToCreateBoard() {
    this.router.navigate(['/boards/create']);
  }

  private subscription = new Subscription();

  ngOnInit() {
    this.subscription.add(
      this.boardService.getAllBoards().subscribe({
        next: (boards) => {
          this.boardsList.set(boards);
        },
        error: (error) => {
          console.error('Error fetching boards:', error);
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
