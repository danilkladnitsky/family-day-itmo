import {
  CONNECT_NODES,
  CREATE_BOT_MESSAGE,
  DELETE_EDGE,
  DELETE_NODE,
  GET_EDGES,
  GET_NODES,
  REPLY_ON_MESSAGES,
  UPDATE_BOT_MESSAGE,
  UPDATE_LINK,
  USER_MESSAGES,
} from "../components/common/requests/api.requests";
import {
  ConnectionLineType,
  addEdge,
  useEdgesState,
  useNodesState,
} from "react-flow-renderer";
import React, {
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getLayoutedElements, saveNodesLayout } from "../utils/utils";

import { API_METHODS } from "../components/common/enum/api.methods.enum";
import Api from "../api/api";
import ButtonNode from "../components/Nodes/ButtonNode";
import { ConnectParamsDTO } from "../components/common/dto/connect.params.dto";
import { EdgeDTO } from "../components/common/dto/edge.dto";
import MessageNode from "../components/Nodes/MessageNode";
import { NodeDTO } from "../components/common/dto/node.dto";
import { NodeTypes } from "../components/common/enum/node.types.enum";
import { PanelDTO } from "../components/common/dto/panel.dto";
import { PopupTypes } from "../components/common/enum/popup.types.enum";
import StartNode from "../components/Nodes/CommandNode";
import { UpdateLinkDTO } from "../components/common/requests/link.update.request";
import { initialEdges } from "../data/initial.edges";
import { initialNodes } from "../data/initial.nodes";
import { useSnackbar } from "notistack";

type UserMessage = {
  firstName: string;
  secondName: string;
  message: string;
  replyMessage?: string;
  id: number;
};

interface IFlowContext {
  getEdges: () => void;
  getNodes: () => void;
  onNodesChange: () => void;
  onEdgesChange: () => void;
  setEdges: (edges: EdgeDTO[]) => void;
  setNodes: (nodes: NodeDTO[]) => void;
  removeEdge: (edges) => void;
  onInit: (flow) => void;
  createBotMessage: (message: string) => void;
  connectNodes: (params: ConnectParamsDTO) => void;
  onConnect: (params) => void;
  activatePanel: (type: PopupTypes) => void;
  deactivatePanel: (type: PopupTypes) => void;
  updateBotMessage: (
    messageId: number | string,
    message: string,
    type: NodeTypes
  ) => void;
  setCurrentMessage: (node: NodeDTO) => void;
  setCurrentLink: (edge: EdgeDTO | null) => void;
  updateBotLink: (id: number, edge: UpdateLinkDTO) => void;
  deleteNode: (id: number | string) => void;
  sendMessageFromUser: (userId: string, message: string) => void;
  getMessagesFromUser: () => void;
  replyOnUserMessage: (id: number, replyMessage: string) => void;
  setCurrentUserMessage: (message: UserMessage) => void;

  nodes: NodeDTO[];
  edges: unknown;
  panels: PanelDTO[];
  currentMessage: NodeDTO | null;
  currentLink: EdgeDTO | null;
  messages: [any];
  currentUserMessage: UserMessage;
}

export const nodeTypes = {
  [NodeTypes.COMMAND]: StartNode,
  [NodeTypes.MESSAGE]: MessageNode,
  buttonNode: ButtonNode,
};

const FlowContext = React.createContext<IFlowContext | any>(null);

export const useFlowContext = (): IFlowContext =>
  useContext<IFlowContext>(FlowContext);

// constants

const popups: PanelDTO[] = [
  {
    type: PopupTypes.CREATE_BOT_MESSAGE,
  },
  {
    type: PopupTypes.UPDATE_BOT_MESSAGE,
  },
  {
    type: PopupTypes.UPDATE_LINK,
  },
  {
    type: PopupTypes.REPLY_ON_MESSAGE,
  },
];

