import React, { useCallback } from "react";

import { NodeTypes } from "../common/enum/node.types.enum";
import styled from "styled-components";

interface Props {
  nodeContent: React.ReactElement;
  nodeType?: NodeTypes;
  points: React.ReactElement[];
}

const DefaultNode = ({ nodeContent, nodeType, points }: Props) => {
  const renderTypeNode = useCallback(() => {
    switch (nodeType) {
      case NodeTypes.COMMAND:
        return <NodeCommand>{nodeContent}</NodeCommand>;
      case NodeTypes.BUTTON:
        return <NodeButton>{nodeContent}</NodeButton>;
      case NodeTypes.MESSAGE:
        return (
          <NodeMessage>
            <NodeMessageContent>{nodeContent}</NodeMessageContent>
          </NodeMessage>
        );
      default:
        return <NodeElement>{nodeContent}</NodeElement>;
    }
  }, [nodeType, nodeContent]);

  return (
    <NodeWrapper>
      {points}
      {renderTypeNode()}
    </NodeWrapper>
  );
};

const NodeWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;

  font-size: 12px;

  max-width: 300px;
  padding: 3px;
`;

const NodeElement = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 5px 25px;
  height: 40px;

  background-color: lightblue;
`;

const NodeMessage = styled.div`
  display: flex;
  justify-content: center;

  padding: 10px 15px;

  border-radius: 10px;
  font-family: "Regular";

  background-color: #ffffff;
  color: #000;

  border: 1px solid #4a7fff;

  -webkit-box-shadow: 5px 7px 8px -5px rgba(0, 0, 0, 0.33);
  box-shadow: 5px 7px 8px -5px rgba(0, 0, 0, 0.33);
  overflow: hidden;
`;

const NodeMessageContent = styled.div`
  scrollbar-gutter: stable;
  max-height: 80px;
  box-sizing: border-box;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: rgba(74, 127, 255, 0.2);
    border-radius: 15px;
  }

  &:hover::-webkit-scrollbar-thumb {
    background-color: rgba(74, 127, 255, 1);
  }
`;

const NodeCommand = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 5px 20px;
  height: 20px;

  background-color: #4a7fff;
  border-radius: 5px;
`;

const NodeButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 10px 20px;
  height: 10px;

  background-color: lightgreen;
  border-radius: 15px;
`;

export default DefaultNode;
