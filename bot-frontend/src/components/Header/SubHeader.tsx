import React from "react";
import styled from "styled-components";

interface Props {
  children: React.ReactElement;
}

const SubHeader = ({ children }: Props) => {
  return <SubHeaderComponent>{children}</SubHeaderComponent>;
};

const SubHeaderComponent = styled.div`
  font-family: "Semibold";
  font-size: 14px;
  margin-bottom: 15px;
`;

export default SubHeader;
