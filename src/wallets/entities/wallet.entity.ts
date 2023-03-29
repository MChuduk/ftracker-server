import { UserEntity } from 'src/users/entities';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CurrencyEntity } from '../../currency/entity';

@Entity('wallets')
export class WalletEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  name: string;

  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @ManyToOne(() => CurrencyEntity, { nullable: false })
  currency: CurrencyEntity;
}
