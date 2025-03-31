import { BaseEntity } from './base';
import { Node, Edge } from 'reactflow';

// Tipos de Nós
export type NodeType =
  | 'screening'
  | 'assessment'
  | 'intervention'
  | 'decision'
  | 'group'
  | 'activity'
  | 'condition';

// Tipos de Conectores
export type EdgeType = 'default' | 'conditional' | 'sequential' | 'parallel' | 'feedback';

// Interface base para nós
export interface FlowNode extends Node {
  data: NodeData;
}

// Interface base para conectores
export interface FlowEdge extends Edge {
  data: EdgeData;
}

// Interface para fluxo completo
export interface Flow extends BaseEntity {
  id: string;
  name: string;
  description?: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
  createdAt: Date;
  updatedAt: Date;
}

// Tipos específicos para RTI/MTSS
export interface ScreeningNodeData extends NodeData {
  type: 'screening';
  instrument: string;
  frequency: string;
  threshold: number;
  domains: string[];
}

export interface AssessmentNodeData extends NodeData {
  type: 'assessment';
  instrument: string;
  frequency: string;
  domains: string[];
}

export interface InterventionNodeData extends NodeData {
  type: 'intervention';
  name: string;
  description: string;
  duration: number;
  frequency: string;
  resources: string[];
  evidence: string[];
}

export interface DecisionNodeData extends NodeData {
  type: 'decision';
  criteria: string[];
  outcomes: string[];
  threshold: number;
}

export interface ScreeningNode extends FlowNode {
  data: ScreeningNodeData;
}

export interface AssessmentNode extends FlowNode {
  data: AssessmentNodeData;
}

export interface InterventionNode extends FlowNode {
  data: InterventionNodeData;
}

export interface DecisionNode extends FlowNode {
  data: DecisionNodeData;
}

// Props para componentes
export interface FlowEditorProps {
  flow: Flow;
  readOnly?: boolean;
  onNodesChange?: (nodes: FlowNode[]) => void;
  onEdgesChange?: (edges: FlowEdge[]) => void;
}

export interface CustomNodeProps extends Node {
  isConnectable: boolean;
  selected: boolean;
}

export interface CustomEdgeProps {
  data?: EdgeData;
  style?: React.CSSProperties;
}

// Hooks
export interface UseFlowReturn {
  flow: Flow | null;
  isLoading: boolean;
  error: Error | null;
  updateFlow: (flow: Flow) => Promise<void>;
  addNode: (node: FlowNode) => void;
  removeNode: (nodeId: string) => void;
  addEdge: (edge: FlowEdge) => void;
  removeEdge: (edgeId: string) => void;
}

export interface NodeData {
  label: string;
  description?: string;
  type: 'screening' | 'assessment' | 'intervention' | 'decision';
}

export interface EdgeData {
  label?: string;
  type: 'default' | 'conditional' | 'sequential' | 'parallel' | 'feedback';
}
