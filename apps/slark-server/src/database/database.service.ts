import { Injectable } from '@nestjs/common';
import TodoEvents from './todo';
import PageEvents from './page';
import createPool from './createPool';

@Injectable()
export class DatabaseService {
  private pool = createPool({ database: 'postgres' });
  todo = new TodoEvents(this.pool);
  page = new PageEvents(this.pool);
}
