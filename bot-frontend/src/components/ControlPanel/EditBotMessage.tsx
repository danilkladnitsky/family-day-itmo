import { useEffect, useState } from "react";

import Button from "../Button/Button";
import { Checkbox } from "@material-ui/core";
import FormControlLabel from "@mui/material/FormControlLabel";
import { NodeTypes } from "../common/enum/node.types.enum";
import SubHeader from "../Header/SubHeader";
import ValidationSubtitle from "../ValidationSubtitle/ValidationSubtitle";
import styled from "styled-components";
import { useFlowContext } from "../../context/FlowProvider";
import { useForm } from "react-hook-form";

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
    updatePhoto,
  } = useFlowContext();

  const [image, setImage] = useState(null);

  const activePanel = panels.find((p) => p.active);

  const onSubmit = async (data: { message: string }) => {
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

    // update photo
    if (image) {
      const formData = new FormData();

      formData.append("file", image, image.name);

      await updatePhoto(formData, currentMessage?.id);
    }

    if (!activePanel) {
      return;
    }

    deactivatePanel(activePanel?.type);
  };

  const handleImageUpload = (event) => {
    setImage(event.target.files[0]);
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
        <Image
          src={`https://itmo.partnadem.com/files/${currentMessage.attachedPhoto}`}
        />
        <p>Загрузить фотографию</p>
        <input name="myFile" type="file" onChange={handleImageUpload} />
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

const Image = styled.img`
  object-fit: contain;
`;

export default EditBotMessage;
