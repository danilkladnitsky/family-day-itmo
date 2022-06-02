import React from "react";
import styled from "styled-components";

interface Props {
  children: React.ReactElement;
}

const Header = ({ children }: Props) => {
  return <HeaderComponent>{children}</HeaderComponent>;
};

const HeaderComponent = styled.div`
  font-size: 18px;
  font-family: "Bold";

  margin-bottom: 25px;

  display: flex;
  align-items: center;
  gap: 10px;
`;

export default Header;
