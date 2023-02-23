import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAccessGuard } from './auth/guards';
import { join } from 'path';
import { ApolloDriver } from '@nestjs/apollo';
import { dataSourceOptions } from './config/database.config';

@Module({
  imports: [
    GraphQLModule.forRoot({
      cors: {
        origin: 'http://localhost:3000',
        credentials: true,
      },
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      useGlobalPrefix: true,
      context: ({ req, res }) => ({ req, res }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAccessGuard,
    },
  ],
})
export class AppModule {}
