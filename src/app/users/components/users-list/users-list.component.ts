import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { UserCardComponent } from './user-card/user-card.component';
import { NgFor } from '@angular/common';
import { UserEntity } from '../../interfaces/users.interface';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [UserCardComponent, NgFor],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersListComponent {
  @Input() users: UserEntity[] = [];

  @Output() deleteUser = new EventEmitter<number>();
  @Output() editUser = new EventEmitter<UserEntity>();

  onUserEdit(user: UserEntity): void {
    this.editUser.emit(user);
  }

  onUserDelete(userId: number): void {
    this.deleteUser.emit(userId);
  }

  trackByUserId(index: number, user: UserEntity): number {
    return user.id;
  }
}
