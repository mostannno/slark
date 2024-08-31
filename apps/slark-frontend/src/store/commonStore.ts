import { create } from "zustand";

interface Page {
  id: string;
  order: number;
  title: string;
}

interface CommonStore {
  pages: Page[];
  currentPageId?: string;
}

const useStore = create<CommonStore>(() => ({
  pages: [],
}));

const { setState: setCommonState, getState: getCommonState } = useStore;

export {
  setCommonState,
  getCommonState
}

export default useStore;
