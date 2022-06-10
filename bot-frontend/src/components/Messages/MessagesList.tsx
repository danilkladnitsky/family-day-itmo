import React, { useEffect } from "react";

import Message from "./Message";
import styled from "styled-components";
import { useFlowContext } from "../../context/FlowProvider";

const MessagesList = () => {
  const { messages, getMessagesFromUser } = useFlowContext();

  console.log(messages);

  useEffect(() => {
    getMessagesFromUser();
  }, []);

  return (
    <Wrapper>
      {messages.map((m) => (
        <Message {...m} />
      ))}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  max-height: 100%;
  overflow-y: auto;
`;

export default MessagesList;
