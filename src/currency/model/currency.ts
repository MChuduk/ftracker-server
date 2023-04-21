import { CurrencyType } from './currency.enum';

export interface Currency {
  id?: string;
  type: CurrencyType;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  color: string;
  rate: number;
}
