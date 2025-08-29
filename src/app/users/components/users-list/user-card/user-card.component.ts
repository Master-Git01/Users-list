import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { UserEntity } from '../../../interfaces/users.interface';
import { MatTooltipModule } from '@angular/material/tooltip';
import { USER_TOOLTIPS } from '../../../enums/constants.enum';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { NgClass } from '@angular/common';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [MatTooltipModule, MatButtonModule, MatCardModule, MatIcon, NgClass],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCardComponent {
  @Input({ required: true }) user!: UserEntity;

  @Output() deleteUser = new EventEmitter<number>();
  @Output() editUser = new EventEmitter<UserEntity>();

  private readonly usersService = inject(UsersService);

  get messageTooltip(): string {
    return USER_TOOLTIPS.DELETE;
  }

  onUserDelete(userId: number): void {
    this.deleteUser.emit(userId);
  }

  onUserEdit(): void {
    this.editUser.emit(this.user);
  }

  onSelectUser(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    if (!target.closest('button')) {
      this.usersService.selectUser(this.user);
    }
  }
}
