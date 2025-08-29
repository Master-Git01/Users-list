import { Component, inject } from '@angular/core';
import { UserEntity } from '../../interfaces/users.interface';
import { UsersService } from '../../services/users.service';
import { Observable } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [AsyncPipe, NgIf],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss',
})
export class UserDetailsComponent {
  private readonly usersService = inject(UsersService);

  user$: Observable<UserEntity | null> = this.usersService.selectedUser$;
}
