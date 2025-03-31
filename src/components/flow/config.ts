import React from 'react';
import { ReactFlowProps } from 'reactflow';
import { DefaultEdge, ConditionalEdge, SequentialEdge, ParallelEdge, FeedbackEdge } from './edges';
import { ScreeningNode } from './nodes/ScreeningNode';
import { AssessmentNode } from './nodes/AssessmentNode';
import { InterventionNode } from './nodes/InterventionNode';
import { DecisionNode } from './nodes/DecisionNode';

export const flowConfig: Partial<ReactFlowProps> = {
  defaultViewport: { x: 0, y: 0, zoom: 1 },
  minZoom: 0.5,
  maxZoom: 2,
  nodesDraggable: true,
  nodesConnectable: true,
  elementsSelectable: true,
  snapToGrid: true,
  snapGrid: [16, 16],
  defaultMarkerColor: '#6B7280',
  defaultEdgeOptions: {
    type: 'default',
    animated: false,
  },
  defaultNodeOptions: {
    type: 'default',
    draggable: true,
    connectable: true,
    selectable: true,
  },
  edgeTypes: {
    default: DefaultEdge,
    conditional: ConditionalEdge,
    sequential: SequentialEdge,
    parallel: ParallelEdge,
    feedback: FeedbackEdge,
  },
  nodeTypes: {
    screening: ScreeningNode,
    assessment: AssessmentNode,
    intervention: InterventionNode,
    decision: DecisionNode,
  },
  fitViewOptions: {
    padding: 0.2,
    includeHiddenNodes: false,
  },
  proOptions: {
    hideAttribution: true,
  },
};
