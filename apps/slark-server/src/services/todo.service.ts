import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { TodoInterface } from 'src/database/todo';

@Injectable()
export class TodoService {
  constructor(private readonly storeService: DatabaseService) {}

  create(entity: Omit<TodoInterface, 'id'>) {
    return this.storeService.todo.insert(entity);
  }

  update(entity: TodoInterface) {
    return this.storeService.todo.update(entity);
  }

  delete(id: number) {
    return this.storeService.todo.delete(id);
  }

  batchDelete(ids: number[]) {
    return this.storeService.todo.batchDelete(ids);
  }

  queryAll() {
    this.storeService.todo.clear();
    return this.storeService.todo.queryAll();
  }

  queryPage(page_id: number) {
    return this.storeService.todo.queryPage(page_id)
  }
}
