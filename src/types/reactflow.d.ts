declare module 'reactflow' {
  import { ReactNode } from 'react';

  export interface Node {
    id: string;
    type?: string;
    position: { x: number; y: number };
    data: any;
    sourcePosition?: Position;
    targetPosition?: Position;
    draggable?: boolean;
    selectable?: boolean;
    connectable?: boolean;
    deletable?: boolean;
    style?: React.CSSProperties;
    className?: string;
    zIndex?: number;
    hidden?: boolean;
  }

  export interface Edge {
    id: string;
    source: string;
    target: string;
    type?: string;
    animated?: boolean;
    style?: React.CSSProperties;
    className?: string;
    label?: string;
    labelStyle?: React.CSSProperties;
    labelBgStyle?: React.CSSProperties;
    labelBgPadding?: [number, number];
    labelBgBorderRadius?: number;
    hidden?: boolean;
  }

  export interface Viewport {
    x: number;
    y: number;
    zoom: number;
  }

  export interface ReactFlowProps {
    nodes: Node[];
    edges: Edge[];
    onNodesChange?: (changes: NodeChange[]) => void;
    onEdgesChange?: (changes: EdgeChange[]) => void;
    onConnect?: (connection: Connection) => void;
    onConnectStart?: (event: React.MouseEvent, params: OnConnectStartParams) => void;
    onConnectEnd?: (event: MouseEvent) => void;
    onNodeClick?: (event: React.MouseEvent, node: Node) => void;
    onNodeDoubleClick?: (event: React.MouseEvent, node: Node) => void;
    onNodeMouseEnter?: (event: React.MouseEvent, node: Node) => void;
    onNodeMouseMove?: (event: React.MouseEvent, node: Node) => void;
    onNodeMouseLeave?: (event: React.MouseEvent, node: Node) => void;
    onNodeContextMenu?: (event: React.MouseEvent, node: Node) => void;
    onNodeDragStart?: (event: React.MouseEvent, node: Node) => void;
    onNodeDrag?: (event: React.MouseEvent, node: Node) => void;
    onNodeDragStop?: (event: React.MouseEvent, node: Node) => void;
    onPaneClick?: (event: React.MouseEvent) => void;
    onPaneContextMenu?: (event: React.MouseEvent) => void;
    onPaneScroll?: (event: WheelEvent) => void;
    onPaneMouseMove?: (event: React.MouseEvent) => void;
    onPaneMouseLeave?: (event: React.MouseEvent) => void;
    onPaneMouseEnter?: (event: React.MouseEvent) => void;
    onPaneContextMenu?: (event: React.MouseEvent) => void;
    onSelectionChange?: (elements: Node[]) => void;
    onViewportChange?: (viewport: Viewport) => void;
    onInit?: (instance: ReactFlowInstance) => void;
    onMove?: (event: MouseEvent, viewport: Viewport) => void;
    onMoveStart?: (event: MouseEvent, viewport: Viewport) => void;
    onMoveEnd?: (event: MouseEvent, viewport: Viewport) => void;
    onZoom?: (event: WheelEvent, viewport: Viewport) => void;
    onZoomStart?: (event: WheelEvent, viewport: Viewport) => void;
    onZoomEnd?: (event: WheelEvent, viewport: Viewport) => void;
    defaultViewport?: Viewport;
    minZoom?: number;
    maxZoom?: number;
    defaultZoom?: number;
    fitView?: boolean;
    fitViewOptions?: FitViewOptions;
    nodesDraggable?: boolean;
    nodesConnectable?: boolean;
    elementsSelectable?: boolean;
    selectNodesOnDrag?: boolean;
    snapToGrid?: boolean;
    snapGrid?: [number, number];
    nodesFocusable?: boolean;
    nodesConnectable?: boolean;
    elementsSelectable?: boolean;
    zoomOnScroll?: boolean;
    zoomOnPinch?: boolean;
    zoomOnDoubleClick?: boolean;
    panOnScroll?: boolean;
    panOnScrollMode?: 'free' | 'vertical' | 'horizontal';
    panOnDrag?: boolean;
    preventScrolling?: boolean;
    attributionPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    noDragClassName?: string;
    noWheelClassName?: string;
    noTouchClassName?: string;
    defaultMarkerColor?: string;
    defaultEdgeOptions?: EdgeOptions;
    defaultNodeOptions?: NodeOptions;
    nodeTypes?: Record<string, React.ComponentType<any>>;
    edgeTypes?: Record<string, React.ComponentType<any>>;
    connectionMode?: 'loose' | 'strict';
    connectionRadius?: number;
    deleteKeyCode?: string | string[];
    multiSelectionKeyCode?: string | string[];
    selectionKeyCode?: string | string[];
    panActivationKeyCode?: string | string[];
    zoomActivationKeyCode?: string | string[];
    proOptions?: ProOptions;
  }

  export interface ReactFlowInstance {
    getNodes: () => Node[];
    getEdges: () => Edge[];
    getElements: () => (Node | Edge)[];
    getNode: (id: string) => Node | undefined;
    getEdge: (id: string) => Edge | undefined;
    setNodes: (nodes: Node[]) => void;
    setEdges: (edges: Edge[]) => void;
    addNodes: (nodes: Node[]) => void;
    addEdges: (edges: Edge[]) => void;
    removeNodes: (nodeIds: string[]) => void;
    removeEdges: (edgeIds: string[]) => void;
    getElementsIncludingDeleted: () => (Node | Edge)[];
    getViewport: () => Viewport;
    setViewport: (viewport: Viewport) => void;
    zoomTo: (zoomLevel: number) => void;
    setMinZoom: (minZoom: number) => void;
    setMaxZoom: (maxZoom: number) => void;
    fitView: (options?: FitViewOptions) => void;
    project: (point: XYPosition) => XYPosition;
    screenToFlowPosition: (screenPosition: XYPosition) => XYPosition;
    flowToScreenPosition: (flowPosition: XYPosition) => XYPosition;
    getIntersectingNodes: (node: Node, partially?: boolean) => Node[];
    isNodeIntersecting: (node: Node, area: Rect) => boolean;
    getConnectedEdges: (nodeId: string) => Edge[];
    getIncomers: (nodeId: string) => Node[];
    getOutgoers: (nodeId: string) => Node[];
  }

  export interface XYPosition {
    x: number;
    y: number;
  }

  export interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
  }

  export interface NodeChange {
    id: string;
    type: 'position' | 'dimensions' | 'remove' | 'select' | 'unselect';
    position?: XYPosition;
    dimensions?: { width: number; height: number };
    selected?: boolean;
  }

  export interface EdgeChange {
    id: string;
    type: 'remove' | 'select' | 'unselect';
    selected?: boolean;
  }

  export interface Connection {
    source: string;
    target: string;
    sourceHandle?: string;
    targetHandle?: string;
  }

  export interface OnConnectStartParams {
    nodeId: string;
    handleType: 'source' | 'target';
    handleId: string;
  }

  export interface FitViewOptions {
    padding?: number;
    includeHiddenNodes?: boolean;
  }

  export interface EdgeOptions {
    animated?: boolean;
    style?: React.CSSProperties;
    className?: string;
    label?: string;
    labelStyle?: React.CSSProperties;
    labelBgStyle?: React.CSSProperties;
    labelBgPadding?: [number, number];
    labelBgBorderRadius?: number;
  }

  export interface NodeOptions {
    draggable?: boolean;
    selectable?: boolean;
    connectable?: boolean;
    deletable?: boolean;
    style?: React.CSSProperties;
    className?: string;
    zIndex?: number;
  }

  export interface ProOptions {
    hideAttribution: boolean;
  }

  export enum Position {
    Top = 'top',
    Right = 'right',
    Bottom = 'bottom',
    Left = 'left',
  }

  export interface HandleProps {
    type: 'source' | 'target';
    position: Position;
    id?: string;
    style?: React.CSSProperties;
    className?: string;
    isConnectable?: boolean;
  }

  export interface BackgroundProps {
    color?: string;
    gap?: number;
    size?: number;
    style?: React.CSSProperties;
    className?: string;
  }

  export interface ControlsProps {
    showZoom?: boolean;
    showFitView?: boolean;
    showInteractive?: boolean;
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    style?: React.CSSProperties;
    className?: string;
  }

  export interface MiniMapProps {
    nodeColor?: string;
    maskColor?: string;
    style?: React.CSSProperties;
    className?: string;
  }

  export interface PanelProps {
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    style?: React.CSSProperties;
    className?: string;
    children: ReactNode;
  }

  export interface EdgeProps {
    id: string;
    sourceX: number;
    sourceY: number;
    targetX: number;
    targetY: number;
    sourcePosition: Position;
    targetPosition: Position;
    data?: any;
    style?: React.CSSProperties;
  }

  export const Handle: React.FC<HandleProps>;
  export const Position: typeof Position;
  export const ReactFlow: React.FC<ReactFlowProps>;
  export const Background: React.FC<BackgroundProps>;
  export const Controls: React.FC<ControlsProps>;
  export const MiniMap: React.FC<MiniMapProps>;
  export const Panel: React.FC<PanelProps>;
  export const BaseEdge: React.FC<EdgeProps>;
  export const getBezierPath: (params: {
    sourceX: number;
    sourceY: number;
    sourcePosition: Position;
    targetX: number;
    targetY: number;
    targetPosition: Position;
  }) => [string, number, number];
  export const useNodesState: <T extends Node>(
    initialNodes: T[]
  ) => [T[], (changes: NodeChange[]) => void];
  export const useEdgesState: <T extends Edge>(
    initialEdges: T[]
  ) => [T[], (changes: EdgeChange[]) => void];
  export const useReactFlow: () => ReactFlowInstance;
  export const useStore: <T>(selector: (state: any) => T) => T;
  export const useNodes: () => Node[];
  export const useEdges: () => Edge[];
  export const useViewport: () => Viewport;
  export const useOnViewportChange: (callback: (viewport: Viewport) => void) => void;
  export const useOnNodesChange: (callback: (changes: NodeChange[]) => void) => void;
  export const useOnEdgesChange: (callback: (changes: EdgeChange[]) => void) => void;
  export const useOnConnect: (callback: (connection: Connection) => void) => void;
  export const useOnConnectStart: (
    callback: (event: React.MouseEvent, params: OnConnectStartParams) => void
  ) => void;
  export const useOnConnectEnd: (callback: (event: MouseEvent) => void) => void;
  export const useOnNodeClick: (callback: (event: React.MouseEvent, node: Node) => void) => void;
  export const useOnNodeDoubleClick: (
    callback: (event: React.MouseEvent, node: Node) => void
  ) => void;
  export const useOnNodeMouseEnter: (
    callback: (event: React.MouseEvent, node: Node) => void
  ) => void;
  export const useOnNodeMouseMove: (
    callback: (event: React.MouseEvent, node: Node) => void
  ) => void;
  export const useOnNodeMouseLeave: (
    callback: (event: React.MouseEvent, node: Node) => void
  ) => void;
  export const useOnNodeContextMenu: (
    callback: (event: React.MouseEvent, node: Node) => void
  ) => void;
  export const useOnNodeDragStart: (
    callback: (event: React.MouseEvent, node: Node) => void
  ) => void;
  export const useOnNodeDrag: (callback: (event: React.MouseEvent, node: Node) => void) => void;
  export const useOnNodeDragStop: (callback: (event: React.MouseEvent, node: Node) => void) => void;
  export const useOnPaneClick: (callback: (event: React.MouseEvent) => void) => void;
  export const useOnPaneContextMenu: (callback: (event: React.MouseEvent) => void) => void;
  export const useOnPaneScroll: (callback: (event: WheelEvent) => void) => void;
  export const useOnPaneMouseMove: (callback: (event: React.MouseEvent) => void) => void;
  export const useOnPaneMouseLeave: (callback: (event: React.MouseEvent) => void) => void;
  export const useOnPaneMouseEnter: (callback: (event: React.MouseEvent) => void) => void;
  export const useOnSelectionChange: (callback: (elements: Node[]) => void) => void;
  export const useOnMove: (callback: (event: MouseEvent, viewport: Viewport) => void) => void;
  export const useOnMoveStart: (callback: (event: MouseEvent, viewport: Viewport) => void) => void;
  export const useOnMoveEnd: (callback: (event: MouseEvent, viewport: Viewport) => void) => void;
  export const useOnZoom: (callback: (event: WheelEvent, viewport: Viewport) => void) => void;
  export const useOnZoomStart: (callback: (event: WheelEvent, viewport: Viewport) => void) => void;
  export const useOnZoomEnd: (callback: (event: WheelEvent, viewport: Viewport) => void) => void;
  export const useOnInit: (callback: (instance: ReactFlowInstance) => void) => void;
}
