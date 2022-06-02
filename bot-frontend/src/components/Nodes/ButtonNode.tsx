import DefaultNode from "./DefaultNode";
import EndPoint from "../Connectors/EndPoint";
import { NodeDTO } from "../common/dto/node.dto";
import { NodeTypes } from "../common/enum/node.types.enum";
import StartPoint from "../Connectors/StartPoint";

const ButtonNode = ({ data }: NodeDTO) => {
  return (
    <DefaultNode
      nodeType={NodeTypes.BUTTON}
      startPoint={<StartPoint />}
      nodeContent={<>{data.label}</>}
      endPoints={<EndPoint />}
    />
  );
};

export default ButtonNode;
