import { inject, Injectable } from '@angular/core';
import { LocalStorageService } from '../../shared/utils/local-storage.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { UserEntity } from '../interfaces/users.interface';
import { StorageKey } from '../../shared/enums/storage-key.enum';
import { UsersApiService } from './users-api.service';
import { UsersFilterStatus } from '../components/users-filter/enums/users-filter.enum';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly localStorageService = inject(LocalStorageService);
  private readonly usersApiService = inject(UsersApiService);

  private readonly users$$ = new BehaviorSubject<UserEntity[]>([]);
  private readonly filteredUsers$$ = new BehaviorSubject<UserEntity[]>([]);
  private readonly selectedUser$$ = new BehaviorSubject<UserEntity | null>(null);

  readonly selectedUser$ = this.selectedUser$$.asObservable();

  readonly filteredUsers$: Observable<UserEntity[]> = this.filteredUsers$$.asObservable();

  get users(): UserEntity[] {
    return this.users$$.getValue();
  }

  set users(users: UserEntity[]) {
    this.users$$.next(users);
    this.localStorageService.set(StorageKey.USERS, users);
  }

  set filteredUsers(users: UserEntity[]) {
    this.filteredUsers$$.next(users);
  }

  selectUser(user: UserEntity | null): void {
    this.selectedUser$$.next(user);
  }

  initUsers(): Observable<UserEntity[]> {
    const usersFromStorage = this.localStorageService.get<UserEntity[]>(StorageKey.USERS);

    if (usersFromStorage?.length) {
      return of(usersFromStorage);
    }

    return this.usersApiService.getUsers();
  }

  changeUsersFilter(filterValue = { search: '', status: 'all' }): void {
    let filteredUsers: UserEntity[] = [];

    switch (filterValue.status) {
      case UsersFilterStatus.ALL:
        filteredUsers = [...this.users];
        break;
      case UsersFilterStatus.ACTIVE:
        filteredUsers = this.users.filter((user: UserEntity) => user.active);
        break;
      case UsersFilterStatus.INACTIVE:
        filteredUsers = this.users.filter((user: UserEntity) => !user.active);
        break;
    }

    filteredUsers = filteredUsers.filter((user: UserEntity) =>
      user.name.toLowerCase().includes(filterValue.search.toLowerCase()),
    );

    this.filteredUsers = filteredUsers;
  }

  isExistingUserEmail(newUser: UserEntity): boolean {
    return this.users.some((user) => user.email === newUser.email);
  }

  createUser(newUser: UserEntity): void {
    const newUsers: UserEntity[] = [...this.users, newUser];
    this.users = newUsers;
  }

  editUser(editedUser: UserEntity): void {
    const updatedUsers: UserEntity[] = this.users.map((user: UserEntity) =>
      user.id === editedUser.id ? editedUser : user,
    );
    this.users = updatedUsers;
  }

  deleteUser(userId: number): void {
    const remainingUsers: UserEntity[] = this.users.filter(
      (user: UserEntity) => user.id !== userId,
    );
    this.users = remainingUsers;
  }
}
