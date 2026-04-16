import { Component, inject, signal, ViewChild, viewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth-service';
import { BoardService } from '../../../core/services/board-service';
import { BoardForm } from '../../../features/boards/board-form/board-form';
import { AsyncPipe } from '@angular/common';
import { SearchService } from '../../services/search';
import { Board } from '../../../core/models/hire-track-app/board-model';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, BoardForm, AsyncPipe],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout implements OnDestroy {
  protected authService = inject(AuthService);
  private boardService = inject(BoardService);
  private router = inject(Router);
  private searchService = inject(SearchService);
  @ViewChild('appboardform') appBoardForm!: BoardForm;
  // appBoardForm = viewChild<BoardForm>('appboardform');
  boards = signal<Board[]>([]);
  showBoardModal = signal<boolean>(false);
  isSidebarOpen = signal<boolean>(true);
  isSaved = signal<boolean>(false);

  private subscription = new Subscription();

  ngOnInit() {
    this.subscription.add(
      this.boardService.getAllBoards().subscribe({
        next: (boards) => {
          this.boards.set(boards);
        },
        error: (error) => {
          console.error('Error fetching boards:', error);
        },
      }),
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  searchJobs(searchQuery: string) {
    this.searchService.push(searchQuery);
  }
  openBoardModal() {
    this.showBoardModal.set(true);
  }

  closeBoardModal() {
    //console.log("hello");
    if (this.appBoardForm.hasUnsavedChanges()) {
      if (confirm('Do you want to discard the changes')) {
        this.showBoardModal.set(false);
      }
    } else {
      this.showBoardModal.set(false);
    }
    //this.router.navigate(['boards'])
  }
  closeBoardModelAndNavigate(board: Board) {
    //console.log("CLOSING BOARD MODEL AND NAVIGATING...");

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
