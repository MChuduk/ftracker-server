export interface Transaction {
  id?: string;
  amount: number;
  description: string;
  date: Date;
  walletId: string;
  userId: string;
}
