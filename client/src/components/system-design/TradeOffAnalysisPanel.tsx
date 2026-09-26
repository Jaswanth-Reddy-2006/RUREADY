import { useState } from 'react';
import {
  Scale,
  Database,
  Radio,
  Layers,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import clsx from 'clsx';

export default function TradeOffAnalysisPanel() {
  const [selectedCap, setSelectedCap] = useState<'AP' | 'CP' | 'CA'>('AP');
  const [selectedDb, setSelectedDb] = useState<'SQL' | 'NOSQL_DOC' | 'NOSQL_WIDE' | 'KEY_VALUE'>('SQL');
  const [syncAsync, setSyncAsync] = useState<'HYBRID' | 'STRICT_SYNC' | 'EVENT_DRIVEN'>('HYBRID');

  return (
    <div className="flex flex-col h-full bg-white select-none overflow-y-auto p-4 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 rounded-lg bg-[#EFFAFD] text-[#4A8BDF]">
            <Scale size={16} />
          </div>
          <h3 className="font-bold text-sm text-slate-800">
            Architectural Trade-Offs & CAP Matrix
          </h3>
        </div>
        <p className="text-xs text-slate-500">
          Senior system design requires conscious compromise between consistency, latency, durability, and cost.
        </p>
      </div>

      {/* 1. CAP Theorem Decision Matrix */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono flex items-center justify-between">
          <span>1. CAP Theorem Choice</span>
          <span className="text-[#4A8BDF] font-sans font-bold text-[11px]">{selectedCap} Chosen</span>
        </h4>

        <div className="grid grid-cols-3 gap-2">
          {/* AP */}
          <button
            type="button"
            onClick={() => setSelectedCap('AP')}
            className={clsx(
              'p-3 rounded-2xl border text-left transition-all',
              selectedCap === 'AP'
                ? 'bg-blue-50/80 border-[#4A8BDF] ring-2 ring-blue-200'
                : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100'
            )}
          >
            <div className="font-bold text-xs text-slate-800 mb-1">AP</div>
            <div className="text-[10px] text-slate-600 font-medium">Availability + Partition Tolerance</div>
            <div className="text-[9px] text-[#4A8BDF] mt-1 font-mono">Eventual Consistency</div>
          </button>

          {/* CP */}
          <button
            type="button"
            onClick={() => setSelectedCap('CP')}
            className={clsx(
              'p-3 rounded-2xl border text-left transition-all',
              selectedCap === 'CP'
                ? 'bg-blue-50/80 border-[#4A8BDF] ring-2 ring-blue-200'
                : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100'
            )}
          >
            <div className="font-bold text-xs text-slate-800 mb-1">CP</div>
            <div className="text-[10px] text-slate-600 font-medium">Consistency + Partition Tolerance</div>
            <div className="text-[9px] text-[#4A8BDF] mt-1 font-mono">Linearizable / Strong</div>
          </button>

          {/* CA */}
          <button
            type="button"
            onClick={() => setSelectedCap('CA')}
            className={clsx(
              'p-3 rounded-2xl border text-left transition-all',
              selectedCap === 'CA'
                ? 'bg-blue-50/80 border-[#4A8BDF] ring-2 ring-blue-200'
                : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100'
            )}
          >
            <div className="font-bold text-xs text-slate-800 mb-1">CA</div>
            <div className="text-[10px] text-slate-600 font-medium">Consistency + Availability</div>
            <div className="text-[9px] text-slate-400 mt-1 font-mono">Single Datacenter Only</div>
          </button>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
          {selectedCap === 'AP' && (
            <p>
              <strong>AP Rationale:</strong> The system returns the most recently available data even if network partitions occur across zones. Writes succeed locally and reconcile asynchronously via gossip protocols or CRDTs (Ideal for Social Feeds, URL Shorteners, Video Streaming).
            </p>
          )}
          {selectedCap === 'CP' && (
            <p>
              <strong>CP Rationale:</strong> The system denies writes and returns errors during network partitions rather than allowing split-brain or stale balances. Uses Paxos/Raft consensus (Ideal for Payments, Seat Booking, Master Election).
            </p>
          )}
          {selectedCap === 'CA' && (
            <p>
              <strong>CA Caveat:</strong> In distributed cloud environments, network partitions are inevitable (P is mandatory). CA is only valid in single-node or localized synchronous replication environments.
            </p>
          )}
        </div>
      </div>

      {/* 2. SQL vs NoSQL Evaluation */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
          2. Database Engine Justification
        </h4>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => setSelectedDb('SQL')}
            className={clsx(
              'p-2.5 rounded-xl border text-left transition-all',
              selectedDb === 'SQL' ? 'bg-[#EFFAFD] border-[#4A8BDF]' : 'bg-slate-50 border-slate-200'
            )}
          >
            <div className="font-bold text-slate-800">Relational SQL</div>
            <div className="text-[10px] text-slate-500">ACID, structured schema, complex joins</div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedDb('NOSQL_WIDE')}
            className={clsx(
              'p-2.5 rounded-xl border text-left transition-all',
              selectedDb === 'NOSQL_WIDE' ? 'bg-[#EFFAFD] border-[#4A8BDF]' : 'bg-slate-50 border-slate-200'
            )}
          >
            <div className="font-bold text-slate-800">Wide-Column (Cassandra)</div>
            <div className="text-[10px] text-slate-500">High write throughput, linear horizontal scale</div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedDb('NOSQL_DOC')}
            className={clsx(
              'p-2.5 rounded-xl border text-left transition-all',
              selectedDb === 'NOSQL_DOC' ? 'bg-[#EFFAFD] border-[#4A8BDF]' : 'bg-slate-50 border-slate-200'
            )}
          >
            <div className="font-bold text-slate-800">Document Store (MongoDB)</div>
            <div className="text-[10px] text-slate-500">Flexible JSON hierarchy, dynamic schemas</div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedDb('KEY_VALUE')}
            className={clsx(
              'p-2.5 rounded-xl border text-left transition-all',
              selectedDb === 'KEY_VALUE' ? 'bg-[#EFFAFD] border-[#4A8BDF]' : 'bg-slate-50 border-slate-200'
            )}
          >
            <div className="font-bold text-slate-800">Key-Value (Redis / DynamoDB)</div>
            <div className="text-[10px] text-slate-500">Sub-millisecond O(1) point lookups</div>
          </button>
        </div>
      </div>

      {/* 3. Communication Model */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
          3. Synchronous vs Asynchronous Communication
        </h4>

        <div className="space-y-2 text-xs">
          <label className="flex items-start gap-2.5 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
            <input
              type="radio"
              name="sync_model"
              checked={syncAsync === 'HYBRID'}
              onChange={() => setSyncAsync('HYBRID')}
              className="mt-0.5 accent-[#4A8BDF]"
            />
            <div>
              <div className="font-bold text-slate-800">Hybrid (Sync Ingress + Async Message Bus)</div>
              <div className="text-[11px] text-slate-500">
                Low-latency synchronous HTTP/gRPC for user responses; Kafka/RabbitMQ event stream for database write queues and background indexing.
              </div>
            </div>
          </label>

          <label className="flex items-start gap-2.5 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
            <input
              type="radio"
              name="sync_model"
              checked={syncAsync === 'EVENT_DRIVEN'}
              onChange={() => setSyncAsync('EVENT_DRIVEN')}
              className="mt-0.5 accent-[#4A8BDF]"
            />
            <div>
              <div className="font-bold text-slate-800">Fully Event-Driven Choreography</div>
              <div className="text-[11px] text-slate-500">
                Microservices communicate entirely through event streams with zero tight coupling.
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
