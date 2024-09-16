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

const { setState: setPageState, getState: getPageState } = useStore;

const initStore = (state: CommonStore) => {
  setPageState({ ...state });
};

export { setPageState, getPageState };

export default useStore;
