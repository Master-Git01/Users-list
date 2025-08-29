import { UsersFilterStatus } from '../enums/users-filter.enum';

export interface UserFilter {
  search: string;
  status: UsersFilterStatus;
}
