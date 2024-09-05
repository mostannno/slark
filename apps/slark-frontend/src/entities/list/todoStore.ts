import { create } from "zustand";
import { shallow } from "zustand/shallow";
import { Draft, produce } from "immer";
import { ListEntity } from "./type";
import { TodoContainer } from "./constants";
import { update, create as createTodo, remove } from "./request";
import { getCommonState } from "../../store/commonStore";

interface TodoStore {
  entities: Record<string, ListEntity>;
  focusNode: string;
}

const useStore = create<TodoStore>(() => ({
  entities: {
    [TodoContainer]: {
      id: TodoContainer,
      title: "",
      parent: "",
      child: null,
      next: null,
      pageId: "0",
    },
  },
  focusNode: "",
}));

(window as any).listStore = useStore;

async function applyAddPatches(patches: ListEntity) {
  const { currentPageId } = getCommonState();

  const { id, result } = await createTodo({
    ...patches,
    pageId: currentPageId!,
  });

  if (!("error" in result)) {
    updateStore((updateState) => {
      updateState.entities[id].real_id = result.id;
    });
  }
}

async function applyRemovePathes(ids: string[]) {
  return remove(ids);
}

async function applyUpdatePatches(patches: ListEntity[]) {
  return update(patches);
}

async function applyPatches(patches: any) {
  const { updateEntities, addEntity, removes, updateIds } = patches;
  if (addEntity) await applyAddPatches(addEntity);
  if (removes.length) await applyRemovePathes(removes);
  console.log("tanmiao", "do update");
  setTimeout(() => {
    if (updateEntities.length) applyUpdatePatches(updateEntities);
    if (updateIds.length) update(updateIds);
  }, 200);
}

export function useListEntities() {
  return useStore((state) => state.entities, shallow);
}

export const updateStore = (
  fn: (draft: Draft<TodoStore>) => void,
  allowPatch = true
) => {
  const state = useStore.getState();
  const { entities: originEntities } = state;
  const newState = produce(state, fn, (patches) => {
    if (!allowPatch) return;
    // const addPatches = {};
    // const updatePathces: Record<string, ListEntity> = {};
    const updateEntities: ListEntity[] = [];
    let addEntity: ListEntity | undefined = undefined;
    // const addEntities: ListEntity[] = [];
    const removes: string[] = [];
    const updateIds: Record<string, any> = [];
    patches.forEach(({ op, value, path }) => {
      const [target, key, prop] = path as string[];
      if (target !== "entities" || key === TodoContainer || key === "focusNode")
        return;
      if (op === "add") {
        if (originEntities[key]) return;
        addEntity = value;
        return;
      }
      if (op === "remove") {
        const id = originEntities[key].real_id || key;
        removes.push(id);
        return;
      }
      if (op === "replace") {
        // 更新 title 时会更新整个 object
        if (!prop) {
          updateEntities.push({ ...value });
        } else if (prop === "next" || prop === "child") {
          updateIds.push(state[target][key].id);
          // test[]
        }
        return;
      }
    });
    if (
      addEntity ||
      removes.length ||
      updateEntities.length ||
      updateIds.length
    )
      console.log("update patches", {
        addEntity,
        removes,
        updateEntities,
        updateIds,
      });

    applyPatches({
      addEntity,
      removes,
      updateEntities,
      updateIds,
    });
  });

  useStore.setState(newState, true);
};

export default useStore;
