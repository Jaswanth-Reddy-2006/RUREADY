// ═══════════════════════════════════════════════════════════════
// RU Ready? — Deterministic Capacity Estimation Engine
// Pure mathematical calculations for System Design scaling
// ═══════════════════════════════════════════════════════════════

export interface CapacityInputs {
  dau: number;                      // Daily Active Users
  readsPerUserPerDay: number;       // Average reads per user / day
  writesPerUserPerDay: number;      // Average writes per user / day
  avgReadPayloadBytes: number;      // Payload size per read in bytes
  avgWritePayloadBytes: number;     // Payload size per write in bytes
  peakMultiplier?: number;          // Peak traffic multiplier (default: 2.5)
  retentionYears?: number;          // Data retention in years (default: 5)
  replicationFactor?: number;       // Database replication factor (default: 3)
  cacheRatio?: number;              // 80/20 rule cache ratio (default: 0.20)
  appServerRpsCapacity?: number;    // RPS capacity per app server (default: 1000)
  dbShardWriteRpsCapacity?: number; // Write RPS per DB shard (default: 4000)
  redisNodeMemoryGb?: number;       // RAM per Redis node in GB (default: 32)
}

export interface CapacityOutputs {
  // Traffic metrics
  totalDailyReads: number;
  totalDailyWrites: number;
  readWriteRatio: string;
  avgReadQps: number;
  avgWriteQps: number;
  totalAvgQps: number;
  peakReadQps: number;
  peakWriteQps: number;
  peakTotalQps: number;

  // Bandwidth metrics
  ingressBandwidthBps: number;
  ingressBandwidthMbps: number;
  peakIngressBandwidthMbps: number;
  egressBandwidthBps: number;
  egressBandwidthMbps: number;
  peakEgressBandwidthMbps: number;

  // Storage metrics
  dailyStorageBytes: number;
  dailyStorageFormatted: string;
  annualStorageBytes: number;
  annualStorageFormatted: string;
  retentionStorageBytes: number;
  retentionStorageFormatted: string;
  totalStorageWithReplicationBytes: number;
  totalStorageWithReplicationFormatted: string;

  // Memory & Cache metrics (80/20 Rule)
  cacheMemoryRequiredBytes: number;
  cacheMemoryRequiredFormatted: string;

  // Cluster Sizing recommendations
  recommendedAppServers: number;
  recommendedDbShards: number;
  recommendedRedisNodes: number;

  // Step-by-step calculation breakdown for candidate education
  breakdown: {
    title: string;
    formula: string;
    result: string;
  }[];
}

export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(Math.round(num));
}

