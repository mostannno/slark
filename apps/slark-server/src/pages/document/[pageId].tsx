// import Document from '../../../slark-frontend/src/pages/document';
import React from "react";
import Script from "next/script";
import {
  TodoContainer,
  buildTodo,
  initStore as initListStore,
  useStore,
} from "@slark/ui/entities/list";
import { initStore as initPageStore } from "@slark/ui/entities/page";
import { List } from "@slark/ui/widgets";
// import { buildTodo, initStore as initListStore } from "@slark/ui/es/entities/list";
// import { initStore as initPageStore } from "@slark/ui/es/entities/page";
// import { buildTodo } from "@slark/ui/entities/list/request";
import ClientRenderer from "../../utils/ClientRenderer";
import { useRouter } from "next/router";
import { PageInterface } from "src/database/page.js";
import { TodoInterface } from "src/database/todo";

// BE 的数据中， todo 是没有 parent 字段的，需要先填充上去
// export function buildTodo(entities: TodoInterface[]) {
//   const child2ParentMap: Record<string, string> = {};
//   const entityMap: Record<string, TodoInterface> = {};
//   entities.forEach((v) => {
//     entityMap[v.id] = v;
//   });
//   entities.forEach((v) => {
//     if (v.child) {
//       let m: string | null = `${v.child}`;
//       while (m) {
//         const e = entityMap[m] as TodoInterface;
//         child2ParentMap[m] = `${v.id}`;
//         m = `${e.next}`;
//       }
//     }
//   });
//   return entities.map((v) => {
//     return {
//       ...v,
//       parent: child2ParentMap[v.id] || "TodoContainer",
//     };
//   });
// }

const Index: React.FC<{
  page: PageInterface;
  todos: TodoInterface[];
}> = ({ page, todos }) => {
  const sortedTodos = buildTodo(todos as any);
  const todoEntities = {
    [TodoContainer]: {
      id: TodoContainer,
      title: "",
      parent: "",
      child: null,
      next: null,
      pageId: "0",
    },
  };
  sortedTodos.forEach((v) => {
    if (v.is_root) {
      todoEntities[TodoContainer].next = v.id;
    }
    todoEntities[v.id] = v;
  });
  initListStore(todoEntities);
  initPageStore({
    currentPageId: `${page.id}`,
    pages: [page].map((v) => ({ ...v, id: `${v.id}` })),
  });
  console.log(useStore.getState());
  return (
    <>
      {/* <ClientRenderer /> */}
      {/* <div>123123</div> */}
      <List id="TodoContainer" isContainer />
    </>
  );
};

const host = "http://localhost:3000";

export async function getServerSideProps(context) {
  const {
    params: { pageId },
  } = context;
  console.log("params", context.params);
  console.log("pageId", pageId);
  const result = await fetch(`${host}/page/getPageById`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      page_id: pageId,
    }),
  });
  const result2 = await fetch(`${host}/todo/queryAll`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      page_id: pageId,
    }),
  });
  const jsonRes = await result.json();
  const jsonRes2 = await result2.json();

  console.log("jsonRes", jsonRes);
  console.log("jsonRes2", jsonRes2);
  return {
    props: {
      page: jsonRes,
      todos: jsonRes2,
    }, // will be passed to the page component as props
  };
}

export default Index;
