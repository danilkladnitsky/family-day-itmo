import React from "react";
import styled from "styled-components";

interface Props {
  children: string;
}
const ValidationSubtitle = ({ children }: Props) => {
  return <Title>{children}</Title>;
};

const Title = styled.span`
  font-size: 12px;
`;

export default ValidationSubtitle;
