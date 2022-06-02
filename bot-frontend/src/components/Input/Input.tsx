import React from "react";
import styled from "styled-components";

const Input = (props) => {
  return <InputWrapper {...props} />;
};

const InputWrapper = styled.input`
  width: 100%;
  min-height: 35px;
  padding: 0px 10px;
  box-sizing: border-box;
  border: none;
  background: #f3f5fa;
  border-radius: 4px;
  font-family: "Regular";
`;

export default Input;
