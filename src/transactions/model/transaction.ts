import { Wallet } from '../../wallets/model';
import { User } from '../../users/model';

export interface Transaction {
  id?: string;
  amount: number;
  description: string;
  date: Date;
  wallet: Wallet;
  user: User;
}
