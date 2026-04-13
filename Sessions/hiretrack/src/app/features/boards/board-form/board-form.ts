import { Component, inject, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
  import { BoardService } from '../../../core/services/board-service';
import { Board, CreateBoardDto } from '../../../core/models/hire-track-app/board-model';

@Component({
  selector: 'app-board-form',
  imports: [ReactiveFormsModule],
  templateUrl: './board-form.html',
  styleUrl: './board-form.css',
})
export class BoardForm {

  protected boardForm!: FormGroup;
  private boardService = inject(BoardService);
  boardCreated = output<Board>();

  ngOnInit() {
    this.initializeForm();
  }
  
  onSubmit() { 
    if (this.boardForm.invalid) {
      this.boardForm.markAllAsTouched();
      return;
    }
    const boardData: CreateBoardDto = {
        name: this.boardForm.value.name,
        description: this.boardForm.value.description
      }
      this.boardService.createBoard(boardData).subscribe({
        next: (response: Board[]) => {
          console.log('Board created successfully:', response);
          if(response){
            const boardCreated = response[0];
            this.boardCreated.emit(boardCreated);
          }
          this.boardForm.reset();
        },
        error: (error) => {
          console.error('Error creating board:', error);
        }
      });
  }

  getError(controlName: string): string | null {
    const control = this.boardForm.get(controlName);
    if (!control || !control.errors || !(control.touched || control.dirty)) return null;

    const { required, minlength, maxlength } = control.errors;
    if (required) return 'This field is required.';
    if (minlength) return `Must be at least ${minlength.requiredLength} characters.`;
    if (maxlength) return `Cannot exceed ${maxlength.requiredLength} characters.`;

    return null;
  }

  isInvalid(controlName: string): boolean {
    const control = this.boardForm.get(controlName);
    return !!control && control.invalid && (control.touched || control.dirty);
  }
  initializeForm() {
    this.boardForm = new FormGroup({
      name : new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(60)
      ]),
      description : new FormControl('', [Validators.maxLength(200)]),
    });
  }
}
