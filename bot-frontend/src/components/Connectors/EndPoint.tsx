import { Handle } from "react-flow-renderer";
import React from "react";
import styled from "styled-components";
import { useFlowContext } from "../../context/FlowProvider";

const EndPoint = () => {
  const { connectNodes } = useFlowContext();
  return (
    <Handle
      type="source"
      position="bottom"
      style={{ background: "blue" }}
      onConnect={connectNodes}
      isConnectable={true}
      key="end_point"
    />
  );
};

export default EndPoint;
