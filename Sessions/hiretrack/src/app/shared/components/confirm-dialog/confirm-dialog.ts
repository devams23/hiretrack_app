import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  imports: [],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.css',
})
export class ConfirmDialog {
  /** Title shown in the modal */
  title = input<string>('Are you sure?');
  /** Description body text */
  message = input<string>('This action cannot be undone.');
  /** Label for the confirm (danger) button */
  confirmLabel = input<string>('Delete');
  /** Emits when user clicks Confirm */
  confirmed = output<void>();
  /** Emits when user clicks Cancel or backdrop */
  cancelled = output<void>();
}