export function calculateCapacity(inputs: CapacityInputs): CapacityOutputs {
  const SECONDS_IN_A_DAY = 86400;

  const dau = Math.max(1, inputs.dau || 10_000_000);
  const readsPerDay = Math.max(0, inputs.readsPerUserPerDay ?? 10);
  const writesPerDay = Math.max(0, inputs.writesPerUserPerDay ?? 1);
  const readPayload = Math.max(1, inputs.avgReadPayloadBytes || 2048);
  const writePayload = Math.max(1, inputs.avgWritePayloadBytes || 512);
  const peakMultiplier = inputs.peakMultiplier && inputs.peakMultiplier > 0 ? inputs.peakMultiplier : 2.5;
  const retentionYears = inputs.retentionYears && inputs.retentionYears > 0 ? inputs.retentionYears : 5;
  const replicationFactor = inputs.replicationFactor && inputs.replicationFactor > 0 ? inputs.replicationFactor : 3;
  const cacheRatio = inputs.cacheRatio && inputs.cacheRatio > 0 ? inputs.cacheRatio : 0.20;
  const appServerRps = inputs.appServerRpsCapacity && inputs.appServerRpsCapacity > 0 ? inputs.appServerRpsCapacity : 1000;
  const dbShardWriteRps = inputs.dbShardWriteRpsCapacity && inputs.dbShardWriteRpsCapacity > 0 ? inputs.dbShardWriteRpsCapacity : 4000;
  const redisNodeGb = inputs.redisNodeMemoryGb && inputs.redisNodeMemoryGb > 0 ? inputs.redisNodeMemoryGb : 32;

  // 1. Daily Operations & QPS
  const totalDailyReads = dau * readsPerDay;
  const totalDailyWrites = dau * writesPerDay;
  const avgReadQps = totalDailyReads / SECONDS_IN_A_DAY;
  const avgWriteQps = totalDailyWrites / SECONDS_IN_A_DAY;
  const totalAvgQps = avgReadQps + avgWriteQps;

  const peakReadQps = avgReadQps * peakMultiplier;
  const peakWriteQps = avgWriteQps * peakMultiplier;
  const peakTotalQps = totalAvgQps * peakMultiplier;

  const ratio = writesPerDay > 0 ? `${(readsPerDay / writesPerDay).toFixed(1)}:1` : `${readsPerDay}:0`;

  // 2. Bandwidth Calculations
  const ingressBandwidthBps = avgWriteQps * writePayload;
  const ingressBandwidthMbps = (ingressBandwidthBps * 8) / (1000 * 1000);
  const peakIngressBandwidthMbps = ingressBandwidthMbps * peakMultiplier;

  const egressBandwidthBps = avgReadQps * readPayload;
  const egressBandwidthMbps = (egressBandwidthBps * 8) / (1000 * 1000);
  const peakEgressBandwidthMbps = egressBandwidthMbps * peakMultiplier;

  // 3. Storage Calculations
  const dailyStorageBytes = totalDailyWrites * writePayload;
  const annualStorageBytes = dailyStorageBytes * 365;
  const retentionStorageBytes = annualStorageBytes * retentionYears;
  const totalStorageWithReplicationBytes = retentionStorageBytes * replicationFactor;

  // 4. Cache Memory (80/20 Pareto Rule)
  // Cache 20% of daily read requests in RAM
  const cacheMemoryRequiredBytes = totalDailyReads * readPayload * cacheRatio;

  // 5. Sizing Estimates
  const recommendedAppServers = Math.max(2, Math.ceil(peakTotalQps / appServerRps) + 2); // N+2 redundancy
  const recommendedDbShards = Math.max(1, Math.ceil(peakWriteQps / dbShardWriteRps));
  
  // Redis safe utilization 70%
  const redisNodeBytes = redisNodeGb * 1024 * 1024 * 1024 * 0.70;
  const recommendedRedisNodes = Math.max(2, Math.ceil(cacheMemoryRequiredBytes / redisNodeBytes) * 2); // Primary + Replica pair

  const breakdown = [
    {
      title: 'Average Read QPS',
      formula: `(${formatNumber(dau)} DAU × ${readsPerDay} reads) / 86,400s`,
      result: `${formatNumber(avgReadQps)} req/sec`,
    },
    {
      title: 'Peak Total QPS',
      formula: `(${formatNumber(avgReadQps)} read QPS + ${formatNumber(avgWriteQps)} write QPS) × ${peakMultiplier} peak multiplier`,
      result: `${formatNumber(peakTotalQps)} req/sec`,
    },
    {
      title: 'Ingress Bandwidth',
      formula: `${formatNumber(avgWriteQps)} writes/s × ${writePayload} B × 8 bits`,
      result: `${ingressBandwidthMbps.toFixed(2)} Mbps (Peak: ${peakIngressBandwidthMbps.toFixed(2)} Mbps)`,
    },
    {
      title: 'Egress Bandwidth',
      formula: `${formatNumber(avgReadQps)} reads/s × ${readPayload} B × 8 bits`,
      result: `${egressBandwidthMbps.toFixed(2)} Mbps (Peak: ${peakEgressBandwidthMbps.toFixed(2)} Mbps)`,
    },
    {
      title: '5-Year Storage (with 3x replication)',
      formula: `${formatBytes(dailyStorageBytes)}/day × 365 × ${retentionYears} yrs × ${replicationFactor}x`,
      result: formatBytes(totalStorageWithReplicationBytes),
    },
    {
      title: 'Cache Memory (80/20 Rule)',
      formula: `20% of daily read volume (${formatNumber(totalDailyReads)} reads × ${readPayload} B × 0.20)`,
      result: formatBytes(cacheMemoryRequiredBytes),
    },
  ];

  return {
    totalDailyReads,
    totalDailyWrites,
    readWriteRatio: ratio,
    avgReadQps,
    avgWriteQps,
    totalAvgQps,
    peakReadQps,
    peakWriteQps,
    peakTotalQps,
    ingressBandwidthBps,
    ingressBandwidthMbps,
    peakIngressBandwidthMbps,
    egressBandwidthBps,
    egressBandwidthMbps,
    peakEgressBandwidthMbps,
    dailyStorageBytes,
    dailyStorageFormatted: formatBytes(dailyStorageBytes),
    annualStorageBytes,
    annualStorageFormatted: formatBytes(annualStorageBytes),
    retentionStorageBytes,
    retentionStorageFormatted: formatBytes(retentionStorageBytes),
    totalStorageWithReplicationBytes,
    totalStorageWithReplicationFormatted: formatBytes(totalStorageWithReplicationBytes),
    cacheMemoryRequiredBytes,
    cacheMemoryRequiredFormatted: formatBytes(cacheMemoryRequiredBytes),
    recommendedAppServers,
    recommendedDbShards,
    recommendedRedisNodes,
    breakdown,
  };
}
