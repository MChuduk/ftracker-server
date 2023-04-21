import { Column, Entity } from 'typeorm';
import { CurrencyType } from '../model';
import { BaseEntity } from '../../common/entity';

@Entity({ name: 'currency' })
export class CurrencyEntity extends BaseEntity {
  @Column({
    enumName: 'type',
    type: 'enum',
    enum: CurrencyType,
    nullable: false,
  })
  type: CurrencyType;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  name: string;

  @Column({
    name: 'color',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  color: string;

  @Column({
    name: 'rate',
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: false,
  })
  rate: number;
}
