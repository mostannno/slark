import useStore, { updateStore } from "./todoStore";
import { shallow } from "zustand/shallow";
import { ListEntity } from "./type";
import { TodoContainer } from './constants';

export function findPrevSibling(
  target: string,
  list = useStore.getState().entities
) {
  const targetNode = list[target]!;
  const startNode = list[targetNode.parent]!.child!;
  const node = list[startNode]!;
  if (node.id === target) return null;
  let current = node;
  let next = list[node.next!]!;
  while (next.id !== target) {
    current = next;
    if (!next.next) return null;
    next = list[next.next]!;
  }
  return current;
}

export function findLast(
  startNode: string,
  list = useStore.getState().entities
) {
  let node = list[startNode]!;
  while (node.next) {
    node = list[node.next]!;
  }
  return node;
}

export function findNext(
  node: ListEntity,
  list = useStore.getState().entities,
  fromChild = false
) {
  if (!fromChild && node.child) return list[node.child];
  if (node.next) return list[node.next];
  if (node.parent === TodoContainer) return null;
  return findNext(list[node.parent]!, list, true);
}

export function findPrev(id: string, list = useStore.getState().entities) {
  const node = list[id]!;
  const parent = list[node.parent]!;

  let sibling = findPrevSibling(id, list);
  if (!sibling) return parent;

  while (sibling.child) {
    sibling = findLast(sibling.child, list);
  }

  return sibling;
}

export function useListEntity(entityId: string) {
  return useStore(
    (state) => ({
      ...state.entities[entityId],
      isFocusing: state.entities[entityId]?.id === state.focusNode,
    }),
    shallow
  );
}

export function updateListEntity(updatedEntity: ListEntity) {
  updateStore((state) => {
    state.entities[updatedEntity.id] = updatedEntity;
  });
}
