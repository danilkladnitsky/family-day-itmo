import { Handle } from "react-flow-renderer";

const StartPoint = () => {
  return (
    <Handle
      type="target"
      position="top"
      style={{ background: "#555" }}
      onConnect={(params) => console.log("handle onConnect", params)}
      isConnectable={true}
      key="start_point"
    />
  );
};

export default StartPoint;
