import { List } from "widgets";
import styled from "styled-components";
import { TodoContainer, getAllTodo, updateStore } from "entities/list";
import { PageEntity, getAllPages } from "entities/page";
import { useEffect } from "react";
import Dir from "./Dir";
import useCommonStore, { setPageState } from "../../entities/page/store";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
  margin-left: 200px;
  padding-top: 60px;
`;

const ListTitle = styled.h1`
  margin-left: 40px;
  font-weight: 500;
  cursor: default;
`;

function Todo() {
  const page = useCommonStore((state) =>
    state.pages.find((v) => v.id === state.currentPageId)
  );

  useEffect(() => {
    getAllPages().then((pages) => {
      if (!("error" in pages)) {
        setPageState((state) => {
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
    if (page) {
      getAllTodo(page.id).then((todos) => {
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
  }, [page]);
  return (
    <Container>
      <Dir />
      <ListContainer>
        {page && (
          <ListTitle>
            {page.title}
          </ListTitle>
        )}
        <List isContainer id={TodoContainer} />
      </ListContainer>
    </Container>
  );
}

export default Todo;
