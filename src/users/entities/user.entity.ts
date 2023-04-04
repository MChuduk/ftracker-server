import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { UserSettingsEntity } from './user-settings.entity';
import { BaseEntity } from '../../common/entity';

@Entity('users')
export class UserEntity extends BaseEntity {
  @Column({
    name: 'display_name',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  displayName: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 255,
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({
    name: 'password',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  password: string;

  @Column({
    name: 'settings_id',
    type: 'uuid',
    nullable: false,
  })
  settingsId: string;

  @OneToOne(() => UserSettingsEntity, { nullable: false })
  @JoinColumn({ name: 'settings_id' })
  settings: UserSettingsEntity;
}
