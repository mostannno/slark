import styled from "styled-components";
import { ListEntity } from "entities/list";

export interface ItemProps {
  node: ListEntity & { isFocusing: boolean };
  handleEnter: (isEmpty: boolean, shouldUsePrevOne?: boolean) => void;
  handleTab: (withShift: boolean) => void;
}

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 20px;
`;

export const Prefix = styled.div`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: #5a5a5a;
`;
