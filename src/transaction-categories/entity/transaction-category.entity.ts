import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UserSettingsEntity } from '../../users/entities';
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
    length: 255,
    nullable: false,
  })
  svgPath: string;

  @Column({
    name: 'user_settings_id',
    type: 'uuid',
    unique: true,
    nullable: true,
  })
  userSettingsId: string;

  @ManyToOne(() => UserSettingsEntity, { nullable: true })
  @JoinColumn({ name: 'user_settings_id' })
  userSettings: UserSettingsEntity;
}
