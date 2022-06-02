import Button from "../Button/Button";
import { PopupTypes } from "../common/enum/popup.types.enum";
import React from "react";
import styled from "styled-components";
import { useFlowContext } from "../../context/FlowProvider";

interface Props {
  message: string;
  firstName: string;
  secondName: string;
  id: number;
  replyMessage: string;
}
const Message = ({
  message,
  firstName = "Пользователь",
  secondName,
  id,
  replyMessage,
}: Props) => {
  const { activatePanel, setCurrentUserMessage } = useFlowContext();
  const reply = () => {
    setCurrentUserMessage({ message, firstName, secondName, id, replyMessage });
    activatePanel(PopupTypes.REPLY_ON_MESSAGE);
  };

  return (
    <Wrapper>
      <Header>
        <User>{firstName || "Пользователь"}</User>
        <ReplyButton onClick={reply}>
          {replyMessage ? "Написать снова" : "Ответить"}
        </ReplyButton>
      </Header>
      <Text>{message}</Text>
    </Wrapper>
  );
};

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding-right: 15px;
`;

const Wrapper = styled.div`
  max-height: 150px;
  overflow-y: auto;
  padding: 8px 0px;
`;
const User = styled.div`
  font-weight: bold;
  font-size: 12px;
`;
const Text = styled.div``;

const ReplyButton = styled.button`
  background-color: unset;
  color: #497fff;
  padding: 0px;

  font-size: 12px;
`;

export default Message;
