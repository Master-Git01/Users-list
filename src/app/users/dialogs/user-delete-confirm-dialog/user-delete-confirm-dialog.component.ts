import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
} from '@angular/material/dialog';
import { SafeHtmlPipe } from '../../../shared/pipes/safe-html.pipe';
import { UserDeleteConfirmDialogData } from '../interfaces/user-delete-confirm-dialog-data.interface';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-user-delete-confirm-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogActions,
    MatDialogContent,
    MatDialogClose,
    MatCardModule,
    SafeHtmlPipe,
  ],
  templateUrl: './user-delete-confirm-dialog.component.html',
  styleUrl: './user-delete-confirm-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDeleteConfirmDialogComponent {
  private readonly data = inject<UserDeleteConfirmDialogData>(MAT_DIALOG_DATA);

  readonly title = this.data.title;
  readonly content = this.data.content;
  readonly submitButtonText = this.data.submitButtonText;
}
