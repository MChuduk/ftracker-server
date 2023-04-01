import { User } from '../../users/model';

export interface Session {
  id?: string;
  user: User;
  refreshToken: string;
}
