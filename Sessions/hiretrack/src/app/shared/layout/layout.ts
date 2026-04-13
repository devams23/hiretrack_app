import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth-service';
import { BoardService } from '../../core/services/board-service';
import { Board } from '../../core/models/job';
import { BoardForm } from '../../features/boards/board-form/board-form';
import { AsyncPipe } from '@angular/common';
import { SearchService } from '../services/search';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, BoardForm, AsyncPipe],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  protected authService = inject(AuthService);
  private boardService = inject(BoardService);
  private router = inject(Router);
  private searchService = inject(SearchService);

  boards = signal<Board[]>([]);
  showBoardModal = signal<boolean>(false);
  isSidebarOpen = signal<boolean>(true);

  ngOnInit() {
    this.boardService.getAllBoards().subscribe({
      next: (boards) => {
        this.boards.set(boards);
      },
      error: (error) => {
        console.error('Error fetching boards:', error);
      }
    });
  }
  searchJobs(searchQuery: string) {
    this.searchService.push(searchQuery);
  }
  openBoardModal() {
    this.showBoardModal.set(true);
  }

  closeBoardModal() {
    this.showBoardModal.set(false);

  }
  closeBoardModelAndNavigate(board:Board){
    console.log("CLOSING BOARD MODEL AND NAVIGATING...");

    this.showBoardModal.set(false);
    this.boards.update((boards) => [...boards, board]);
    this.router.navigate(['/boards', board.id]);
  }

  navigateToBoard(boardId: string) {
    this.router.navigate(['/boards', boardId]);
  }

  toggleSidebar() {
    this.isSidebarOpen.set(!this.isSidebarOpen());
  }

  logout() {
    this.authService.signOut();
  }
}
