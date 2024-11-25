import { jsonPost } from "shared/fetch";
import { ListEntity } from "./type";
import { TodoContainer } from "./constants";
import useStore from "./store";

function updateRealId(updates: ListEntity[] | string[]) {
  const entities = useStore.getState().entities;

  const ListEntities = updates.map((v) =>
    typeof v === "string" || typeof v === "number" ? entities[v] : v
  );

  return ListEntities.map((k) => {
    const v = { ...k };
    v.id = v.real_id || v.id;
    v.next = v.next
      ? entities[v.next]!.real_id || entities[v.next]!.id
      : v.next;
    v.parent = v.parent
      ? entities[v.parent]!.real_id || entities[v.parent]!.id
      : v.parent;
    v.child = v.child
      ? entities[v.child]!.real_id || entities[v.child]!.id
      : v.child;
    return v;
  });
}

type BackEndEntity = Omit<ListEntity, "parent">;
// BE 的数据中， todo 是没有 parent 字段的，需要先填充上去
export function buildTodo(entities: BackEndEntity[]) {
  const child2ParentMap: Record<string, string> = {};
  const entityMap: Record<string, BackEndEntity> = {};
  entities.forEach((v) => {
    entityMap[v.id] = v;
  });
  entities.forEach((v) => {
    if (v.child) {
      let m: string | null = v.child;
      while (m) {
        const e = entityMap[m] as BackEndEntity;
        child2ParentMap[m] = v.id;
        m = e.next;
      }
    }
  });
  return entities.map((v) => {
    return {
      ...v,
      parent: child2ParentMap[v.id] || TodoContainer,
    } as ListEntity;
  });
}

export async function getAllTodo(pageId: string) {
  const result = await jsonPost<Omit<ListEntity, "parent">[]>(
    "/todo/queryAll",
    { page_id: pageId }
  );
  return "error" in result ? [] : buildTodo(result);
}

export async function update(updates: ListEntity[] | string[]) {
  const result = await jsonPost("/todo/update", updateRealId(updates));
  return result;
}

export async function create(entity: ListEntity) {
  const { id, pageId, ...rest } = updateRealId([entity])[0]!;
  const result = await jsonPost<ListEntity>("/todo/create", {
    ...rest,
    page_id: pageId,
  });
  return { id, result };
}

export async function remove(ids: string[]) {
  return jsonPost("/todo/batchDelete", { ids });
}
