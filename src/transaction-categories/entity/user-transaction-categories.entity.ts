import { BaseEntity } from '../../common/entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UserEntity } from '../../users/entities';
import { TransactionCategoryEntity } from './index';

@Entity('user_transaction_categories')
export class UserTransactionCategoriesEntity extends BaseEntity {
  @Column({
    name: 'user_id',
    type: 'uuid',
    nullable: false,
  })
  userId: string;

  @Column({
    name: 'transaction_category_id',
    type: 'uuid',
    nullable: false,
  })
  transactionCategoryId: string;

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => TransactionCategoryEntity, { nullable: false })
  @JoinColumn({ name: 'transaction_category_id' })
  transactionCategory: TransactionCategoryEntity;
}
