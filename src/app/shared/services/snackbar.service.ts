import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private snackBar = inject(MatSnackBar);

  showMessage(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }

  showError(message: string): void {
    this.snackBar.open(message, 'Error', {
      duration: 5000,
      panelClass: 'error-snackbar',
    });
  }

  showSuccess(message: string): void {
    this.snackBar.open(message, 'Success', {
      duration: 3000,
      panelClass: 'success-snackbar',
    });
  }
}
