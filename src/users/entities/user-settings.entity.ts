import { Entity } from 'typeorm';
import { BaseEntity } from '../../common/entity';

@Entity('user_settings')
export class UserSettingsEntity extends BaseEntity {
}
