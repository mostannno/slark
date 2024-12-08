import { useEffect, useState } from "react";
import { List } from "widgets";
import { useParams } from "react-router";
import styled from "styled-components";
import { TodoContainer, getAllTodo, updateStore } from "entities/list";
import { PageEntity, getPageById } from "entities/page";

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
  margin-bottom: 40px;
  font-weight: 500;
  cursor: default;
`;

function Document() {
  const { pageId } = useParams();
  const [page, setPage] = useState<PageEntity | null>(null);

  useEffect(() => {
    if (pageId) {
      getPageById(pageId).then((page) => {
        setPage(page);
      });
    }
  }, [pageId]);

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
    <ListContainer>
      {page && <ListTitle>{page.title}</ListTitle>}
      <List id={TodoContainer} />
    </ListContainer>
  );
}

export default Document;
