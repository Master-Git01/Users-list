import { Routes } from '@angular/router';
import { MainPath } from './core/enums/main-path.enum';

export const routes: Routes = [
  {
    path: MainPath.ROOT,
    loadComponent: () =>
      import('./users/pages/users/users.component').then((c) => c.UsersComponent),
  },
];
