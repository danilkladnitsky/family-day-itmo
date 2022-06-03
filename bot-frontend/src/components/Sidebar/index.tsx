import AddIcon from "@mui/icons-material/Add";
import BeenhereIcon from "@mui/icons-material/Beenhere";
import Header from "../Header/Header";
import MessagesList from "../Messages/MessagesList";
import { PopupTypes } from "../common/enum/popup.types.enum";
import React from "react";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import SubHeader from "../Header/SubHeader";
import styled from "styled-components";
import { useFlowContext } from "../../context/FlowProvider";

const navItems = [
  {
    name: "Создать сообщение от бота",
    popup: PopupTypes.CREATE_BOT_MESSAGE,
  },
  { name: "Создать команду", popup: PopupTypes.CREATE_COMMAND },
];

const Sidebar = () => {
  const { activatePanel } = useFlowContext();
  return (
    <SidebarWrapper>
      <Header>
        <SmartToyIcon color="info" /> ITMO Family
      </Header>
      <SubHeader>Функции</SubHeader>
      <Nav>
        {navItems.map((i, index) => (
          <NavItem onClick={() => activatePanel(i.popup)} key={index}>
            <NavIcon>
              <AddIcon />
            </NavIcon>
            <NavLabel>{i.name}</NavLabel>
          </NavItem>
        ))}
      </Nav>
      <SubHeader>Статус бота</SubHeader>
      <BotStatus>
        Работает <BeenhereIcon color="success" />
      </BotStatus>
      <SubHeader>Сообщение от пользователей</SubHeader>
      <MessagesList />
      <SidebarFooter>Powered by partnadem</SidebarFooter>
    </SidebarWrapper>
  );
};

const SidebarWrapper = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;

  height: 100vh;
  width: 350px;

  box-sizing: border-box;
  padding: 25px;
`;

const Nav = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 10px;

  margin-bottom: 25px;
`;

const NavItem = styled.button`
  display: flex;
  align-items: center;
  justify-content: left;
  padding: 0px;

  color: #4a7fff;
  font-family: "Medium";
  border: none;

  border-radius: 30px;
  cursor: pointer;

  text-align: left;

  background: none;

  &:hover {
    color: #497abf;
  }
`;

const NavIcon = styled.div`
  padding: 0px 5px;
`;

const NavLabel = styled.div``;

const SidebarFooter = styled.div`
  position: absolute;
  bottom: 0px;
  left: 0px;
  width: 100%;
  text-align: center;
  margin-bottom: 15px;
  font-size: 13px;

  color: #adb5c7;
`;

const BotStatus = styled.div`
  display: flex;
  align-items: center;

  margin-bottom: 30px;

  svg {
    margin-left: 8px;
  }
`;

export default Sidebar;
