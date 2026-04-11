import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CreateBoardDto } from '../../../core/models/job';
import { BoardService } from '../../../core/services/board-service';

@Component({
  selector: 'app-board-form',
  imports: [ReactiveFormsModule],
  templateUrl: './board-form.html',
  styleUrl: './board-form.css',
})
export class BoardForm {

  protected boardForm!: FormGroup;
  private boardService = inject(BoardService);

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
        next: (response) => {
          console.log('Board created successfully:', response);
          // You can add logic here to navigate to the board list or reset the form
        },
        error: (error) => {
          console.error('Error creating board:', error);
          // Handle error, show notification, etc.
        }
      });
      // Here you can add logic to send the form data to your backend or perform other actions
    } else {
      console.log('Form is invalid');
    }
  }
  initializeForm() {
    this.boardForm = new FormGroup({

      name : new FormControl(''),
      description : new FormControl(''),
      color: new FormControl('#ffffff')
    });
  }
}
