import { Role } from '../enums/users-role';

export interface JwtUser {
  userId: string;
  email: string;
  role: Role.user;
}
