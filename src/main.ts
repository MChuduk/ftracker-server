import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

(async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await bindPort(app);
})();

async function bindPort(app: INestApplication) {
  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get<number>('app.port');
  await app.listen(port);
}
