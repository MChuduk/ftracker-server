import { User } from '../../users/model';
import { Currency } from '../../currency/model';

export interface Wallet {
  id?: string;
  name: string;
  user: User;
  currency: Currency;
}
