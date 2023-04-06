import { Wallet } from '../../wallets/model';
import { TransactionCategory } from '../../transaction-categories/model';

export interface Transaction {
  id?: string;
  amount: number;
  description: string;
  date: Date;
  categoryId: string;
  walletId: string;
  userId: string;
  wallet?: Wallet;
  category?: TransactionCategory;
}
