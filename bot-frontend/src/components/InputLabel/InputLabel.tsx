import React from "react";
import styled from "styled-components";

interface Props {
  children: React.ReactElement;
}

const InputLabel = ({ children }: Props) => {
  return <Label>{children}</Label>;
};

const Label = styled.div`
  font-size: 14px;
`;

export default InputLabel;