export function FlowContextProvider(
  props: PropsWithChildren<void>
): React.ReactElement {
  const { children } = props;

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const [currentMessage, setCurrentMessage] = useState<NodeDTO | null>(null);
  const [currentLink, setCurrentLink] = useState<EdgeDTO | null>(null);

  const [panels, setPanels] = useState(popups);

  // panels
  const activatePanel = (panelType: PopupTypes) => {
    setPanels((prev) => {
      return prev.map((p) =>
        p.type === panelType ? { ...p, active: true } : { ...p, active: false }
      );
    });
  };

  const deactivatePanel = (panelType: PopupTypes) => {
    setPanels((prev) => {
      return prev.map((p) =>
        p.type === panelType ? { ...p, active: false } : p
      );
    });
  };

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const onInit = async (reactFlowInstance) => {
    await getGraphData();
    scheduleSavingLayout();
  };

  const onConnect = async (params) => {
    setEdges((eds) =>
      addEdge(
        { ...params, type: ConnectionLineType.SmoothStep, animated: true },
        eds
      )
    );

    await getGraphData();
  };

  const getGraphData = async () => {
    // nodes
    const { result: nodesRes } = await Api.fetch(GET_NODES, API_METHODS.GET);

    if (!nodesRes) {
      enqueueSnackbar("Не удалось загрузить компоненты", { variant: "error" });
      return;
    }

    // edges
    const { result: edgesRes } = await Api.fetch(GET_EDGES, API_METHODS.GET);

    if (!edgesRes) {
      enqueueSnackbar("Не удалось загрузить связи компонентов", {
        variant: "error",
      });
      return;
    }

    const layoutedRes = getLayoutedElements(nodesRes, edgesRes);

    setNodes(layoutedRes[0]);
    setEdges(layoutedRes[1]);
  };

  // connectors

  const connectNodes = useCallback(async (params: ConnectParamsDTO) => {
    const source = nodes.find((n) => n.id === params.source);
    const target = nodes.find((n) => n.id === params.target);

    const label = `${params.source}=${params.target}`;

    const body = JSON.stringify({
      ...params,
      label,
      trigger: label,
    });

    const { result } = await Api.fetch(CONNECT_NODES, API_METHODS.POST, {
      body,
    });

    if (!result) {
      enqueueSnackbar("Не удалось установить связь между компонентами", {
        variant: "error",
      });
      return;
    }

    enqueueSnackbar("Компоненты были успешно соединены", {
      variant: "success",
    });
  }, []);

  const removeEdge = async (edges: EdgeDTO[]) => {
    let deleteEdges = 0;
    edges.forEach(async (edge) => {
      if (!edge.edgeId) {
        return;
      }

      const { result } = await Api.fetch(
        DELETE_EDGE(edge.edgeId),
        API_METHODS.DELETE
      );

      if (result) {
        deleteEdges++;
      }
    });

    enqueueSnackbar(`Успешно было удалено ${deleteEdges} связей`, {
      variant: "success",
    });

    await getGraphData();
  };

  const createBotMessage = async (message: string) => {
    const body = JSON.stringify({ text: message });
    const { result } = await Api.fetch(CREATE_BOT_MESSAGE, API_METHODS.POST, {
      body,
    });

    if (!result) {
      enqueueSnackbar(`Сообщение не было создано`, { variant: "error" });
      return;
    }
    enqueueSnackbar(`Сообщение было добавлено`, { variant: "success" });

    await getGraphData();
  };

  const updateBotMessage = async (
    messageId: number | string,
    message: string,
    type: NodeTypes
  ) => {
    const body = JSON.stringify({ text: message, type });
    const { result } = await Api.fetch(
      UPDATE_BOT_MESSAGE(messageId),
      API_METHODS.PATCH,
      {
        body,
      }
    );

    if (!result) {
      enqueueSnackbar(`Сообщение не было обновлено`, { variant: "error" });
      return;
    }
    enqueueSnackbar(`Сообщение было успешно обновлено`, { variant: "success" });

    await getGraphData();
  };

  const updateBotLink = async (
    linkId: number | string,
    link: UpdateLinkDTO
  ) => {
    const body = JSON.stringify({ ...link });
    const { result } = await Api.fetch(UPDATE_LINK(linkId), API_METHODS.PATCH, {
      body,
    });

    if (!result) {
      enqueueSnackbar(`Связь не была обновлена`, { variant: "error" });
      return;
    }
    enqueueSnackbar(`Связь была успешна обновлена`, { variant: "success" });

    await getGraphData();
  };

  const deleteNode = async (nodes: NodeDTO[]) => {
    let deleteNodes = 0;
    nodes.forEach(async (node) => {
      if (!node.id) {
        return;
      }

      const { result } = await Api.fetch(
        DELETE_NODE(node.id),
        API_METHODS.DELETE
      );

      if (result) {
        deleteNodes++;
      }
    });

    enqueueSnackbar(`Успешно было удалено ${deleteNodes} сообщений`, {
      variant: "success",
    });

    await getGraphData();
  };

  const scheduleSavingLayout = (time = 3000) => {
    setInterval(() => {
      saveNodesLayout(nodes);
    }, time);
  };

  // feedback
  const sendMessageFromUser = async (userId: string, message: string) => {
    const body = JSON.stringify({ userId, message });
    const { result, error } = await Api.fetch(USER_MESSAGES, API_METHODS.POST, {
      body,
    });

    return error.toString();
  };

  const [messages, setMessages] = useState([]);
  const [currentUserMessage, setCurrentUserMessage] =
    useState<UserMessage | null>(null);

  const getMessagesFromUser = async () => {
    const { result, error } = await Api.fetch(USER_MESSAGES, API_METHODS.GET);
    setMessages(result);
  };

  const replyOnUserMessage = async (id: number, replyMessage: string) => {
    const body = JSON.stringify({ replyMessage });

    const { result, error } = await Api.fetch(
      REPLY_ON_MESSAGES(id),
      API_METHODS.PATCH,
      { body }
    );

    if (result) {
      enqueueSnackbar("Сообщение было успешно отправлено!", {
        variant: "success",
      });
    } else {
      enqueueSnackbar("Произошла ошибка при отправки сообщения: " + error, {
        variant: "error",
      });
    }
  };

  return (
    <FlowContext.Provider
      value={{
        setEdges,
        setNodes,
        connectNodes,
        onNodesChange,
        onEdgesChange,
        removeEdge,
        createBotMessage,
        onConnect,
        onInit,
        activatePanel,
        updateBotMessage,
        deactivatePanel,
        setCurrentMessage,
        setCurrentLink,
        updateBotLink,
        deleteNode,
        sendMessageFromUser,
        replyOnUserMessage,
        nodes,
        edges,
        panels,
        currentMessage,
        currentLink,
        getMessagesFromUser,
        messages,
        currentUserMessage,
        setCurrentUserMessage,
      }}
    >
      {children}
    </FlowContext.Provider>
  );
}
