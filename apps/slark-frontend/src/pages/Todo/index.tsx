import { List } from "Widgets";
import styled from "styled-components";
import { TodoContainer } from "model/constants";
import { PageEntity } from "model/page";
import { useEffect } from "react";
import { getAllTodo } from "services/todo";
import { getAllPages } from "services/page";
import Dir from "./Dir";
import { updateStore } from "../../store/todoStore";
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
            currentPageId: allPages[0].id,
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
                state.entities[TodoContainer].child = todo.id;
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
