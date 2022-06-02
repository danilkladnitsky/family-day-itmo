import { PopupTypes } from "../enum/popup.types.enum";

export interface PanelDTO {
  type: PopupTypes;
  active?: boolean;
}
