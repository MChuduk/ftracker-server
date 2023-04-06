import { Currency } from '../../currency/model';

export interface Wallet {
  id?: string;
  name: string;
  userId: string;
  currencyId: string;
  currency?: Currency;
}
