// ═══════════════════════════════════════════════════════════════
// R U Ready? — Admin Microservice Controls, LLM Engines & Cache Hub
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react';
import {
  Server,
  RefreshCw,
  Cpu,
  Database,
  ShieldAlert,
  Sliders,
  CheckCircle2,
  Trash2,
  Power,
  RotateCcw,
  Sparkles,
  Zap,
  Activity,
  Layers,
  Flame,
  Radio,
  Clock
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import apiClient from '@/api/client';
import toast from 'react-hot-toast';

interface MicroserviceItem {
  name: string;
  displayName: string;
  port: number;
  status: 'OPERATIONAL' | 'DEGRADED' | 'OFFLINE';
  latencyMs: number;
  lastChecked: string;
  lastRestarted: string | null;
  category: string;
  backgroundJobs: string;
}

export default function AdminSystemControls() {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // System Controls State
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceMsg, setMaintenanceMsg] = useState('RU Ready is currently undergoing scheduled platform upgrades. All mock interviews will resume shortly.');
  
  // LLM Config
  const [activeLlm, setActiveLlm] = useState('ollama/deepseek-coder:6.7b');
  const [fallbackLlm, setFallbackLlm] = useState('gemini/gemini-1.5-flash');
  const [temperature, setTemperature] = useState(0.3);
  const [maxTokens, setMaxTokens] = useState(2048);

  // Cache & Sandbox State
  const [redisStats, setRedisStats] = useState({
    status: 'CONNECTED',
    keysCount: 84,
    memoryUsedMb: 8.6,
    lastFlushedAt: new Date().toISOString(),
  });
  const [containerStats, setContainerStats] = useState({
    activeSandboxes: 0,
    pooledSandboxes: 4,
    lastRecycledAt: new Date().toISOString(),
  });

  // Services
  const [services, setServices] = useState<MicroserviceItem[]>([]);
  const [restartingService, setRestartingService] = useState<string | null>(null);
  const [flushingCache, setFlushingCache] = useState(false);

  const fetchSystemControls = async (silent = false) => {
    if (!silent) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      const res = await apiClient.get('/admin/system-controls');
      if (res.data) {
        setMaintenanceMode(res.data.maintenanceMode);
        setMaintenanceMsg(res.data.maintenanceMessage || maintenanceMsg);
        setActiveLlm(res.data.activeLlmEngine || 'ollama/deepseek-coder:6.7b');
        setFallbackLlm(res.data.llmFallbackEngine || 'gemini/gemini-1.5-flash');
        setTemperature(res.data.temperature !== undefined ? res.data.temperature : 0.3);
        setMaxTokens(res.data.maxTokens || 2048);
        if (res.data.redisCacheStatus) setRedisStats(res.data.redisCacheStatus);
        if (res.data.testContainerStatus) setContainerStats(res.data.testContainerStatus);
        if (res.data.services) setServices(res.data.services);
      }
    } catch (err) {
      console.warn('Failed to fetch live system controls:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSystemControls();
  }, []);

  const handleToggleMaintenance = async () => {
    const nextMode = !maintenanceMode;
    try {
      await apiClient.post('/admin/system-controls/maintenance', {
        enabled: nextMode,
        message: maintenanceMsg,
      });
      setMaintenanceMode(nextMode);
      toast.success(nextMode ? 'Maintenance mode enabled' : 'Platform live: Maintenance mode disabled');
    } catch {
      toast.error('Failed to toggle maintenance mode');
    }
  };

  const handleSaveLlmConfig = async () => {
    try {
      await apiClient.post('/admin/system-controls/llm-model', {
        activeEngine: activeLlm,
        fallbackEngine: fallbackLlm,
        temperature,
        maxTokens,
      });
      toast.success('LLM orchestration settings updated successfully!');
    } catch {
      toast.error('Failed to update LLM configuration');
    }
  };

  const handleFlushCache = async (target: 'REDIS' | 'SANDBOX_CONTAINERS' | 'ALL') => {
    setFlushingCache(true);
    try {
      const res = await apiClient.post('/admin/system-controls/flush-cache', { target });
      if (res.data?.redisCacheStatus) setRedisStats(res.data.redisCacheStatus);
      if (res.data?.testContainerStatus) setContainerStats(res.data.testContainerStatus);
      toast.success(`Cache flushed: ${target}`);
    } catch {
      toast.error('Failed to flush cache');
    } finally {
      setFlushingCache(false);
    }
  };

  const handleRestartService = async (serviceName: string) => {
    setRestartingService(serviceName);
    try {
      await apiClient.post(`/admin/system-controls/restart/${serviceName}`);
      toast.success(`Worker restarted: ${serviceName}`);
      await fetchSystemControls(true);
    } catch {
      toast.error(`Failed to restart ${serviceName}`);
    } finally {
      setRestartingService(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <div className="h-10 w-10 border-3 border-[#2459A8] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-mono text-[#526078]">Loading system control matrix...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 font-sans pb-12">
      {/* ─── Header ─── */}
      <div className="bg-white p-6 rounded-3xl border border-[#DCE7F2] shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-[#EFFAFD] text-[#2459A8] border border-[#DCE7F2]">
              <Sliders size={22} />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#11183D] tracking-tight">
              Microservice Control & Cache Management
            </h1>
          </div>
          <p className="text-xs text-[#526078]">
            Manage live worker reloads, LLM orchestration engines, Redis memory buffers, and maintenance gates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchSystemControls(true)}
            disabled={isRefreshing}
            className="p-2.5 rounded-2xl bg-[#EFFAFD] text-[#2459A8] hover:bg-[#DCE7F2] border border-[#DCE7F2] transition-colors cursor-pointer"
            title="Refresh System State"
          >
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* ─── Maintenance Mode Control Card ─── */}
      <Card padding="lg" className={`border transition-all ${
        maintenanceMode ? 'bg-amber-500/10 border-amber-400' : 'bg-white border-[#DCE7F2]'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-2xl shrink-0 ${
              maintenanceMode ? 'bg-amber-500 text-white' : 'bg-[#EFFAFD] text-[#2459A8] border border-[#DCE7F2]'
            }`}>
              <ShieldAlert size={26} />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <h2 className="text-base font-black text-[#11183D]">Global Platform Maintenance Mode</h2>
                <Badge variant={maintenanceMode ? 'warning' : 'success'} size="xs">
                  {maintenanceMode ? 'MAINTENANCE ACTIVE' : 'PLATFORM LIVE'}
                </Badge>
              </div>
              <p className="text-xs text-[#526078] max-w-2xl">
                When enabled, incoming candidate mock interviews are paused and a polite maintenance screen is rendered with the broadcast message below.
              </p>
              
              <div className="pt-2">
                <input
                  type="text"
                  value={maintenanceMsg}
                  onChange={(e) => setMaintenanceMsg(e.target.value)}
                  placeholder="Custom maintenance announcement message..."
                  className="w-full max-w-xl px-3 py-2 text-xs font-medium rounded-xl bg-white border border-[#DCE7F2] text-[#11183D] focus:ring-2 focus:ring-[#4A8BDF] outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant={maintenanceMode ? 'primary' : 'secondary'}
              onClick={handleToggleMaintenance}
              icon={<Power size={15} />}
            >
              {maintenanceMode ? 'Disable Maintenance (Go Live)' : 'Enable Maintenance Mode'}
            </Button>
          </div>
        </div>
      </Card>

      {/* ─── Grid: LLM Orchestration + Redis & Test Sandboxes ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT: LLM Engine Fallback Selector */}
        <Card padding="lg" className="lg:col-span-7 bg-white border-[#DCE7F2] shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#DCE7F2]">
            <div className="flex items-center gap-2">
              <Sparkles className="text-[#2459A8]" size={18} />
              <h2 className="font-black text-[#11183D] text-sm">LLM Engine & Fallback Orchestration</h2>
            </div>
            <Badge variant="neutral" size="xs">Ollama + Cloud Router</Badge>
          </div>

          <div className="space-y-4 text-xs">
            {/* Active Primary Engine */}
            <div className="space-y-1.5">
              <label className="font-bold text-[#11183D] flex items-center justify-between">
                <span>Primary Local LLM Engine (Ollama / Localhost):</span>
                <span className="text-[10px] text-emerald-600 font-mono">0ms Token Latency</span>
              </label>
              <select
                value={activeLlm}
                onChange={(e) => setActiveLlm(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#EFFAFD] border border-[#DCE7F2] font-mono font-bold text-[#11183D] focus:ring-2 focus:ring-[#4A8BDF] outline-none cursor-pointer"
              >
                <option value="ollama/deepseek-coder:6.7b">Ollama / DeepSeek-Coder 6.7B (Recommended for Coding)</option>
                <option value="ollama/llama3:8b">Ollama / Meta Llama 3 8B (Recommended for Oral STAR)</option>
                <option value="ollama/qwen2.5-coder:7b">Ollama / Qwen 2.5 Coder 7B</option>
                <option value="ollama/mistral:7b">Ollama / Mistral 7B Instruct</option>
              </select>
            </div>

            {/* Cloud Fallback Engine */}
            <div className="space-y-1.5">
              <label className="font-bold text-[#11183D] flex items-center justify-between">
                <span>Cloud Fallback Provider (Auto-failover on queue/OOM):</span>
                <span className="text-[10px] text-blue-600 font-mono">Failover Ready</span>
              </label>
              <select
                value={fallbackLlm}
                onChange={(e) => setFallbackLlm(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#EFFAFD] border border-[#DCE7F2] font-mono font-bold text-[#11183D] focus:ring-2 focus:ring-[#4A8BDF] outline-none cursor-pointer"
              >
                <option value="gemini/gemini-1.5-flash">Google Gemini 1.5 Flash (Ultra Fast)</option>
                <option value="openai/gpt-4o-mini">OpenAI GPT-4o Mini</option>
                <option value="anthropic/claude-3-5-haiku">Anthropic Claude 3.5 Haiku</option>
              </select>
            </div>

            {/* Temperature & Token Sliders */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <div className="flex justify-between font-bold text-[#11183D]">
                  <span>Temperature:</span>
                  <span className="font-mono text-[#2459A8]">{temperature}</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.05"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full accent-[#2459A8]"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between font-bold text-[#11183D]">
                  <span>Max Tokens:</span>
                  <span className="font-mono text-[#2459A8]">{maxTokens}</span>
                </div>
                <input
                  type="range"
                  min="512"
                  max="4096"
                  step="256"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                  className="w-full accent-[#2459A8]"
                />
              </div>
            </div>

            <div className="pt-3">
              <Button
                variant="primary"
                size="sm"
                fullWidth
                onClick={handleSaveLlmConfig}
                icon={<CheckCircle2 size={14} />}
              >
                Save LLM Orchestration Parameters
              </Button>
            </div>
          </div>
        </Card>

        {/* RIGHT: Cache & Isolated Container Hub */}
        <Card padding="lg" className="lg:col-span-5 bg-white border-[#DCE7F2] shadow-sm space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#DCE7F2]">
              <div className="flex items-center gap-2">
                <Database className="text-[#2459A8]" size={18} />
                <h2 className="font-black text-[#11183D] text-sm">Redis Memory & Container Caches</h2>
              </div>
              <Badge variant="success" size="xs">CONNECTED</Badge>
            </div>

            <div className="space-y-4 pt-3 text-xs">
              {/* Redis Card */}
              <div className="p-3 rounded-2xl bg-[#EFFAFD] border border-[#DCE7F2] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#11183D] flex items-center gap-1.5">
                    <Zap size={13} className="text-amber-500" />
                    <span>Redis Session Cache</span>
                  </span>
                  <span className="font-mono font-bold text-[#2459A8]">{redisStats.memoryUsedMb} MB</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#526078] font-mono">
                  <span>Keys: {redisStats.keysCount} cached</span>
                  <span>Last flushed: {new Date(redisStats.lastFlushedAt).toLocaleTimeString()}</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  fullWidth
                  isLoading={flushingCache}
                  onClick={() => handleFlushCache('REDIS')}
                  icon={<Trash2 size={12} />}
                >
                  Flush Redis Session Buffer
                </Button>
              </div>

              {/* Container Pool Card */}
              <div className="p-3 rounded-2xl bg-[#EFFAFD] border border-[#DCE7F2] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#11183D] flex items-center gap-1.5">
                    <Cpu size={13} className="text-purple-600" />
                    <span>Monaco Test Runners</span>
                  </span>
                  <span className="font-mono font-bold text-emerald-600">{containerStats.pooledSandboxes} Ready</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#526078] font-mono">
                  <span>Active Executions: {containerStats.activeSandboxes}</span>
                  <span>Recycled: {new Date(containerStats.lastRecycledAt).toLocaleTimeString()}</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  fullWidth
                  isLoading={flushingCache}
                  onClick={() => handleFlushCache('SANDBOX_CONTAINERS')}
                  icon={<RotateCcw size={12} />}
                >
                  Recycle Code Sandbox Containers
                </Button>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Button
              size="sm"
              variant="secondary"
              fullWidth
              isLoading={flushingCache}
              onClick={() => handleFlushCache('ALL')}
              icon={<Trash2 size={13} />}
            >
              Flush All System Caches & Workers
            </Button>
          </div>
        </Card>

      </div>

      {/* ─── Microservice Restart Matrix ─── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-black text-[#11183D] text-base">Direct Microservice Worker Controls</h2>
            <p className="text-xs text-[#526078]">Restart individual service workers without taking down the entire cluster.</p>
          </div>
          <Badge variant="neutral" size="sm">
            {services.length} Microservices Monitored
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((svc) => {
            const isRestarting = restartingService === svc.name;

            return (
              <Card
                key={svc.name}
                padding="md"
                className="bg-white border-[#DCE7F2] shadow-sm space-y-3 hover:border-[#4A8BDF] transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#526078] font-mono">
                        {svc.category}
                      </span>
                      <h3 className="font-bold text-[#11183D] text-sm">{svc.displayName}</h3>
                      <p className="text-[11px] font-mono text-[#526078]">
                        Port: <strong className="text-[#11183D]">:{svc.port}</strong> • {svc.name}
                      </p>
                    </div>

                    <Badge variant={svc.status === 'OPERATIONAL' ? 'success' : 'warning'} size="xs">
                      {svc.status}
                    </Badge>
                  </div>

                  <div className="p-2 rounded-xl bg-[#EFFAFD] text-[11px] font-mono text-[#526078] flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      Latency: <strong className="text-emerald-700">{svc.latencyMs}ms</strong>
                    </span>
                    {svc.lastRestarted ? (
                      <span className="text-[10px] text-[#2459A8] font-bold">Restarted {new Date(svc.lastRestarted).toLocaleTimeString()}</span>
                    ) : (
                      <span className="text-[10px] text-slate-400">Default runtime</span>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#DCE7F2]">
                  <Button
                    size="sm"
                    variant="outline"
                    fullWidth
                    isLoading={isRestarting}
                    onClick={() => handleRestartService(svc.name)}
                    icon={<RotateCcw size={12} />}
                  >
                    Restart Service Worker
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

    </div>
  );
}
