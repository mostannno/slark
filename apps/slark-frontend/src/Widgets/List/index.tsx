import { FC, useCallback, memo } from "react";
import styled from "styled-components";
import generateUUID from "../../shared/uuid";
import { Input } from "./Input";
import {
  findPrevSibling,
  findLast,
  useListEntity,
  ListEntity,
  updateStore,
  TodoContainer,
} from "entities/list";

import useStore from "entities/page/store";

const ForwardDiv = styled.div`
  margin-left: 20px;
`;

const ListContainer = styled.div`
  position: relative;
`;

const ListContent = styled.div`
  ::after {
    content: "";
    position: absolute;
    left: 2px;
    top: 0;
    width: 0.5px;
    height: 100%;
    background-color: gray;
  }
`;

interface ListNodeProps {
  id: string;
  isContainer?: boolean;
}

const OriginList: FC<ListNodeProps> = ({ isContainer, id }) => {
  const listNode = useListEntity(id);
  const pageId = useStore((state) => state.currentPageId)!;

  const handleEnter = useCallback(
    (isEmpty?: boolean, shouldUsePrevOne?: boolean) => {
      const generateId = generateUUID();
      const newNode: ListEntity = {
        id: generateId,
        title: "",
        next: null,
        parent: listNode.parent!,
        pageId,
        child: null,
      };
      updateStore((state) => {
        if (shouldUsePrevOne) {
          const prevSibling = findPrevSibling(listNode.id!, state.entities);
          console.log("entities", state.entities.TodoContainer!.id);
          if (prevSibling) {
            if (prevSibling.next) {
              const next = prevSibling.next;
              newNode.next = next;
            }
            state.entities[prevSibling.id]!.next = generateId;
            state.entities[generateId] = newNode;
            state.focusNode = newNode.id;
          } else {
            const root = state.entities[TodoContainer]!;
            if (root.child) {
              console.log("update root", state.entities[root.child]);
              state.entities[root.child]!.is_root = false;
              const next = root.child;
              newNode.next = next;
            }
            newNode.is_root = true;
            root.child = generateId;
            state.entities[generateId] = newNode;
            state.focusNode = newNode.id;
          }
        } else {
          if (listNode.next) {
            const next = listNode.next;
            newNode.next = next;
          }
          state.entities[listNode.id!]!.next = generateId;
          state.entities[generateId] = newNode;
          state.focusNode = newNode.id;
        }
      });
    },
    [pageId, listNode]
  );

  const handleTab = useCallback(
    (withShift: boolean) => {
      const parentId = listNode.parent!;
      console.log("[Tab Event]", "withShift", withShift);
      if (withShift) {
        if (parentId === TodoContainer) return;
        updateStore((state) => {
          const writableNode = state.entities[listNode.id!]!;
          const parent = state.entities[parentId]!;
          const prevNode = findPrevSibling(listNode.id!, state.entities);
          // 头节点
          if (!prevNode) {
            parent.child = listNode.next ? listNode.next : null;
          } else {
            prevNode.next = listNode.next!;
          }
          writableNode.parent = parent.parent;
          writableNode.next = parent.next;
          parent.next = listNode.id!;
        });
      } else {
        updateStore((state) => {
          const writableNode = state.entities[listNode.id!]!;
          const prevNode = findPrevSibling(listNode.id!, state.entities);

          if (prevNode) {
            if (prevNode.child) {
              const last = findLast(prevNode.child, state.entities);
              last.next = listNode.id!;
            } else {
              prevNode.child = listNode.id!;
            }
            prevNode.next = listNode.next!;
            writableNode.next = null;
            writableNode.parent = prevNode.id;
          }
        });
      }
    },
    [listNode]
  );

  const content = (
    <>
      {!isContainer && (
        <Input
          node={listNode as any}
          handleTab={handleTab}
          handleEnter={handleEnter}
        />
      )}
      {listNode.child && (
        <ForwardDiv>
          <List id={listNode.child} />
        </ForwardDiv>
      )}
    </>
  );

  console.log(
    "[after]",
    listNode.id,
    listNode.parent,
    listNode.parent !== TodoContainer
  );

  return (
    <>
      <ListContainer key={id} data-id={id}>
        {id === TodoContainer || listNode.parent === TodoContainer ? (
          <div>{content}</div>
        ) : (
          <ListContent>{content}</ListContent>
        )}
      </ListContainer>
      {listNode.next && <List id={listNode.next} />}
    </>
  );
};

export const List = memo(OriginList, (prev, next) => prev.id === next.id);
