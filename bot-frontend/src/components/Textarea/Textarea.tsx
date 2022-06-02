import React from "react";
import styled from "styled-components";

const Textarea = (props) => {
  return <Input {...props} />;
};

const Input = styled.textarea`
  min-height: 80px;
  padding: 10px 10px;
  box-sizing: border-box;
  border: none;
  background: #f3f5fa;
  border-radius: 4px;
  font-family: "Regular";
  resize: vertical;

  max-height: 300px;
  width: 100%;
`;

export default Textarea;
