import { ctorSql, ctorValue, isValidField } from './ctorSql';
import { Pool } from 'pg';
import { catchAndLog } from './decorators';

export interface TodoInterface {
  id: number;
  title: string;
  is_root?: boolean;
  description?: string;
  due_date?: number;
  next?: number;
  child?: number;
  page_id: number;
}

export function fromObject(params: TodoInterface) {
  return {
    id: params.id,
    title: params.title,
    is_root: params.is_root,
    description: params.description,
    due_date: params.due_date,
    next: params.next,
    child: params.child,
  };
}

class TodoEvents {
  constructor(private readonly pool: Pool) {}

  @catchAndLog
  async insert(todo: Omit<TodoInterface, 'id'>) {
    const { title, description, due_date, next, child, is_root, page_id } = todo;
    const [col, val] = ctorSql([
      ['title', title],
      ['content', description],
      ['date', due_date],
      ['next', next],
      ['children', child],
      ['is_root', is_root],
      ['page_id', page_id],
    ]);

    const result = await this.pool.query<TodoInterface>(
      `INSERT INTO todo."todoEvent" (${col}) VALUES (${val}) RETURNING id`,
    );
    console.log(result, col, val);
    const { rows } = result;
    const [lastInsert] = rows;
    return {
      ...todo,
      ...lastInsert,
    };
  }

  @catchAndLog
  async query(id: number) {
    const result = await this.pool.query<TodoInterface>(
      `SELECT id FROM todo."todoEvent" WHERE id = ${id}`,
    );
    const { rows } = result;
    console.log('[tanmiao]', `query ${id}`, rows);
    return rows;
  }

  @catchAndLog
  async update(entity: TodoInterface) {
    const { id, ...rest } = entity;
    const updateFileds = Object.entries(rest);
    const sql = updateFileds.reduce((prev, current) => {
      if (!isValidField(current[1])) return prev;
      if (prev) prev += ', ';
      prev += `${current[0]}=${ctorValue(current[1])}`;
      return prev;
    }, '');
    console.log('[tanmiao]', 'update sql', sql);
    await this.pool.query<TodoInterface>(
      `UPDATE todo."todoEvent" SET ${sql} WHERE ID = ${id}`,
    );
  }

  @catchAndLog
  async delete(id: number) {
    const result = await this.pool.query(
      `DELETE FROM todo."todoEvent" WHERE ID = ${id}`,
    );
    console.log('[tanmiao]', `delete`, result);
    return result;
  }

  @catchAndLog
  async batchDelete(ids: number[]) {
    console.log('batch delete', ids);
    const result = await this.pool.query(
      `DELETE FROM todo."todoEvent" WHERE ID IN (${ids})`,
    );
    console.log('[tanmiao]', `batch delete`, result);
    return result;
  }

  @catchAndLog
  async queryAll() {
    const result = await this.pool.query<TodoInterface>(
      `SELECT * FROM todo."todoEvent"`,
    );
    const { rows } = result;
    console.log('[tanmiao]', `queryAll`, rows);
    return rows;
  }

  @catchAndLog
  async queryPage(page_id: number) {
    const result = await this.pool.query<TodoInterface>(
      `SELECT * FROM todo."todoEvent" WHERE page_id = ${page_id}`,
    );
    const { rows } = result;
    return rows;
  }

  @catchAndLog
  async clear() {
    type RelatedTodo = TodoInterface & { is_related?: boolean };
    const all_todos: RelatedTodo[] = await this.queryAll();
    const todo_map: Record<string, RelatedTodo> = {};
    all_todos.forEach((todo) => {
      todo_map[todo.id] = todo;
    });
    const root = all_todos.find((todo) => todo.is_root);
    if (!root) return;
    const unrelated = [];
    const loop = (node: RelatedTodo) => {
      if (!node) return;
      node.is_related = true;
      if (node.child) {
        loop(todo_map[node.child]);
      }
      if (node.next) {
        loop(todo_map[node.next]);
      }
    };
    loop(root);
    for (const key in all_todos) {
      if (!all_todos[key].is_related) {
        unrelated.push(all_todos[key].id);
      }
    }
    console.log('[clear]', all_todos.length, unrelated.length);
    if (unrelated.length) this.batchDelete(unrelated);
  }
}

export default TodoEvents;
