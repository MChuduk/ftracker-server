import { Session } from '../../sessions/model';

export interface SignInResponse {
  session: Session;
  accessCookie: string;
  refreshCookie: string;
}
