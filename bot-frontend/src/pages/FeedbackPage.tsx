import { useCallback, useEffect, useState } from "react";

import logo from "../assets/sevcabel_logo.jpg";
import styled from "styled-components";
import { useFlowContext } from "../context/FlowProvider";

let tg = window.Telegram.WebApp;
tg.MainButton.setText("Отправить");

tg.MainButton.onClick(() => tg.sendData("something"));

const FeedbackPage = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);

  const { sendMessageFromUser } = useFlowContext();

  const handleFeedbackSubmit = useCallback(async () => {
    if (!message) {
      setError("Нельзя отправить пустое сообщение");
      return;
    }

    setError(null);

    tg.sendData(message);

    //tg.close();
  }, [message]);

  useEffect(() => {
    tg.expand();
  }, []);

  tg.MainButton.onClick(tg.sendData("HHHH"));

  tg.MainButton.show();
  return (
    <Module>
      <Content>
        <Logo src={logo} />
        <Title>Напишите своё сообщение</Title>
        <Textarea
          placeholder="Текст сообщения"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
        {error}
        {!tg.initDataUnsafe.user && (
          <SendButton onClick={handleFeedbackSubmit}>Отправить</SendButton>
        )}
      </Content>
    </Module>
  );
};

const Logo = styled.img`
  height: 64px;
  width: 64px;
`;

const Title = styled.h3`
  margin: 0px;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
`;

const Textarea = styled.textarea``;

const Module = styled.div`
  height: 100%;
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: #fff;
`;

const Content = styled.div`
  width: 300px;
  height: fit-content;

  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 18px;

  & > button {
    width: 100%;
  }
`;

const SendButton = styled.button``;

export default FeedbackPage;
