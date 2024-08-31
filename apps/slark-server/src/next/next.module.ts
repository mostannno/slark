import {Module} from '@nestjs/common';
import {NextService} from './next.service';
import * as next from 'next/dist/server/next';

type NextServerConstructor = {
  dev?: boolean
}

@Module({
  providers: [NextService],
  exports: [
    NextService
  ]
})
export class NextModule{
  constructor(
    private readonly next: NextService
  ) {}

  public async prepare(options?: NextServerConstructor) {
    const app = (next.default as any)(Object.assign({
      dev: process.env.NODE_ENV !== 'production',
      dir: process.cwd(),
    }, options || {}));
    return app.prepare().then(()=>this.next.setApp(app));
  }
}