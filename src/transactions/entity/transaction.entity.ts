import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { WalletEntity } from '../../wallets/entities';
import { UserEntity } from '../../users/entities';
import { BaseEntity } from '../../common/entity';
import { TransactionCategoryEntity } from '../../transaction-categories/entity';

@Entity('transactions')
export class TransactionEntity extends BaseEntity {
  @Column({
    name: 'amount',
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: false,
  })
  amount: number;

  @Column({
    name: 'description',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  description: string;

  @Column({
    name: 'date',
    type: 'date',
    nullable: false,
  })
  date: Date;

  @Column({
    name: 'category_id',
    type: 'uuid',
    nullable: false,
  })
  categoryId: string;

  @Column({
    name: 'wallet_id',
    type: 'uuid',
    nullable: false,
  })
  walletId: string;

  @Column({
    name: 'user_id',
    type: 'uuid',
    nullable: false,
  })
  userId: string;

  @ManyToOne(() => TransactionCategoryEntity, { nullable: false })
  @JoinColumn({ name: 'category_id' })
  category: TransactionCategoryEntity;

  @ManyToOne(() => WalletEntity, { nullable: false })
  @JoinColumn({ name: 'wallet_id' })
  wallet: WalletEntity;

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
