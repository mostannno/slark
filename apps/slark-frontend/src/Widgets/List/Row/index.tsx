import { useEffect, useRef, useState } from "react";
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

export interface ItemProps {
  node: ListEntity & { isFocusing: boolean };
  handleEnter: (isEmpty: boolean, shouldUsePrevOne?: boolean) => void;
  handleTab: (withShift: boolean) => void;
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin-left: 20px;
`;

const Content = styled.div`
  min-height: 28px;
  width: 600px;
  display: block;
  margin-left: 12px;
  text-align: left;
  font-size: 16px;
  line-height: 28px;
  border: none;
  outline: none;
  color: #16181a;

  -webkit-font-smoothing: antialiased;
`;

const Prefix = styled.div`
  width: 6px;
  height: 6px;
  margin-top: 12px;
  border-radius: 50%;
  background-color: #5a5a5a;
`;

const Command = {
  Tab: 9,
  Enter: 13,

  Delete: 8,

  Up: 38,
  Down: 40,
};

export function Row(props: ItemProps) {
  const { node, handleEnter, handleTab } = props;
  const [initialState] = useState(node.title);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const { textContent } = e.currentTarget;
    updateListEntity({
      ...node,
      title: textContent || "",
    });
  };

  const handleFocus = () => {
    console.log("focus");
    updateStore((state) => {
      state.focusNode = node.id;
    });
  };

  const handleBlur = () => {
    updateStore((state) => {
      state.focusNode = "";
    });
  };

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
      if (!e.currentTarget.textContent) {
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

  useEffect(() => {
    if (node.isFocusing && contentRef.current) {
      contentRef.current.focus();
    }
  }, [node.isFocusing]);

  return (
    <Tooltip title={tip} placement="topLeft" mouseEnterDelay={1}>
      <Container>
        <Prefix />
        <Content
          ref={contentRef}
          contentEditable
          dangerouslySetInnerHTML={{
            __html: initialState,
          }}
          onKeyDown={onKeyDown}
          onInput={handleInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </Container>
    </Tooltip>
  );
}
