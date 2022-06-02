import React from "react";
import styled from "styled-components";

const Button = () => {
  return <ButtonWrapper>Сохранить</ButtonWrapper>;
};

const ButtonWrapper = styled.button`
  height: 45px;

  border: none;
  border-radius: 8px;

  background: #497fff;
  color: #fff;

  font-family: "Medium";

  cursor: pointer;

  &:hover {
    background-color: #497ebf;
  }
`;

export default Button;
