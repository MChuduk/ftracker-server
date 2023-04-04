import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UserEntity } from '../../users/entities';
import { BaseEntity } from '../../common/entity';

@Entity('transaction_categories')
export class TransactionCategoryEntity extends BaseEntity {
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
    name: 'svg_path',
    nullable: false,
  })
  svgPath: string;

  @Column({
    name: 'user_id',
    type: 'uuid',
    unique: true,
    nullable: true,
  })
  userId: string;

  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
