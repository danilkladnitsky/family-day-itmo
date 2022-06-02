import { NodeTypes } from "../enum/node.types.enum";
import React from "react";

export type NodeDTO = {
  id: string;
  type: string | NodeTypes;
  data: NodeDataDTO;
  position: { x: number; y: number };
};

export type NodeDataDTO = {
  label: React.ReactElement;
};
