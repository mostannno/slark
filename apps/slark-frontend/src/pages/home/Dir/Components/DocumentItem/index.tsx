import React, { useEffect, useState } from "react";
import { Modal, Input } from "antd";
import styled from "styled-components";
import DocIcon from "./docIcon";
import { updatePage } from "entities/page";
import { Memu } from "../Memu";
import { setPageState } from "entities/page/store";

const Container = styled.div<{ selected?: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  height: 32px;
  max-width: 300px;
  margin-bottom: 4px;
  padding: 0 30px;

  border-radius: 4px;
  font-size: 14px;

  background: ${(props) => (props.selected ? "rgb(240, 239, 238)" : "none")};
  & > div > span {
    color: ${(props) => (props.selected ? "black" : "none")};
  }

  & > div:last-child {
    display: none;
  }

  &:hover {
    background: rgb(240, 239, 238);
    cursor: pointer;

    & > div > span {
      color: black;
    }

    & > div:last-child {
      display: flex;
    }
  }
`;

const Content = styled.span`
  margin-left: 12px;
  color: rgb(117, 117, 125);
`;

const MainLeft = styled.div`
  display: flex;
  justify-content: center;
  align-items: space-between;
`;

const DocumentItem: React.FC<{
  id: string;
  name: string;
  selected: boolean;
  handleSelect: (id: string) => void;
}> = (props) => {
  const { name, selected, handleSelect, id } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(name);

  const handleRename = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  useEffect(() => {
    setValue(name);
  }, [name]);

  const handleConfirm = () => {
    if (value) {
      updatePage([{ id, title: value }]).then(() => {
        setPageState((store) => {
          const { pages } = store;
          const targetIndex = pages.findIndex((v) => v.id === id);
          const target = pages[targetIndex]!;
          const newPages = [...pages];
          newPages.splice(targetIndex, 1, {
            ...target,
            title: value,
          });
          return {
            pages: newPages,
          };
        });
      });
    }
    setValue("");
    setIsEditing(false);
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue(e.target.value);
  };

  return (
    <>
      <Container
        selected={selected}
        onClick={() => {
          handleSelect(id);
        }}
      >
        <MainLeft>
          <DocIcon />
          <Content>{name}</Content>
        </MainLeft>
        <Memu handleRename={handleRename} id={id} />
      </Container>
      <Modal
        open={isEditing}
        title="重命名文档"
        onCancel={handleCancel}
        onOk={handleConfirm}
      >
        <Input maxLength={20} value={value} onChange={handleChange} />
      </Modal>
    </>
  );
};

export default DocumentItem;
