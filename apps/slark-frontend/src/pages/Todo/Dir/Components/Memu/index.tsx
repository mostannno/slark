import styled from "styled-components";
import { Dropdown } from "antd";
import type { MenuProps } from "antd";
import { useCallback, useMemo } from "react";
import { deletePage } from "services/page";
import { setCommonState } from "store/commonStore";

const Dot = styled.div`
  background-color: #000;
  width: 2.5px;
  height: 2.5px;
  border-radius: 50%;
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  height: 16px;
  width: 16px;
  border-radius: 2px;
  padding: 1px;

  &:hover {
    background-color: #d3d3d3;
  }

  & > div + div {
    margin-left: 2px;
  }
`;

interface MemuProps {
  id: string;
  handleRename?: (id: string) => void;
}

export function Memu(props: MemuProps) {
  const { id, handleRename } = props;
  const handleClick = useCallback(
    (key: string) => {
      console.log('key=', key);
      if (key === "0") {
        deletePage(id);
        setCommonState((state) => {
          const { pages } = state;
          const target = pages.findIndex((v) => v.id === id);
          if (target >= 0) {
            return {
              ...state,
              pages: [...pages.slice(0, target), ...pages.slice(target + 1)],
            };
          }
          return state;
        });
      }
      if (key === "1") {
        handleRename?.(id);
      }
    },
    [id]
  );
  const items = useMemo<MenuProps["items"]>(
    () => [
      {
        label: "删除",
        key: "0",
        onClick: ({ key }) => {
          handleClick(key);
        },
      },
      {
        label: "重命名",
        key: "1",
        onClick: ({ key }) => {
          handleClick(key);
        },
      },
    ],

    [handleClick]
  );

  const handleContainerClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();
  };
  return (
    <div onClick={handleContainerClick}>
      <Dropdown menu={{ items }} trigger={["click"]}>
        <Container>
          <Dot />
          <Dot />
          <Dot />
        </Container>
      </Dropdown>
    </div>
  );
}
