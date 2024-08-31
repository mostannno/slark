import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { PageInterface } from 'src/database/page';

@Injectable()
export class PageService {
  constructor(private readonly storeService: DatabaseService) {}

  create(entity: Omit<PageInterface, 'id'>) {
    return this.storeService.page.insert(entity);
  }

  update(entity: PageInterface) {
    return this.storeService.page.update(entity);
  }

  delete(id: number) {
    return this.storeService.page.delete(id);
  }

  batchDelete(ids: number[]) {
    return this.storeService.page.batchDelete(ids);
  }

  queryAll() {
    return this.storeService.page.queryAll();
  }

  findMaxOrder() {
    return this.storeService.page.findMaxOrder();
  }
}
