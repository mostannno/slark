import { ctorSql, ctorValue, isValidField } from './ctorSql';
import { Pool } from 'pg';
import { catchAndLog } from './decorators';

export interface PageInterface {
  id: number;
  title: string;
  order: number;
}

export function fromObject(params: PageInterface) {
  return {
    id: params.id,
    title: params.title,
  };
}

class Page {
  constructor(private readonly pool: Pool) {}

  @catchAndLog
  async insert(page: Omit<PageInterface, 'id'>) {
    const { title, order } = page;
    const [col, val] = ctorSql([
      ['title', title],
      ['"order"', order],
    ]);

    console.log(`INSERT INTO todo."page"(${col}) VALUES(${val}) RETURNING id`);
    const result = await this.pool.query<PageInterface>(
      `INSERT INTO todo."page"(${col}) VALUES(${val}) RETURNING id`,
    );
    const { rows } = result;
    const [lastInsert] = rows;
    return {
      ...page,
      ...lastInsert,
    };
  }

  @catchAndLog
  async query(id: number) {
    const result = await this.pool.query<PageInterface>(
      `SELECT id FROM todo."page" WHERE id = ${id}`,
    );
    const { rows } = result;
    return rows;
  }

  @catchAndLog
  async update(entity: PageInterface) {
    const { id, ...rest } = entity;
    const updateFileds = Object.entries(rest);
    const sql = updateFileds.reduce((prev, current) => {
      if (!isValidField(current[1])) return prev;
      if (prev) prev += ', ';
      prev += `${current[0]}=${ctorValue(current[1])}`;
      return prev;
    }, '');
    await this.pool.query<PageInterface>(
      `UPDATE todo."page" SET ${sql} WHERE ID = ${id}`,
    );
  }

  @catchAndLog
  async delete(id: number) {
    const result = await this.pool.query(
      `DELETE FROM todo."page" WHERE ID = ${id}`,
    );
    return result;
  }

  @catchAndLog
  async batchDelete(ids: number[]) {
    console.log('batch delete', ids);
    const result = await this.pool.query(
      `DELETE FROM todo."page" WHERE ID IN (${ids})`,
    );
    return result;
  }

  @catchAndLog
  async queryAll() {
    const result = await this.pool.query<PageInterface>(
      `SELECT * FROM todo."page"`,
    );
    const { rows } = result;
    return rows;
  }

  @catchAndLog
  async findMaxOrder() {
    const result = await this.pool.query<PageInterface>(
      `SELECT max("order") FROM todo."page"`,
    );
    const { rows } = result;
    return rows[0] as any as { max: number };
  }
}

export default Page;
