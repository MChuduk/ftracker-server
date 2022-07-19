import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

(async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupValidation(app);
  await bindPort(app);
})();

function setupValidation(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
}

async function bindPort(app: INestApplication) {
  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get<number>('APP_PORT') || 3000;
  await app.listen(port);
}
