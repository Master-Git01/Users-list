import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { UsersFilter } from '../../interfaces/users-filter.interface';
import { UsersFilterStatus } from '../../enums/users-filter.enum';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-users-filter',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatMenuModule,
  ],
  templateUrl: './users-filter.component.html',
  styleUrls: ['./users-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersFilterComponent implements OnInit {
  @Output() filterUsers = new EventEmitter<UsersFilter>();

  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  public status = UsersFilterStatus;

  public form = new FormGroup({
    search: new FormControl(''),
    status: new FormControl<UsersFilterStatus>(UsersFilterStatus.ALL),
  });

  public ngOnInit(): void {
    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      const filter: UsersFilter = {
        search: value.search || '',
        status: value.status || UsersFilterStatus.ALL,
      };

      this.filterUsers.emit(filter);
    });
  }

  onFilterChange(type: UsersFilterStatus): void {
    this.form.get('status')?.setValue(type);
  }
}
