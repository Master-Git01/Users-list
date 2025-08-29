import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserDTO, UserEntity } from '../interfaces/users.interface';
import { map, Observable } from 'rxjs';
import { MainPath } from '../../core/enums/main-path.enum';

@Injectable({
  providedIn: 'root',
})
export class UsersApiService {
  private readonly http: HttpClient = inject(HttpClient);

  getUsers(): Observable<UserEntity[]> {
    return this.http.get<UserDTO[]>(`/${MainPath.USERS}`).pipe(
      map((users: UserDTO[]) =>
        users.map((user: UserDTO) => {
          const { id, name, email } = user;
          return { id, name, email, active: id % 2 === 0 };
        }),
      ),
    );
  }
}
