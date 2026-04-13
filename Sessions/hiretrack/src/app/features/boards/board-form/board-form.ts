import { Component, inject, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Board, CreateBoardDto } from '../../../core/models/job';
import { BoardService } from '../../../core/services/board-service';
import { HttpResponse } from '@angular/common/http';

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
    if (this.boardForm.valid) {
      const boardData: CreateBoardDto = {
        name: this.boardForm.value.name,
        color: this.boardForm.value.color,
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
    } else {
      console.log('Form is invalid');
    }
  }
  initializeForm() {
    this.boardForm = new FormGroup({
      name : new FormControl('', [Validators.required]),
      description : new FormControl(''),
    });
  }
}
