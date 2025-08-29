import { inject, Injectable } from '@angular/core';
import { LocalStorageService } from '../../shared/utils/local-storage.service';
import { BehaviorSubject, combineLatest, map, Observable, of } from 'rxjs';
import { UserEntity } from '../interfaces/users.interface';
import { StorageKey } from '../../shared/enums/storage-key.enum';
import { UsersApiService } from './users-api.service';
import { UsersFilterStatus } from '../enums/users-filter.enum';
import { UsersFilter } from '../interfaces/users-filter.interface';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly localStorageService = inject(LocalStorageService);
  private readonly usersApiService = inject(UsersApiService);

  private readonly users$$ = new BehaviorSubject<UserEntity[]>([]);
  private readonly selectedUser$$ = new BehaviorSubject<UserEntity | null>(null);
  private readonly filter$$ = new BehaviorSubject<UsersFilter>({
    search: '',
    status: UsersFilterStatus.ALL,
  });

  readonly selectedUser$: Observable<UserEntity | null> = this.selectedUser$$.asObservable();

  readonly users$: Observable<UserEntity[]> = combineLatest([this.users$$, this.filter$$]).pipe(
    map(([users, filter]) =>
      users
        .filter((user) => {
          switch (filter.status) {
            case UsersFilterStatus.ACTIVE:
              return user.active;
            case UsersFilterStatus.INACTIVE:
              return !user.active;
            default:
              return true;
          }
        })
        .filter((user) => user.name.toLowerCase().includes(filter.search!.toLowerCase())),
    ),
  );

  get users(): UserEntity[] {
    return this.users$$.getValue();
  }

  set users(users: UserEntity[]) {
    this.users$$.next(users);
    this.localStorageService.set(StorageKey.USERS, users);
  }

  initUsers(): Observable<UserEntity[]> {
    const usersFromStorage = this.localStorageService.get<UserEntity[]>(StorageKey.USERS);

    if (usersFromStorage?.length) {
      return of(usersFromStorage);
    }

    return this.usersApiService.getUsers();
  }

  changeUsersFilter(filter: UsersFilter = { search: '', status: UsersFilterStatus.ALL }): void {
    this.filter$$.next(filter);
  }

  selectUser(user: UserEntity | null): void {
    this.selectedUser$$.next(user);
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
