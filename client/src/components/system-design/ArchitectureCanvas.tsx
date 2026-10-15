import { useCallback, useRef, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  BackgroundVariant,
  useReactFlow,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
  Trash2,
  BookOpen,
  RotateCcw,
  Sparkles,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  CheckCircle2,
  AlertTriangle,
  Settings2,
} from 'lucide-react';
import clsx from 'clsx';
import { useSystemDesignStore } from '../../store/useSystemDesignStore';
import ArchitectureNode from './nodes/ArchitectureNode';

const nodeTypes = {
  archNode: ArchitectureNode,
};

function CanvasInner() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition, fitView, zoomIn, zoomOut } = useReactFlow();

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    deleteSelectedNode,
    deleteSelectedEdge,
    clearCanvas,
    loadReferenceArchitecture,
    selectedNodeId,
    selectedEdgeId,
    setSelectedEdgeId,
    updateNodeConfig,
    validationReport,
    isSaving,
  } = useSystemDesignStore();
  const [isEditing, setIsEditing] = useState(false);
  const selectedNode = nodes.find((node) => node.id === selectedNodeId);
  const selectedEdge = edges.find((edge) => edge.id === selectedEdgeId);
  const selectedNodeData = (selectedNode?.data as any) || {};
  const selectedConfig = selectedNodeData.config || {};

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow-type');
      const label = event.dataTransfer.getData('application/reactflow-label');
      const category = event.dataTransfer.getData('application/reactflow-category');
      const subType = event.dataTransfer.getData('application/reactflow-subtype');

      if (!type || !label) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      addNode(type, label, category, subType, position);
    },
    [screenToFlowPosition, addNode]
  );

  const spofCount = validationReport?.spofCount || 0;
  const healthScore = validationReport?.score || 100;

  return (
    <div className="relative flex-1 h-full bg-[#FAFCFF] dark:bg-[#000000] overflow-hidden transition-colors" ref={reactFlowWrapper}>
      {selectedNode && (
        <div className="absolute top-4 left-4 z-20 flex items-start gap-2">
          <div className="flex items-center gap-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0D1117]/95 p-1.5 shadow-lg backdrop-blur-md">
            <button
              type="button"
              onClick={() => deleteSelectedNode()}
              className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
            >
              <Trash2 size={13} />
              Delete
            </button>
            {Object.keys(selectedConfig).length > 0 && (
              <button
                type="button"
                onClick={() => setIsEditing((open) => !open)}
                className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Settings2 size={13} />
                Edit
              </button>
            )}
          </div>

          {isEditing && Object.keys(selectedConfig).length > 0 && (
            <div className="w-64 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0D1117]/95 p-3 shadow-xl backdrop-blur-md">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Component settings</span>
                <span className="max-w-[130px] truncate text-[10px] text-slate-400">{selectedNodeData.label}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <label className="text-slate-600 dark:text-slate-400">
                  Size
                  <select
                    value={selectedConfig.size || 'medium'}
                    onChange={(event) => updateNodeConfig(selectedNode.id, { size: event.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#161B22] px-2 py-1.5 text-slate-800 dark:text-slate-200"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </label>
                <label className="text-slate-600 dark:text-slate-400">
                  Instances
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={selectedConfig.instances || 1}
                    onChange={(event) => updateNodeConfig(selectedNode.id, { instances: Number(event.target.value) })}
                    className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#161B22] px-2 py-1.5 text-slate-800 dark:text-slate-200"
                  />
                </label>
                <label className="text-slate-600 dark:text-slate-400">
                  Replicas
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={selectedConfig.replication || 1}
                    onChange={(event) => updateNodeConfig(selectedNode.id, { replication: Number(event.target.value) })}
                    className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#161B22] px-2 py-1.5 text-slate-800 dark:text-slate-200"
                  />
                </label>
                <div className="flex flex-col justify-end gap-1.5 pb-1 text-slate-600 dark:text-slate-400">
                  <label className="flex items-center gap-1.5">
                    <input
                      type="checkbox"
                      checked={!!selectedConfig.hasRateLimiting}
                      onChange={(event) => updateNodeConfig(selectedNode.id, { hasRateLimiting: event.target.checked })}
                    />
                    Rate limit
                  </label>
                  <label className="flex items-center gap-1.5">
                    <input
                      type="checkbox"
                      checked={!!selectedConfig.isClustered}
                      onChange={(event) => updateNodeConfig(selectedNode.id, { isClustered: event.target.checked })}
                    />
                    Clustered
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {selectedEdge && !selectedNode && (
        <div className="absolute top-4 left-4 z-20 flex items-center gap-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0D1117]/95 p-1.5 shadow-lg backdrop-blur-md">
          <span className="px-2 text-xs font-bold text-slate-700 dark:text-slate-300">Connection selected</span>
          <button
            type="button"
            onClick={() => deleteSelectedEdge()}
            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
          >
            <Trash2 size={13} />
            Delete
          </button>
        </div>
      )}

      {/* React Flow Core */}
      <ReactFlow
        nodes={nodes}
        edges={edges.map((edge) => ({ ...edge, selected: edge.id === selectedEdgeId }))}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgeClick={(_, edge) => setSelectedEdgeId(edge.id)}
        onPaneClick={() => {
          setSelectedEdgeId(null);
        }}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={nodeTypes}
        fitView
        snapToGrid
        snapGrid={[15, 15]}
        defaultEdgeOptions={{
          animated: true,
          style: { stroke: '#4A8BDF', strokeWidth: 2 },
        }}
        className="bg-[#F8FAFD] dark:bg-[#000000]"
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1.2} className="dark:opacity-30" />
        <Controls
          position="bottom-left"
          className="!bg-white dark:!bg-[#161B22] !border !border-[#DCE7F2] dark:!border-slate-700 !rounded-xl !shadow-sm !p-1 text-slate-700 dark:text-slate-200"
        />
      </ReactFlow>
    </div>
  );
}

export default function ArchitectureCanvas() {
  return (
    <ReactFlowProvider>
      <CanvasInner />
    </ReactFlowProvider>
  );
}
