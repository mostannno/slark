// import Document from '../../../slark-frontend/src/pages/document';
import React from "react";
import Script from "next/script";
import ClientRenderer from "../../utils/ClientRenderer";
import { useRouter } from "next/router";
import { PageInterface } from "src/database/page";

const Index: React.FC<{ page: PageInterface }> = ({ page, todos }) => {
  console.log("tanmiao", "page", page, todos);
  return (
    <>
      <ClientRenderer />
      {/* <Document /> */}
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
  return {
    props: {
      page: jsonRes,
      todos: jsonRes2,
    }, // will be passed to the page component as props
  };
}

export default Index;
