import { addPage } from "entities/page";
import Add from './Icon';
import { setPageState } from "entities/page/store";

const NewItem = () => {
  const handleClick = async () => {
    const newPage = await addPage();
    if (newPage) {
      setPageState(state => ({
        ...state,
        pages: [...state.pages, newPage]
      }))
    }
  }
  return <div onClick={handleClick}><Add /></div>;
}

export default NewItem;
