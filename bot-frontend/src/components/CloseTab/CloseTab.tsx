import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import styled from "styled-components";

interface Props {
  onClick: Function;
}

const CloseTab = ({ onClick }: Props) => {
  return (
    <Tab onClick={onClick}>
      <CloseIcon />
    </Tab>
  );
};

const Tab = styled.div`
  position: absolute;
  right: 15px;
  top: 15px;

  cursor: pointer;
`;

export default CloseTab;
