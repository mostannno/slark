import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { NextModule } from './next/next.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  // 使next初始化
  await app.get(NextModule).prepare().then(()=>{
    app.listen(3000);
  })
}
bootstrap();
