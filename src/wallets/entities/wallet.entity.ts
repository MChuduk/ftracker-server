import { UserEntity } from 'src/users/entities';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CurrencyEntity } from '../../currency/entity';
import { BaseEntity } from '../../common/entity';

@Entity('wallets')
export class WalletEntity extends BaseEntity {
  @Column({
    name: 'name',
    type: 'varchar',
    length: 255,
  })
  name: string;

  @Column({
    name: 'user_id',
    type: 'uuid',
    nullable: false,
  })
  userId: string;

  @Column({
    name: 'currency_id',
    type: 'uuid',
    nullable: false,
  })
  currencyId: string;

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => CurrencyEntity, { nullable: false })
  @JoinColumn({ name: 'currency_id' })
  currency: CurrencyEntity;
}
