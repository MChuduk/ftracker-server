import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAccessGuard } from './auth/guards';
import { join } from 'path';
import { ApolloDriver } from '@nestjs/apollo';
import { dataSourceOptions } from './config/database.config';
import { WalletsModule } from './wallets/wallets.module';
import { CurrencyModule } from './currency/currency.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TransactionsModule } from './transactions/transactions.module';
import { TransactionCategoriesModule } from './transaction-categories/transaction-categories.module';
import { StatsModule } from './stats/stats.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      cors: {
        origin: 'http://192.168.217.10:3000',
        credentials: true,
      },
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      useGlobalPrefix: true,
      context: ({ req, res }) => ({ req, res }),
    }),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    AuthModule,
    WalletsModule,
    CurrencyModule,
    TransactionsModule,
    TransactionCategoriesModule,
    StatsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAccessGuard,
    },
  ],
})
export class AppModule {}
