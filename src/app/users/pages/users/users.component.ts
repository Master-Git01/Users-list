import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { UserEntity } from '../../interfaces/users.interface';
import { UsersListComponent } from '../../components/users-list/users-list.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, Observable, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { UsersService } from '../../services/users.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { EditUser } from '../../interfaces/edit-user.interface';
import { UserFormDialogComponent } from '../../dialogs/user-form-dialog/user-form-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { USER_TOOLTIPS } from '../../enums/constants.enum';
import { UserDeleteConfirmDialogComponent } from '../../dialogs/user-delete-confirm-dialog/user-delete-confirm-dialog.component';
import { UserDeleteConfirmDialogData } from '../../dialogs/interfaces/user-delete-confirm-dialog-data.interface';
import { DestroyRef } from '@angular/core';
import { NotificationService } from '../../../shared/services/snackbar.service';
import { UsersFilterComponent } from '../../components/users-filter/users-filter.component';
import { UserFilter } from '../../components/users-filter/interfaces/users-filter.interface';
import { UserDetailsComponent } from '../../components/user-details/user-details.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    UsersListComponent,
    AsyncPipe,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    UsersFilterComponent,
    UserDetailsComponent,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent implements OnInit {
  private readonly usersService: UsersService = inject(UsersService);
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);
  private readonly notificationService: NotificationService = inject(NotificationService);

  readonly users$: Observable<UserEntity[]> = this.usersService.filteredUsers$;

  get messageTooltip(): string {
    return USER_TOOLTIPS.ADD;
  }

  ngOnInit(): void {
    this.usersService
      .initUsers()
      .pipe(
        tap((users: UserEntity[]) => {
          this.usersService.users = users;
          this.usersService.changeUsersFilter();
        }),
      )
      .subscribe();
  }

  changeUsersFilter(filterValue: UserFilter): void {
    this.usersService.changeUsersFilter(filterValue);
  }

  openCreateUserDialog(): void {
    this.dialog
      .open<UserFormDialogComponent, UserEntity>(UserFormDialogComponent)
      .afterClosed()
      .pipe(
        filter(Boolean),
        tap((newUser: UserEntity) => this.createUser(newUser)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  openEditUserDialog(user: UserEntity): void {
    this.dialog
      .open<UserFormDialogComponent, EditUser, UserEntity>(UserFormDialogComponent, {
        data: { user },
      })
      .afterClosed()
      .pipe(
        filter(Boolean),
        tap((editedUser: UserEntity) => {
          this.usersService.editUser(editedUser);
          this.notificationService.showSuccess('Пользователь успешно изменен');
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  openDeleteUserDialog(userId: number): void {
    this.dialog
      .open<UserDeleteConfirmDialogComponent, UserDeleteConfirmDialogData, boolean>(
        UserDeleteConfirmDialogComponent,
        {
          data: {
            title: 'Удаление пользователя',
            content: `<h3 style="font-weight: 500;font-size: 24px">Удалить пользователя с ID: (${userId})?</h3>`,
            submitButtonText: 'Удалить',
          },
        },
      )
      .afterClosed()
      .pipe(
        filter(Boolean),
        tap(() => {
          this.usersService.deleteUser(userId);
          this.notificationService.showSuccess('Пользователь успешно удален');
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  onBackgroundClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    if (!target.closest('app-users-list') && !target.closest('app-user-details')) {
      this.usersService.selectUser(null);
    }
  }

  private createUser(newUser: UserEntity): void {
    if (this.usersService.isExistingUserEmail(newUser)) {
      this.notificationService.showMessage('Такой email уже существует!');
    } else {
      this.usersService.createUser(newUser);
      this.notificationService.showSuccess('Новый пользователь успешно создан!');
    }
  }
}
