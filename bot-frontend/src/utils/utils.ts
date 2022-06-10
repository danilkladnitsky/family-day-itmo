import { MarkerType } from "react-flow-renderer";
import { NodeDTO } from "../components/common/dto/node.dto";
import { NodeTypes } from "../components/common/enum/node.types.enum";
import dagre from "dagre";

let nodeLayout: NodeDTO[] | null;

export const getLayoutedElements = (nodes, edges) => {
  const nodeWidth = 300;
  const nodeHeight = 180;

  const dagreGraph = new dagre.graphlib.Graph();

  const updatedNodes = [];

  nodes.forEach((node: NodeDTO[]) => {
    updatedNodes.push({
      type: Boolean(node.type) ? node.type : NodeTypes.MESSAGE,
      id: node.id.toString(),
      data: {
        label: node.text,
      },
      position: { x: 0, y: 0 },
    });
  });

  const layoutedNodes = updatedNodes;
  const layoutedEdges = edges.map((edge: NodeDTO) => ({
    ...edge,
    id: `e${edge.source}-${edge.target}`,
    source: edge.source.toString(),
    target: edge.target.toString(),
    label: edge.label,
    edgeId: edge.id,
    animated: true,
    labelStyle:
      edge.type === "IN_MESSAGE" ? { fill: "#fff" } : { fill: "#000" },
    labelBgStyle:
      edge.type === "IN_MESSAGE"
        ? { fill: "#4a7fff", color: "#fff", fillOpacity: 0.8 }
        : {},
    labelBgPadding: [8, 4],
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
    labelBgBorderRadius: 4,
  }));

  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const isHorizontal = true;

  dagreGraph.setGraph({ rankdir: "TB" });

  layoutedNodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  layoutedEdges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  layoutedNodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);

    node.targetPosition = isHorizontal ? "left" : "top";
    node.sourcePosition = isHorizontal ? "right" : "bottom";

    const persistedPosition = getNodeSavedPosition(node.id);

    if (persistedPosition) {
      node.position = {
        x: persistedPosition.x,
        y: persistedPosition.y,
      };
    } else {
      node.position = {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      };
    }

    return node;
  });

  saveNodesLayout(nodes);

  return [layoutedNodes, layoutedEdges];
};

export const saveNodePosition = (event, { position, id }: NodeDTO) => {
  const pos = JSON.stringify(position);
  localStorage.setItem(id, pos);
};

export const saveNodesLayout = (nodes: NodeDTO[]) => {
  if (nodes.length) localStorage.setItem("layout", JSON.stringify(nodes));
};

export const getNodesLayout = (): NodeDTO[] | null => {
  const data = localStorage.getItem("layout");
  return nodeLayout?.length ? nodeLayout : JSON.parse(data ?? "");
};

export const getNodeSavedPosition = (
  nodeId: string
): { x: number; y: number } | boolean => {
  const pos = localStorage.getItem(nodeId);
  return pos ? JSON.parse(pos) : false;
};
