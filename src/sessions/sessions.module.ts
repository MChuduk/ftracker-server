import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilsModule } from 'src/utils/utils.module';
import { SessionEntity } from './entities';
import { SessionsService } from './sessions.service';

@Module({
  imports: [TypeOrmModule.forFeature([SessionEntity]), UtilsModule],
  providers: [SessionsService],
  exports: [SessionsService],
})
export class SessionsModule {}
