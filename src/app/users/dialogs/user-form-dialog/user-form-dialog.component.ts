import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { USER_TOOLTIPS } from '../../enums/constants.enum';
import { EditUser } from '../../interfaces/edit-user.interface';

@Component({
  selector: 'app-user-create-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './user-form-dialog.component.html',
  styleUrl: './user-form-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserFormDialogComponent implements OnInit {
  private readonly fb: FormBuilder = inject(FormBuilder);

  private readonly matDialogRef = inject(MatDialogRef<UserFormDialogComponent>);

  readonly data: EditUser | null = inject(MAT_DIALOG_DATA);

  readonly form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    id: [this.data?.user?.id ? this.data.user.id : new Date().getTime()],
  });

  public get messageTooltip(): string {
    return this.data?.user ? USER_TOOLTIPS.EDIT : USER_TOOLTIPS.ADD;
  }

  ngOnInit(): void {
    if (this.data?.user) {
      this.form.patchValue(this.data.user);
    }
  }

  applyChangesForm(): void {
    this.matDialogRef.close(this.form.value);
    this.form.reset();
  }
}
