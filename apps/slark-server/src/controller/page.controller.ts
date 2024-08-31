import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { PageService } from '../services/page.service';
import { PageInterface } from 'src/database/page';

@Controller('page')
export class PageContoller {
  constructor(private readonly appService: PageService) {}

  @Post('/create')
  async create(
    @Body()
    { title = '新建文档' }: { title: string },
  ) {
    let order = 1;
    const newOrder = await this.appService.findMaxOrder();
    if (newOrder) {
      order = newOrder.max;
    }
    const result = await this.appService.create({ title, order: order + 1 });
    console.log('PageContoller::create', result);
    return result;
  }

  @Post('/update')
  async update(@Body() body: PageInterface[]) {
    if (!Array.isArray(body)) {
      throw new HttpException('param error', HttpStatus.BAD_REQUEST);
    }
    console.log('PageContoller::updates', 'body', body);
    body
      .map((v) => ({
        title: v.title || '',
        id: v.id,
        order: v.order,
      }))
      .filter((v) => v.id)
      .forEach((updates) => {
        console.log('PageContoller::updates', 'update', updates);
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

  @Get('/queryAll')
  async queryAll() {
    const rows = await this.appService.queryAll();
    if (!rows.length) {
      const result = await this.appService.create({
        title: '我的文档',
        order: 1,
      });
      rows.push(result);
    }
    return rows;
  }
}
