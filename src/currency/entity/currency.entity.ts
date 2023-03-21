import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CurrencyType } from '../enum';

@Entity({ name: 'currency' })
export class CurrencyEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: CurrencyType,
    default: CurrencyType.BYN,
    unique: true,
  })
  type: CurrencyType;

  @Column({ name: 'BYN' })
  BYN: number;

  @Column({ name: 'USD' })
  USD: number;

  @Column({ name: 'EUR' })
  EUR: number;
}
