import { CurrencyType } from './currency.enum';

export interface Currency {
  id?: string;
  type: CurrencyType;
  name: string;
  color: string;
  rate: number;
}
