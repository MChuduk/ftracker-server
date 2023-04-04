export interface Transaction {
  id?: string;
  amount: number;
  description: string;
  date: Date;
  categoryId: string;
  walletId: string;
  userId: string;
}
