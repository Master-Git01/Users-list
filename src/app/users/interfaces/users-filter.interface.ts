import { UsersFilterStatus } from '../enums/users-filter.enum';

export interface UsersFilter {
  search: string | undefined;
  status: UsersFilterStatus | undefined;
}
