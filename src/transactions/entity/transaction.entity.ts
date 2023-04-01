import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { WalletEntity } from '../../wallets/entities';
import { UserEntity } from '../../users/entities';

@Entity('transactions')
export class TransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal' })
  amount: number;

  @Column()
  description: string;

  @Column()
  date: Date;

  @ManyToOne(() => WalletEntity)
  wallet: WalletEntity;

  @ManyToOne(() => UserEntity)
  user: UserEntity;
}
