import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PreAuthMiddleware } from './common/middlewares/preAuth.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(PreAuthMiddleware);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
