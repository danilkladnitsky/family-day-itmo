export type UpdateLinkDTO = {
  source: string;
  target: string;
  label: string;
  trigger: string;
  type: "STANDALONE" | "IN_MESSAGE";
};
