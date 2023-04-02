import { Entity, OneToMany } from 'typeorm';
import { TransactionCategoryEntity } from '../../transaction-categories/entity';
import { BaseEntity } from '../../common/entity';

@Entity('user_settings')
export class UserSettingsEntity extends BaseEntity {
  @OneToMany(
    () => TransactionCategoryEntity,
    (category) => category.userSettings,
  )
  activeCategories: TransactionCategoryEntity[];
}
