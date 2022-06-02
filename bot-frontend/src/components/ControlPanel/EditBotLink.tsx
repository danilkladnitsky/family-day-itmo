import Button from "../Button/Button";
import ValidationSubtitle from "../ValidationSubtitle/ValidationSubtitle";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import SubHeader from "../Header/SubHeader";
import { useFlowContext } from "../../context/FlowProvider";
import InputLabel from "../InputLabel/InputLabel";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import FormControlLabel from "@mui/material/FormControlLabel";

import useSwitch from "@react-hook/switch";

import { useEffect, useState } from "react";
import { Checkbox } from "@material-ui/core";
import { UpdateLinkDTO } from "../common/requests/link.update.request";

const EditBotLink = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm();

  const { deactivatePanel, currentLink, panels, updateBotLink } =
    useFlowContext();

  const [buttonInMessage, setButtonInMessage] = useState(
    currentLink?.type === "IN_MESSAGE"
  );

  const activePanel = panels.find((p) => p.active);

  const handleLinkTypeChange = (event, status) => {
    setButtonInMessage(status);
  };

  const onSubmit = (data) => {
    if (!activePanel || !currentLink) {
      return;
    }

    const updatedLink: UpdateLinkDTO = {
      source: currentLink.source,
      target: currentLink.target,
      label: data.label,
      trigger: data.label,
      type: buttonInMessage ? "IN_MESSAGE" : "STANDALONE",
    };

    updateBotLink(currentLink.edgeId, updatedLink);
    deactivatePanel(activePanel?.type);
  };

  const headerTitle = "Редактирование связи";

  useEffect(() => {
    if (!currentLink) {
      return;
    }

    setValue("label", currentLink.label);
  }, [currentLink]);

  return (
    <FormWrapper>
      <SubHeader>{headerTitle}</SubHeader>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <InputLabel>Название кнопки</InputLabel>
        <input
          placeholder="Название кнопки"
          {...register("label", { required: true })}
        />
        {errors.display_name && (
          <ValidationSubtitle>
            Необходимо заполнить поле выше
          </ValidationSubtitle>
        )}

        <FormControlLabel
          control={<Checkbox />}
          label="Кнопка в сообщении"
          checked={buttonInMessage}
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

export default EditBotLink;
