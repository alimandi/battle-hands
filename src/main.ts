import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  // cors middleware
  app.enableCors();

  // load desired port from config
  const configService: ConfigService = app.get(ConfigService);
  const PORT = configService.get<number>('port');

  await app.listen(PORT, () => {
    Logger.log(`Listening at http://localhost:${PORT}`);
    Logger.log(`Running in ${configService.get('environment')}`);
  });
}
bootstrap();
