import ReactFlow, { Background, Controls, MiniMap } from "react-flow-renderer";
import { nodeTypes, useFlowContext } from "../../context/FlowProvider";
import { saveNodePosition } from "../../utils/utils";
import { NodeTypes } from "../common/enum/node.types.enum";

import { PopupTypes } from "../common/enum/popup.types.enum";

const OverviewFlow = () => {
  const {
    onNodesChange,
    onEdgesChange,
    removeEdge,
    onInit,
    onConnect,
    nodes,
    edges,
    activatePanel,
    setCurrentMessage,
    setCurrentLink,
    deleteNode,
  } = useFlowContext();

  const onNodeClickHandle = (event, node) => {
    setCurrentMessage(node);
    activatePanel(PopupTypes.UPDATE_BOT_MESSAGE);
  };

  const onEdgeClickHandle = (event, edge) => {
    setCurrentLink(edge);
    activatePanel(PopupTypes.UPDATE_LINK);
  };

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onEdgesDelete={(edges) => removeEdge(edges)}
      onInit={onInit}
      nodeTypes={nodeTypes}
      fitView
      onNodeClick={onNodeClickHandle}
      onEdgeClick={onEdgeClickHandle}
      attributionPosition="top-right"
      onNodesDelete={(nodes) => deleteNode(nodes)}
      onNodeDragStop={saveNodePosition}
    >
      <MiniMap
        nodeStrokeColor={(n) => {
          if (n.style?.background) return n.style.background;
          if (n.type === NodeTypes.MESSAGE) return "#0041d0";
          if (n.type === "output") return "#ff0072";
          if (n.type === "default") return "#1a192b";

          return "#eee";
        }}
        nodeColor={(n) => {
          if (n.style?.background) return n.style.background;
          if (n.type === NodeTypes.MESSAGE) return "#fff";

          return "#fff";
        }}
        nodeBorderRadius={2}
      />
      <Controls />
      <Background color="#aaa" gap={16} />
    </ReactFlow>
  );
};

export default OverviewFlow;
