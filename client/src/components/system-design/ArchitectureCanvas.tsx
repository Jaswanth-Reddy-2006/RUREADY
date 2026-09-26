import { useCallback, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
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
    clearCanvas,
    loadReferenceArchitecture,
    selectedNodeId,
    validationReport,
    isSaving,
  } = useSystemDesignStore();

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
    <div className="relative flex-1 h-full bg-[#FAFCFF] overflow-hidden" ref={reactFlowWrapper}>
      {/* Top Floating Toolbar */}
      <div className="absolute top-3 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        {/* Left: Quick Actions */}
        <div className="flex items-center gap-1.5 p-1.5 bg-white/95 backdrop-blur-md rounded-2xl border border-[#DCE7F2] shadow-sm pointer-events-auto">
          <button
            type="button"
            onClick={() => loadReferenceArchitecture()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#4A8BDF] bg-blue-50/70 hover:bg-blue-100/80 transition-colors"
            title="Load standard reference architecture for this problem"
          >
            <Sparkles size={13} />
            <span>Reference Solution</span>
          </button>

          <div className="h-4 w-px bg-slate-200 mx-1" />

          <button
            type="button"
            onClick={() => clearCanvas()}
            className="p-1.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title="Clear whiteboard canvas"
          >
            <RotateCcw size={15} />
          </button>

          {selectedNodeId && (
            <button
              type="button"
              onClick={() => deleteSelectedNode()}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors"
              title="Delete selected component"
            >
              <Trash2 size={13} />
              <span>Delete</span>
            </button>
          )}
        </div>

        {/* Right: Architecture Health Pill & Auto-Save */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {isSaving && (
            <div className="px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-xl border border-slate-200 text-[11px] font-mono text-slate-500 flex items-center gap-1.5 shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-[#4A8BDF] animate-ping" />
              Saving...
            </div>
          )}

          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/95 backdrop-blur-md rounded-2xl border border-[#DCE7F2] shadow-sm text-xs font-mono">
            <span className="text-slate-500">Health:</span>
            <span
              className={clsx(
                'font-bold px-2 py-0.5 rounded-full text-[11px]',
                healthScore >= 90
                  ? 'bg-emerald-100 text-emerald-800'
                  : healthScore >= 70
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-rose-100 text-rose-800'
              )}
            >
              {healthScore}%
            </span>
            {spofCount > 0 && (
              <span className="flex items-center gap-1 text-rose-600 font-bold">
                <AlertTriangle size={13} />
                {spofCount} SPOF
              </span>
            )}
          </div>
        </div>
      </div>

      {/* React Flow Core */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
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
        className="bg-[#F8FAFD]"
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1.2} color="#CBD5E1" />
        <Controls
          position="bottom-left"
          className="!bg-white !border !border-[#DCE7F2] !rounded-xl !shadow-sm !p-1"
        />
        <MiniMap
          position="bottom-right"
          zoomable
          pannable
          nodeColor={(n: any) => {
            if (n.data?.category === 'TRAFFIC') return '#38bdf8';
            if (n.data?.category === 'COMPUTE') return '#818cf8';
            if (n.data?.category === 'STORAGE') return '#34d399';
            if (n.data?.category === 'MESSAGING') return '#fbbf24';
            if (n.data?.category === 'RELIABILITY') return '#fb7185';
            return '#c084fc';
          }}
          className="!bg-white !border !border-[#DCE7F2] !rounded-2xl !shadow-sm !overflow-hidden"
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
