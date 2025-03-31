import React, { useCallback, useMemo, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  Connection,
  useNodesState,
  useEdgesState,
  NodeChange,
  EdgeChange,
} from 'reactflow';
import { ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';
import { Button, IconButton, Tooltip, CircularProgress } from '@mui/material';
import {
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Undo as UndoIcon,
  Redo as RedoIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { FlowEditorProps, Flow } from '../../../types/flow';
import { useFlow } from '../../../hooks/useFlow';
import { TemplateSelector } from '../TemplateSelector';
import { FlowTemplate } from '../templates';
import {
  Container,
  Toolbar,
  NodePanel,
  NodeItem,
  NodeTitle,
  NodeDescription,
  FlowContainer,
  Controls as FlowControls,
  ControlButton,
  LoadingOverlay,
  ErrorMessage,
} from './styles';
import { flowConfig } from '../config';

import { ScreeningNode } from '../nodes/ScreeningNode';
import { AssessmentNode } from '../nodes/AssessmentNode';
import { InterventionNode } from '../nodes/InterventionNode';
import { DecisionNode } from '../nodes/DecisionNode';
import { GroupNode } from '../nodes/GroupNode';
import { ActivityNode } from '../nodes/ActivityNode';
import { ConditionNode } from '../nodes/ConditionNode';
import { DefaultEdge } from '../edges/DefaultEdge';
import { ConditionalEdge } from '../edges/ConditionalEdge';
import { SequentialEdge } from '../edges/SequentialEdge';
import { ParallelEdge } from '../edges/ParallelEdge';
import { FeedbackEdge } from '../edges/FeedbackEdge';

const nodeTypes = {
  screening: ScreeningNode,
  assessment: AssessmentNode,
  intervention: InterventionNode,
  decision: DecisionNode,
  group: GroupNode,
  activity: ActivityNode,
  condition: ConditionNode,
};

const edgeTypes = {
  default: DefaultEdge,
  conditional: ConditionalEdge,
  sequential: SequentialEdge,
  parallel: ParallelEdge,
  feedback: FeedbackEdge,
};

export const FlowEditor: React.FC<FlowEditorProps> = ({
  flow: initialFlow,
  onSave,
  onUpdate,
  readOnly = false,
}) => {
  const {
    flow,
    isLoading,
    error,
    updateFlow,
    addNode,
    removeNode,
    addEdge: addFlowEdge,
    removeEdge: removeFlowEdge,
  } = useFlow(initialFlow);

  const [nodes, setNodes, onNodesChange] = useNodesState(flow?.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(flow?.edges || []);
  const [history, setHistory] = useState<Array<{ nodes: Node[]; edges: Edge[] }>>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isTemplateSelectorOpen, setIsTemplateSelectorOpen] = useState(false);

  const handleNodesChange = (changes: NodeChange[]) => {
    const updatedNodes = nodes.map(node => {
      const change = changes.find(c => c.id === node.id);
      if (change) {
        return { ...node, ...change };
      }
      return node;
    });

    addToHistory(updatedNodes, edges);
    onUpdate({ ...flow, nodes: updatedNodes });
  };

  const handleEdgesChange = (changes: EdgeChange[]) => {
    const updatedEdges = edges.map(edge => {
      const change = changes.find(c => c.id === edge.id);
      if (change) {
        return { ...edge, ...change };
      }
      return edge;
    });

    addToHistory(nodes, updatedEdges);
    onUpdate({ ...flow, edges: updatedEdges });
  };

  const handleConnect = (connection: Connection) => {
    const newEdge = {
      id: `${connection.source}-${connection.target}`,
      source: connection.source,
      target: connection.target,
      type: 'default',
    };

    const newEdges = [...edges, newEdge];
    addToHistory(nodes, newEdges);
    onUpdate({
      ...flow,
      edges: newEdges,
    });
  };

  const addToHistory = (newNodes: Node[], newEdges: Edge[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ nodes: newNodes, edges: newEdges });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setNodes(prevState.nodes);
      setEdges(prevState.edges);
      setHistoryIndex(historyIndex - 1);
      onUpdate({ ...flow, nodes: prevState.nodes, edges: prevState.edges });
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setNodes(nextState.nodes);
      setEdges(nextState.edges);
      setHistoryIndex(historyIndex + 1);
      onUpdate({ ...flow, nodes: nextState.nodes, edges: nextState.edges });
    }
  };

  const handleTemplateSelect = (template: FlowTemplate) => {
    const newNodes = template.nodes.map(node => ({
      ...node,
      position: {
        x: node.position.x + Math.random() * 100,
        y: node.position.y + Math.random() * 100,
      },
    }));
    const newEdges = template.edges;

    setNodes(newNodes);
    setEdges(newEdges);
    addToHistory(newNodes, newEdges);
    onUpdate({ ...flow, nodes: newNodes, edges: newEdges });
  };

  const onNodeDragStop = useCallback(
    (event: React.MouseEvent, node: Node) => {
      if (!flow) return;

      const updatedFlow = {
        ...flow,
        nodes: flow.nodes.map(n => (n.id === node.id ? { ...n, position: node.position } : n)),
      };

      updateFlow(updatedFlow);
    },
    [flow, updateFlow]
  );

  const handleSave = useCallback(async () => {
    if (!flow) return;
    await onSave(flow);
  }, [flow, onSave]);

  const nodePanelItems = useMemo(
    () => [
      {
        type: 'screening',
        title: 'Rastreio',
        description: 'Adicionar nó de rastreio',
      },
      {
        type: 'assessment',
        title: 'Avaliação',
        description: 'Adicionar nó de avaliação',
      },
      {
        type: 'intervention',
        title: 'Intervenção',
        description: 'Adicionar nó de intervenção',
      },
      {
        type: 'decision',
        title: 'Decisão',
        description: 'Adicionar nó de decisão',
      },
      {
        type: 'group',
        title: 'Grupo',
        description: 'Adicionar nó de grupo',
      },
      {
        type: 'activity',
        title: 'Atividade',
        description: 'Adicionar nó de atividade',
      },
      {
        type: 'condition',
        title: 'Condição',
        description: 'Adicionar nó de condição',
      },
    ],
    []
  );

  if (!flow) {
    return <div>Carregando...</div>;
  }

  return (
    <ReactFlowProvider>
      <Container>
        <Toolbar>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={isLoading || readOnly}
            startIcon={<SaveIcon />}
          >
            Salvar
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setIsTemplateSelectorOpen(true)}
            disabled={readOnly}
            startIcon={<AddIcon />}
          >
            Usar Template
          </Button>
          <Tooltip title="Desfazer">
            <IconButton onClick={handleUndo} disabled={historyIndex <= 0 || readOnly}>
              <UndoIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Refazer">
            <IconButton
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1 || readOnly}
            >
              <RedoIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>

        <NodePanel>
          {nodePanelItems.map(item => (
            <NodeItem
              key={item.type}
              draggable
              onDragStart={event => {
                event.dataTransfer.setData('application/reactflow', item.type);
              }}
            >
              <NodeTitle>{item.title}</NodeTitle>
              <NodeDescription>{item.description}</NodeDescription>
            </NodeItem>
          ))}
        </NodePanel>

        <FlowContainer>
          <ReactFlow
            {...flowConfig}
            nodes={nodes}
            edges={edges}
            onNodesChange={handleNodesChange}
            onEdgesChange={handleEdgesChange}
            onConnect={handleConnect}
            onNodeDragStop={onNodeDragStop}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            nodesDraggable={!readOnly}
            nodesConnectable={!readOnly}
            elementsSelectable={!readOnly}
          >
            <Background />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </FlowContainer>

        <FlowControls>
          <ControlButton onClick={() => handleSave()}>
            <SaveIcon />
          </ControlButton>
          <ControlButton onClick={() => window.location.reload()}>
            <RefreshIcon />
          </ControlButton>
        </FlowControls>

        {isLoading && (
          <LoadingOverlay>
            <CircularProgress />
          </LoadingOverlay>
        )}

        {error && <ErrorMessage>{error.message}</ErrorMessage>}

        <TemplateSelector
          open={isTemplateSelectorOpen}
          onClose={() => setIsTemplateSelectorOpen(false)}
          onSelectTemplate={handleTemplateSelect}
        />
      </Container>
    </ReactFlowProvider>
  );
};
