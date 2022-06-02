import DefaultNode from "./DefaultNode";
import EndPoint from "../Connectors/EndPoint";
import { NodeTypes } from "../common/enum/node.types.enum";

const CommandNode = ({ data }: NodeDTO) => {
  return (
    <DefaultNode
      nodeType={NodeTypes.COMMAND}
      nodeContent={<b>{data.label}</b>}
      points={[<EndPoint />]}
    />
  );
};

export default CommandNode;
