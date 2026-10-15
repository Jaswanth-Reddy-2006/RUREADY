import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import {
  Globe,
  Cpu,
  Database,
  Layers,
  Shield,
  Activity,
  HardDrive,
  Server,
  Radio,
  Share2,
  Workflow,
  Zap,
  Lock,
  Boxes,
  Sliders,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import clsx from 'clsx';
import { useSystemDesignStore } from '../../../store/useSystemDesignStore';

const CATEGORY_STYLES: Record<string, { bg: string; border: string; text: string; badgeBg: string; badgeText: string }> = {
  TRAFFIC: {
    bg: 'bg-sky-50/80',
    border: 'border-sky-400',
    text: 'text-sky-800',
    badgeBg: 'bg-sky-100',
    badgeText: 'text-sky-700',
  },
  COMPUTE: {
    bg: 'bg-indigo-50/80',
    border: 'border-indigo-400',
    text: 'text-indigo-800',
    badgeBg: 'bg-indigo-100',
    badgeText: 'text-indigo-700',
  },
  STORAGE: {
    bg: 'bg-emerald-50/80',
    border: 'border-emerald-400',
    text: 'text-emerald-800',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-700',
  },
  MESSAGING: {
    bg: 'bg-amber-50/80',
    border: 'border-amber-400',
    text: 'text-amber-800',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-700',
  },
  RELIABILITY: {
    bg: 'bg-rose-50/80',
    border: 'border-rose-400',
    text: 'text-rose-800',
    badgeBg: 'bg-rose-100',
    badgeText: 'text-rose-700',
  },
  OBSERVABILITY: {
    bg: 'bg-purple-50/80',
    border: 'border-purple-400',
    text: 'text-purple-800',
    badgeBg: 'bg-purple-100',
    badgeText: 'text-purple-700',
  },
};

function getSubtypeIcon(subType: string, iconSize = 18) {
  switch (subType) {
    case 'client_app':
      return <Globe size={iconSize} className="text-sky-600" />;
    case 'dns':
    case 'cdn':
      return <Zap size={iconSize} className="text-amber-500" />;
    case 'load_balancer':
      return <Share2 size={iconSize} className="text-sky-600" />;
    case 'api_gateway':
      return <Layers size={iconSize} className="text-indigo-600" />;
    case 'rate_limiter':
      return <Shield size={iconSize} className="text-rose-600" />;
    case 'web_server':
    case 'microservice':
      return <Server size={iconSize} className="text-indigo-600" />;
    case 'worker':
    case 'serverless':
      return <Cpu size={iconSize} className="text-indigo-600" />;
    case 'relational_db':
      return <Database size={iconSize} className="text-emerald-600" />;
    case 'nosql_doc':
    case 'wide_column':
      return <HardDrive size={iconSize} className="text-emerald-600" />;
    case 'key_value':
    case 'cache':
      return <Zap size={iconSize} className="text-rose-600" />;
    case 'blob_storage':
      return <Boxes size={iconSize} className="text-emerald-600" />;
    case 'kafka':
    case 'rabbitmq':
    case 'pubsub':
      return <Radio size={iconSize} className="text-amber-600" />;
    case 'websocket_gw':
      return <Workflow size={iconSize} className="text-amber-600" />;
    case 'circuit_breaker':
    case 'service_mesh':
      return <Lock size={iconSize} className="text-rose-600" />;
    case 'read_replica':
    case 'shard_cluster':
      return <Database size={iconSize} className="text-rose-600" />;
    case 'prometheus_grafana':
    case 'elk_logging':
    case 'distributed_tracing':
      return <Activity size={iconSize} className="text-purple-600" />;
    case 'waf':
    case 'secrets_manager':
      return <Shield size={iconSize} className="text-rose-600" />;
    case 'nat_gateway':
      return <Globe size={iconSize} className="text-sky-600" />;
    case 'kubernetes':
      return <Boxes size={iconSize} className="text-indigo-600" />;
    case 'search_index':
      return <Layers size={iconSize} className="text-emerald-600" />;
    case 'data_warehouse':
      return <Database size={iconSize} className="text-emerald-600" />;
    case 'schema_registry':
    case 'stream_processor':
      return <Workflow size={iconSize} className="text-amber-600" />;
    case 'feature_flags':
      return <Sliders size={iconSize} className="text-rose-600" />;
    default:
      return <Server size={iconSize} className="text-slate-600" />;
  }
}

export const ArchitectureNode = memo(({ id, data, selected }: NodeProps) => {
  const nodeData = data as any;
  const category = nodeData?.category || 'COMPUTE';
  const subType = nodeData?.subType || 'microservice';
  const label = nodeData?.label || 'Component';
  const config = nodeData?.config || {};

  const { validationReport, setSelectedNodeId } = useSystemDesignStore();

  const style = CATEGORY_STYLES[category] || CATEGORY_STYLES.COMPUTE;
  const sizeClass = config.size === 'small' ? 'min-w-[180px]' : config.size === 'large' ? 'min-w-[260px]' : 'min-w-[210px]';

  // Check if node has validation issues
  const nodeIssues = (validationReport?.issues || []).filter((i) =>
    i.nodeIds?.includes(id)
  );
  const hasError = nodeIssues.some((i) => i.severity === 'ERROR');
  const hasWarning = nodeIssues.some((i) => i.severity === 'WARNING');

  return (
    <div
      onClick={() => setSelectedNodeId(id)}
      className={clsx(
        `relative group ${sizeClass} rounded-2xl p-3.5 shadow-sm border-2 transition-all duration-200 cursor-pointer bg-white`,
        style.border,
        selected ? 'ring-4 ring-[#4A8BDF]/40 scale-105 shadow-md' : 'hover:shadow-md hover:border-slate-400',
        hasError && 'border-rose-500 ring-2 ring-rose-400/40 bg-rose-50/20',
        hasWarning && !hasError && 'border-amber-500 ring-2 ring-amber-400/30'
      )}
    >
      {/* Handles */}
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="!left-0 !top-2 !h-[calc(100%-16px)] !w-3 !rounded-none !border-0 !bg-transparent"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="!right-0 !top-2 !h-[calc(100%-16px)] !w-3 !rounded-none !border-0 !bg-transparent"
      />
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="!top-0 !left-2 !h-3 !w-[calc(100%-16px)] !rounded-none !border-0 !bg-transparent"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="!bottom-0 !left-2 !h-3 !w-[calc(100%-16px)] !rounded-none !border-0 !bg-transparent"
      />

      {/* Header with Icon & Category */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div className={clsx('h-11 w-11 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-center', style.bg)}>
            {getSubtypeIcon(subType, 25)}
          </div>
          <span className={clsx('text-[10px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded-full', style.badgeBg, style.badgeText)}>
            {category}
          </span>
        </div>

        {/* Validation indicator icon */}
        {hasError ? (
          <div className="flex items-center gap-1 text-rose-600 animate-pulse" title={nodeIssues[0]?.title}>
            <AlertTriangle size={14} />
          </div>
        ) : hasWarning ? (
          <div className="flex items-center gap-1 text-amber-500" title={nodeIssues[0]?.title}>
            <AlertTriangle size={14} />
          </div>
        ) : (
          <CheckCircle2 size={13} className="text-emerald-500 opacity-60 group-hover:opacity-100" />
        )}
      </div>

      {/* Node Label */}
      <div className="font-bold text-xs text-slate-800 tracking-tight line-clamp-1 mb-1 font-sans">
        {label}
      </div>

      {/* Subtext Specs / Badges */}
      <div className="flex items-center gap-1.5 flex-wrap text-[10px] text-slate-500 font-mono">
        {config.instances && (
          <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/80">
            {config.instances}x Inst
          </span>
        )}
        {config.replication && (
          <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/80">
            {config.replication}x Repl
          </span>
        )}
        {config.engine && (
          <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/80">
            {config.engine}
          </span>
        )}
        {config.hasRateLimiting && (
          <span className="bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded border border-rose-200">
            RateLimit
          </span>
        )}
      </div>
    </div>
  );
});

ArchitectureNode.displayName = 'ArchitectureNode';
export default ArchitectureNode;
