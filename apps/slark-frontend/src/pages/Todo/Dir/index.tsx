import styled from "styled-components";
import DocumentItem from "./Components/DocumentItem";
import NewItem from "./Components/NewItem";
import { useCallback, useEffect, useState } from "react";
import useCommonStore from "store/commonStore";

const Container = styled.div`
  width: 280px;
  height: 100%;
`;

function Dir() {
  const pages = useCommonStore((state) => state.pages);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = useCallback((id: string) => {
    useCommonStore.setState({ currentPageId: id });
    setSelectedId(id);
  }, []);

  useEffect(() => {
    if (!selectedId) {
      const firstPageId = pages[0]?.id;
      setSelectedId(firstPageId);
    }
  }, [pages]);
  return (
    <Container>
      <div>我的文档</div>
      {pages.map((v) => (
        <DocumentItem
          key={v.id}
          id={v.id}
          name={v.title}
          selected={selectedId === v.id}
          handleSelect={handleSelect}
        />
      ))}
      <NewItem />
    </Container>
  );
}

export default Dir;
