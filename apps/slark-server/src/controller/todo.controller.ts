import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { TodoService } from '../services/todo.service';
import { TodoInterface, fromObject } from '../database/todo';

@Controller('todo')
export class TodoContoller {
  constructor(private readonly appService: TodoService) {}

  @Post('/create')
  async create(
    @Body()
    {
      next = null,
      title = '',
      page_id,
      is_root,
    }: {
      next?: number | null;
      title: string;
      page_id: number;
      is_root?: boolean;
    },
  ) {
    if (!page_id) {
      throw new HttpException('param error', HttpStatus.BAD_REQUEST);
    }
    const result = await this.appService.create({ title, next, page_id, is_root });
    console.log('create Result', result);
    return result;
  }

  @Post('/update')
  async update(@Body() body: TodoInterface[]) {
    if (!Array.isArray(body)) {
      throw new HttpException('param error', HttpStatus.BAD_REQUEST);
    }
    console.log('TodoContoller::updates', 'body', body);
    body
      .map((v) => Object.assign(fromObject(v)))
      .filter((v) => v.id)
      .forEach((updates) => {
        console.log('TodoContoller::updates', 'update', updates);
        this.appService.update(updates);
      });
  }

  @Post('/delete')
  async delete(@Body() body: { id: string }) {
    const { id } = body;
    if (!id) {
      throw new HttpException('param error', HttpStatus.BAD_REQUEST);
    }
    // todo @miao.tan Long int
    await this.appService.delete(parseInt(id, 10));
  }

  @Post('/batchDelete')
  async batchDelete(@Body() body: { ids: string[] }) {
    const { ids } = body;
    if (!ids) {
      throw new HttpException('param error', HttpStatus.BAD_REQUEST);
    }
    // todo @miao.tan Long int
    await this.appService.batchDelete(ids.map((v) => parseInt(v, 10)));
  }

  @Post('/queryAll')
  async queryAll(@Body() body: { page_id: string }) {
    const page_id = parseInt(body.page_id || '');
    if (!page_id) {
      throw new HttpException('param error', HttpStatus.BAD_REQUEST);
    }
    const rows = await this.appService.queryPage(page_id);
    if (!rows.length) {
      const result = await this.appService.create({
        title: '',
        is_root: true,
        page_id,
      });
      rows.push(result);
    }
    return rows;
  }
}
