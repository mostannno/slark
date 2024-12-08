import { useRef, useEffect, useCallback } from "react";
import { Tooltip } from "antd";
import styled from "styled-components";
import {
  updateListEntity,
  findPrev,
  findNext,
  findPrevSibling,
  updateStore,
  ListEntity,
  TodoContainer,
} from "entities/list";
import { Container, Prefix } from "./style";

export interface ItemProps {
  node: ListEntity & { isFocusing: boolean };
  handleEnter: (isEmpty: boolean, shouldUsePrevOne?: boolean) => void;
  handleTab: (withShift: boolean) => void;
}

const StyledInput = styled.div`
  font-size: 16px;
  display: flex;
  margin-left: 5px;
  line-height: 28px;
  border: none;
  outline: none;
  color: #16181a;

  -webkit-font-smoothing: antialiased;
`;

const Command = {
  Tab: 9,
  Enter: 13,

  Delete: 8,

  Up: 38,
  Down: 40,
};

export function Input(props: ItemProps) {
  const { node, handleEnter, handleTab } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    console.log("keyCode", e.keyCode);
    if (e.keyCode === Command.Tab) {
      console.log("[Key Event]", "Tab");
      e.preventDefault();
      handleTab(e.shiftKey);
    }
    if (e.keyCode === Command.Enter) {
      console.log(
        "[Key Event]",
        "Enter",
        (e.nativeEvent.target as HTMLInputElement).selectionStart === 0
      );
      e.preventDefault();
      handleEnter(
        false,
        (e.nativeEvent.target as HTMLInputElement).selectionStart === 0
      );
    }
    if (e.keyCode === Command.Up) {
      console.log("[Key Event]", "Up");
      e.preventDefault();
      const prev = findPrev(node.id);
      updateStore((state) => {
        state.focusNode = prev.id;
      });
    }
    if (e.keyCode === Command.Down) {
      console.log("[Key Event]", "Down");
      e.preventDefault();
      const nextNode = findNext(node);
      if (nextNode) {
        updateStore((state) => {
          state.focusNode = nextNode.id;
        });
      }
    }
    if (e.keyCode === Command.Delete) {
      if (!inputRef.current!.value) {
        console.log("[Key Event]", "Delete");
        e.preventDefault();
        updateStore((state) => {
          const writableParent = state.entities[node.parent]!;
          // 唯一节点不能被删除 有 child 的节点不能被 delete 删除
          if (
            (state.entities[TodoContainer]!.child === node.id && !node.next) ||
            node.child
          )
            return;
          const prevSibling = findPrevSibling(node.id, state.entities);
          if (!prevSibling) {
            if (node.next) {
              writableParent.child = node.next;
            } else {
              writableParent.child = null;
            }
            state.focusNode = writableParent.id;
          } else {
            prevSibling.next = node.next || null;
            state.focusNode = prevSibling.id;
          }
          if (node.is_root) {
            if (node.next) {
              state.entities[node.next]!.is_root = true;
            }
          }
          delete state.entities[node.id];
        });
      }
    }
  };

  const handleChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      const { value } = e.target;
      updateListEntity({
        ...node,
        title: value,
      });
    },
    [node]
  );

  const handleFocus = () => {
    updateStore((state) => {
      state.focusNode = node.id;
    });
  };

  const handleBlur = () => {
    updateStore((state) => {
      state.focusNode = "";
    });
  };

  useEffect(() => {
    if (node.isFocusing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [node.isFocusing]);

  const tip = (
    <>
      <p>{`id: ${node.id}`}</p>
      {node.parent && node.parent !== TodoContainer && (
        <p>{`parent: ${node.parent}`}</p>
      )}
      {node.next && <p>{`next: ${node.next}`}</p>}
      {node.child && <p>{`child: ${node.child}`}</p>}
    </>
  );

  return (
    <Tooltip title={tip} placement="topLeft" mouseEnterDelay={1}>
      <Container>
        <Prefix />
        <StyledInput
          contentEditable
          ref={inputRef}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoFocus={!!node.isFocusing}
          onKeyDown={onKeyDown}
        >
          {node.title}
        </StyledInput>
      </Container>
    </Tooltip>
  );
}
