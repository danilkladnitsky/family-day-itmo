import DefaultNode from "./DefaultNode";
import EndPoint from "../Connectors/EndPoint";
import { NodeDTO } from "../common/dto/node.dto";
import { NodeTypes } from "../common/enum/node.types.enum";
import StartPoint from "../Connectors/StartPoint";
import LeftPoint from "../Connectors/LeftPoint";

const MessageNode = ({ data }: NodeDTO) => {
  return (
    <DefaultNode
      nodeType={NodeTypes.MESSAGE}
      nodeContent={<>{data?.label}</>}
      points={[<StartPoint />, <EndPoint />]}
    />
  );
};

export default MessageNode;
