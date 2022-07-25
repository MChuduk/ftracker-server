import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { UtilsModule } from 'src/utils/utils.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAccessTokenStrategy, JwtRefreshTokenStrategy } from './strategies';

@Module({
  imports: [JwtModule.register({}), UsersModule, UtilsModule],
  exports: [AuthService],
  controllers: [AuthController],
  providers: [AuthService, JwtAccessTokenStrategy, JwtRefreshTokenStrategy],
})
export class AuthModule {}
