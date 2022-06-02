import CloseTab from "../CloseTab/CloseTab";
import CreateBotMessage from "./EditBotMessage";
import EditBotLink from "./EditBotLink";
import Header from "../Header/Header";
import MessageReply from "./MessageReply";
import { PopupTypes } from "../common/enum/popup.types.enum";
import React from "react";
import SubHeader from "../Header/SubHeader";
import styled from "styled-components";
import { useFlowContext } from "../../context/FlowProvider";
import useSwitch from "@react-hook/switch";

const ControlPanel = () => {
  const { activatePanel, panels, deactivatePanel } = useFlowContext();

  const activePanel = panels.find((p) => p.active);

  const renderPanel = () => {
    if (!activePanel) {
      return;
    }

    switch (activePanel?.type) {
      case PopupTypes.CREATE_BOT_MESSAGE:
        return <CreateBotMessage mode="CREATE" />;
      case PopupTypes.UPDATE_BOT_MESSAGE:
        return <CreateBotMessage mode="UPDATE" />;
      case PopupTypes.UPDATE_LINK:
        return <EditBotLink />;
      case PopupTypes.REPLY_ON_MESSAGE:
        return <MessageReply />;
    }
  };
  return (
    activePanel && (
      <Panel>
        <CloseTab onClick={() => deactivatePanel(activePanel.type)} />
        {renderPanel()}
      </Panel>
    )
  );
};

const Panel = styled.div`
  position: absolute;
  padding: 25px;
  box-sizing: border-box;

  z-index: 6;
  right: 0px;
  top: 0px;
  height: 100vh;
  width: 400px;

  background-color: #fff;
`;

export default ControlPanel;
