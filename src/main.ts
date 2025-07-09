import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: "*",
    methods: ["*"],
    credentials: false
  })
  await app.listen(process.env.PORT ?? 8888, "0.0.0.0");
}
bootstrap();
