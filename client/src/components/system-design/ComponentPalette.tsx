import { useState } from 'react';
import {
  Globe,
  Zap,
  Share2,
  Layers,
  Shield,
  Server,
  Cpu,
  Database,
  HardDrive,
  Boxes,
  Radio,
  Workflow,
  Lock,
  Activity,
  Search,
  Plus,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import clsx from 'clsx';
import { useSystemDesignStore } from '../../store/useSystemDesignStore';

interface PaletteItem {
  label: string;
  category: 'TRAFFIC' | 'COMPUTE' | 'STORAGE' | 'MESSAGING' | 'RELIABILITY' | 'OBSERVABILITY';
  subType: string;
  icon: any;
  desc: string;
}

const PALETTE_CATEGORIES: {
  category: 'TRAFFIC' | 'COMPUTE' | 'STORAGE' | 'MESSAGING' | 'RELIABILITY' | 'OBSERVABILITY';
  title: string;
  items: PaletteItem[];
}[] = [
  {
    category: 'TRAFFIC',
    title: 'Traffic & Edge Ingress',
    items: [
      { label: 'Web / Mobile Client', category: 'TRAFFIC', subType: 'client_app', icon: Globe, desc: 'Client application sending HTTP/WS requests' },
      { label: 'DNS (Route 53 / Cloudflare)', category: 'TRAFFIC', subType: 'dns', icon: Zap, desc: 'Domain Name System routing and GeoDNS' },
      { label: 'CDN Edge (Cloudflare / Fastly)', category: 'TRAFFIC', subType: 'cdn', icon: Zap, desc: 'Edge caching for static assets and hot data' },
      { label: 'Load Balancer (HAProxy / ALB)', category: 'TRAFFIC', subType: 'load_balancer', icon: Share2, desc: 'Layer 4 / Layer 7 traffic distributor' },
      { label: 'API Gateway (Kong / Envoy)', category: 'TRAFFIC', subType: 'api_gateway', icon: Layers, desc: 'Authentication, routing, and rate limiting' },
      { label: 'Rate Limiter Service', category: 'TRAFFIC', subType: 'rate_limiter', icon: Shield, desc: 'Token bucket / sliding window protection' },
    ],
  },
  {
    category: 'COMPUTE',
    title: 'Compute & Microservices',
    items: [
      { label: 'Web Server Cluster', category: 'COMPUTE', subType: 'web_server', icon: Server, desc: 'Stateless frontend application server' },
      { label: 'Core Microservice', category: 'COMPUTE', subType: 'microservice', icon: Server, desc: 'Domain business logic microservice' },
      { label: 'Async Background Worker', category: 'COMPUTE', subType: 'worker', icon: Cpu, desc: 'Batch computation and queue consumers' },
      { label: 'Serverless Function (Lambda)', category: 'COMPUTE', subType: 'serverless', icon: Cpu, desc: 'Event-driven on-demand compute' },
    ],
  },
  {
    category: 'STORAGE',
    title: 'Storage & Persistence',
    items: [
      { label: 'Relational DB (PostgreSQL / MySQL)', category: 'STORAGE', subType: 'relational_db', icon: Database, desc: 'ACID transactional SQL database' },
      { label: 'Document Store (MongoDB)', category: 'STORAGE', subType: 'nosql_doc', icon: HardDrive, desc: 'JSON/BSON schema-flexible storage' },
      { label: 'Key-Value Cache (Redis / Memcached)', category: 'STORAGE', subType: 'key_value', icon: Zap, desc: 'Ultra-low latency in-memory store' },
      { label: 'Wide-Column Store (Cassandra)', category: 'STORAGE', subType: 'wide_column', icon: HardDrive, desc: 'High-write throughput distributed storage' },
      { label: 'Blob / Object Storage (S3 / GCS)', category: 'STORAGE', subType: 'blob_storage', icon: Boxes, desc: 'Images, videos, and large binary blobs' },
    ],
  },
  {
    category: 'MESSAGING',
    title: 'Messaging & Real-Time',
    items: [
      { label: 'Kafka Event Stream', category: 'MESSAGING', subType: 'kafka', icon: Radio, desc: 'Distributed commit log & stream processing' },
      { label: 'RabbitMQ / SQS Queue', category: 'MESSAGING', subType: 'rabbitmq', icon: Radio, desc: 'Asynchronous task buffer and worker queue' },
      { label: 'Pub/Sub Broker', category: 'MESSAGING', subType: 'pubsub', icon: Radio, desc: 'Topic-based fan-out message distribution' },
      { label: 'WebSocket Gateway', category: 'MESSAGING', subType: 'websocket_gw', icon: Workflow, desc: 'Stateful bidirectional real-time socket mesh' },
    ],
  },
  {
    category: 'RELIABILITY',
    title: 'Reliability & Scaling',
    items: [
      { label: 'Redis Cache Cluster', category: 'RELIABILITY', subType: 'cache', icon: Zap, desc: 'Distributed cache with LRU eviction' },
      { label: 'Read Replica Node', category: 'RELIABILITY', subType: 'read_replica', icon: Database, desc: 'Read-only replica for database scaling' },
      { label: 'Circuit Breaker / Proxy', category: 'RELIABILITY', subType: 'circuit_breaker', icon: Lock, desc: 'Prevents cascading downstream failure' },
      { label: 'Database Shard Cluster', category: 'RELIABILITY', subType: 'shard_cluster', icon: Database, desc: 'Horizontal database partitioning' },
    ],
  },
  {
    category: 'OBSERVABILITY',
    title: 'Observability & Monitoring',
    items: [
      { label: 'Prometheus & Grafana', category: 'OBSERVABILITY', subType: 'prometheus_grafana', icon: Activity, desc: 'Real-time metrics, SLAs, and dashboards' },
      { label: 'ELK / Vector Logging', category: 'OBSERVABILITY', subType: 'elk_logging', icon: Activity, desc: 'Centralized log aggregation and search' },
      { label: 'Distributed Tracing (Jaeger)', category: 'OBSERVABILITY', subType: 'distributed_tracing', icon: Activity, desc: 'End-to-end request latency profiling' },
    ],
  },
];

export default function ComponentPalette() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    TRAFFIC: true,
    COMPUTE: true,
    STORAGE: true,
    MESSAGING: true,
    RELIABILITY: true,
    OBSERVABILITY: false,
  });

  const { addNode } = useSystemDesignStore();

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const onDragStart = (event: React.DragEvent, item: PaletteItem) => {
    event.dataTransfer.setData('application/reactflow-type', 'archNode');
    event.dataTransfer.setData('application/reactflow-label', item.label);
    event.dataTransfer.setData('application/reactflow-category', item.category);
    event.dataTransfer.setData('application/reactflow-subtype', item.subType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-72 bg-white border-r border-[#DCE7F2] flex flex-col h-full select-none shrink-0 overflow-hidden">
      {/* Search Header */}
      <div className="p-3 border-b border-[#DCE7F2] bg-slate-50/70">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
            Component Library
          </span>
          <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold font-mono">
            Drag & Drop
          </span>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-[#DCE7F2] rounded-xl focus:outline-none focus:border-[#4A8BDF] transition-colors"
          />
        </div>
      </div>

      {/* Accordion Categories */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {PALETTE_CATEGORIES.map((catGroup) => {
          const filteredItems = catGroup.items.filter(
            (item) =>
              item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.desc.toLowerCase().includes(searchTerm.toLowerCase())
          );

          if (filteredItems.length === 0) return null;

          const isExpanded = expandedCategories[catGroup.category] || !!searchTerm;

          return (
            <div key={catGroup.category} className="border border-slate-100 rounded-xl overflow-hidden bg-white shadow-2xs">
              <button
                type="button"
                onClick={() => toggleCategory(catGroup.category)}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100/80 transition-colors text-left"
              >
                <span>{catGroup.title}</span>
                {isExpanded ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />}
              </button>

              {isExpanded && (
                <div className="p-1.5 space-y-1">
                  {filteredItems.map((item) => {
                    const IconComp = item.icon;
                    return (
                      <div
                        key={item.subType}
                        draggable
                        onDragStart={(e) => onDragStart(e, item)}
                        onClick={() => addNode('archNode', item.label, item.category, item.subType)}
                        className="group flex items-start gap-2.5 p-2 rounded-xl hover:bg-[#EFFAFD] border border-transparent hover:border-[#4A8BDF]/30 cursor-grab active:cursor-grabbing transition-all text-left"
                        title="Click to add or drag onto canvas"
                      >
                        <div className="p-1.5 rounded-lg bg-slate-100 text-slate-700 group-hover:bg-[#4A8BDF] group-hover:text-white transition-colors shrink-0 mt-0.5">
                          <IconComp size={14} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-bold text-slate-800 group-hover:text-[#4A8BDF] truncate">
                              {item.label}
                            </span>
                            <Plus size={12} className="text-slate-400 group-hover:text-[#4A8BDF] opacity-0 group-hover:opacity-100 shrink-0" />
                          </div>
                          <p className="text-[10px] text-slate-500 line-clamp-1 leading-tight mt-0.5">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
