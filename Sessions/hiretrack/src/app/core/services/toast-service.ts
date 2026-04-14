import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSignal = signal<ToastMessage[]>([]);
  public toasts = this.toastsSignal.asReadonly();
  
  private nextId = 0;

  show(message: string, type: ToastType = 'info') {
    //console.log("console.log");
    
    const id = this.nextId++;
    this.toastsSignal.update(toasts => [...toasts, { id, message, type }]);

    setTimeout(() => {
      this.remove(id);
    }, 3000);
  }

  showSuccess(message: string) {
    this.show(message, 'success');
  }

  showError(message: string) {
    this.show(message, 'error');
  }

  remove(id: number) {
    this.toastsSignal.update(toasts => toasts.filter(t => t.id !== id));
  }
}
