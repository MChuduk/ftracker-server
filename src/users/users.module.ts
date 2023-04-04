import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilsModule } from 'src/utils/utils.module';
import { UserEntity, UserSettingsEntity } from './entities';
import { UsersService } from './users.service';
import { TransactionCategoriesModule } from '../transaction-categories/transaction-categories.module';

@Module({
  imports: [
    forwardRef(() => TransactionCategoriesModule),
    TypeOrmModule.forFeature([UserEntity, UserSettingsEntity]),
    UtilsModule,
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
