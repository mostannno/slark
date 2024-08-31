import styled from "styled-components";
import { addPage } from "services/page";
import Add from './Icon';
import { setCommonState } from "store/commonStore";

const NewItem = () => {
  const handleClick = async () => {
    const newPage = await addPage();
    if (newPage) {
      setCommonState(state => ({
        ...state,
        pages: [...state.pages, newPage]
      }))
    }
  }
  return <div onClick={handleClick}><Add /></div>;
}

export default NewItem;
