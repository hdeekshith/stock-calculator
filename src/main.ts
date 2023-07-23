import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envConfig } from './config/env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(envConfig.port);
  console.log(`App listening on port : ${envConfig.port}`);
}
bootstrap();
