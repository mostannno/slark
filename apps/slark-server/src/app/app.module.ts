import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { TodoContoller } from '../controller/todo.controller';
import { TodoService } from '../services/todo.service';
import { PageContoller } from '../controller/page.controller';
import { PageService } from '../services/page.service';
import { NextMiddleware } from '../next/next.middleware';
import { NextModule } from '../next/next.module';
import { AppController } from './app.controller';

@Module({
  imports: [DatabaseModule, NextModule],
  controllers: [TodoContoller, PageContoller, AppController],
  providers: [TodoService, PageService],
})
export class AppModule {
  public configure(consumer: MiddlewareConsumer) {
    AppModule.handleAssets(consumer);
  }

  // 注意：这里很重要，_next*是nextjs静态资源请求的前缀，这里这么处理是将静态资源相关的请求由Nest转交个Next处理
  private static handleAssets(consumer: MiddlewareConsumer):void {
    consumer.apply(NextMiddleware)
      .forRoutes({
        path: '_next*',
        method: RequestMethod.GET
      })
  }
}
