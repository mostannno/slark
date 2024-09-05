import { List } from "widgets";
import styled from "styled-components";
import { TodoContainer, getAllTodo, updateStore } from "entities/list";
import { PageEntity, getAllPages } from "entities/page";
import { useEffect } from "react";
import Dir from "./Dir";
import useCommonStore, { setCommonState } from "../../store/commonStore";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

function Todo() {
  const currentPageId = useCommonStore((state) => state.currentPageId);

  useEffect(() => {
    getAllPages().then((pages) => {
      if (!("error" in pages)) {
        setCommonState((state) => {
          const allPages: PageEntity[] = [];
          pages.forEach((page) => {
            allPages.push(page);
          });
          return {
            ...state,
            currentPageId: allPages[0]!.id,
            pages: allPages,
          };
        });
      }
    });
  }, []);

  useEffect(() => {
    if (currentPageId) {
      getAllTodo(currentPageId).then((todos) => {
        if (!("error" in todos)) {
          updateStore((state) => {
            todos.forEach((todo) => {
              if (todo.is_root) {
                state.entities[TodoContainer]!.child = todo.id;
              }
              state.entities[todo.id] = todo;
            });
          }, false);
        }
      });
    }
  }, [currentPageId]);
  return (
    <Container>
      <List isContainer id={TodoContainer} />
      <Dir />
    </Container>
  );
}

export default Todo;
