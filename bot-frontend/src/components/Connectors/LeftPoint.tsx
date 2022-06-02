import { Handle } from "react-flow-renderer";
import { useFlowContext } from "../../context/FlowProvider";

const LeftPoint = () => {
  const { connectNodes } = useFlowContext();
  return (
    <Handle
      type="source"
      position="left"
      style={{ background: "blue" }}
      onConnect={connectNodes}
      isConnectable={true}
      key="left_point"
    />
  );
};

export default LeftPoint;
