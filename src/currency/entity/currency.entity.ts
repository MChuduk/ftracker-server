import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CurrencyType } from '../model';

@Entity({ name: 'currency' })
export class CurrencyEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: CurrencyType,
  })
  type: CurrencyType;

  @Column()
  name: string;

  @Column()
  color: string;

  @Column({
    type: 'decimal',
  })
  rate: number;
}
