import { useEffect, useState } from "react";

import Button from "../Button/Button";
import { Checkbox } from "@material-ui/core";
import FormControlLabel from "@mui/material/FormControlLabel";
import { NodeTypes } from "../common/enum/node.types.enum";
import { PopupTypes } from "../common/enum/popup.types.enum";
import SubHeader from "../Header/SubHeader";
import ValidationSubtitle from "../ValidationSubtitle/ValidationSubtitle";
import styled from "styled-components";
import { useFlowContext } from "../../context/FlowProvider";
import { useForm } from "react-hook-form";

const MessageReply = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm();

  const {
    deactivatePanel,
    currentMessage,
    panels,
    replyOnUserMessage,
    currentUserMessage,
  } = useFlowContext();

  const activePanel = panels.find((p) => p.active) as PopupTypes;

  const onSubmit = (data: { message: string }) => {
    if (!currentUserMessage?.id) {
      return;
    }

    replyOnUserMessage(currentUserMessage?.id, data.message);
    deactivatePanel(activePanel?.type);
  };

  const headerTitle = "Ответ на сообщение пользователя";

  const textareaValue = "";

  const textareaPlaceholder = "Введите ответ на сообщение пользователя...";

  const [messageIsCommand, setMessageIsCommand] = useState(
    currentMessage?.type === NodeTypes.COMMAND
  );

  const handleLinkTypeChange = (event, status) => {
    setMessageIsCommand(status);
  };

  useEffect(() => {
    if (!textareaValue) {
      return;
    }

    setValue("message", textareaValue);
  }, [textareaValue, setValue]);

  console.log(currentUserMessage);

  return (
    <FormWrapper>
      <SubHeader>
        Ответить пользователю {currentUserMessage.firstName}{" "}
        {currentUserMessage.secondName}
      </SubHeader>
      <p>
        <b>Сообщение: </b>
        {currentUserMessage.message}
      </p>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <textarea
          placeholder={currentUserMessage.replyMessage || textareaPlaceholder}
          {...register("message", { required: true })}
        />
        {errors.message && (
          <ValidationSubtitle>
            Необходимо заполнить поле выше
          </ValidationSubtitle>
        )}
        <Button type="submit" />
      </Form>
    </FormWrapper>
  );
};

const FormWrapper = styled.div``;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 15px;
`;

export default MessageReply;
