import Button from "../Button/Button";
import ValidationSubtitle from "../ValidationSubtitle/ValidationSubtitle";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import SubHeader from "../Header/SubHeader";
import { useFlowContext } from "../../context/FlowProvider";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Checkbox } from "@material-ui/core";
import { useEffect, useState } from "react";
import { NodeTypes } from "../common/enum/node.types.enum";

interface Props {
  mode: "CREATE" | "UPDATE";
}

const EditBotMessage = ({ mode }: Props) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm();

  const {
    createBotMessage,
    updateBotMessage,
    deactivatePanel,
    currentMessage,
    panels,
  } = useFlowContext();

  const activePanel = panels.find((p) => p.active);

  const onSubmit = (data: { message: string }) => {
    if (mode === "CREATE") {
      createBotMessage(data.message);
    } else {
      currentMessage &&
        updateBotMessage(
          currentMessage?.id,
          data.message,
          messageIsCommand ? NodeTypes.COMMAND : NodeTypes.TEXT
        );
    }

    if (!activePanel) {
      return;
    }

    deactivatePanel(activePanel?.type);
  };

  const headerTitle =
    mode === "CREATE"
      ? "Создание сообщения от бота"
      : "Редактирование сообщения от бота";

  const textareaPlaceholder = "Введите сообщение...";

  const textareaValue = mode === "UPDATE" && currentMessage?.data.label;

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
  }, [textareaValue]);

  return (
    <FormWrapper>
      <SubHeader>{headerTitle}</SubHeader>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <textarea
          placeholder={textareaPlaceholder}
          {...register("message", { required: true })}
        />
        {errors.message && (
          <ValidationSubtitle>
            Необходимо заполнить поле выше
          </ValidationSubtitle>
        )}
        <FormControlLabel
          control={<Checkbox />}
          label="Команда"
          checked={messageIsCommand}
          onChange={handleLinkTypeChange}
        />

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

export default EditBotMessage;
