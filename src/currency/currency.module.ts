import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrencyResolver } from './currency.resolver';
import { CurrencyService } from './currency.service';
import { CurrencyEntity } from './entity';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([CurrencyEntity])],
  providers: [CurrencyResolver, CurrencyService],
  exports: [CurrencyService],
})
export class CurrencyModule {}
