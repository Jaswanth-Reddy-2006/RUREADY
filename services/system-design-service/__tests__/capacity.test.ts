import { describe, it, expect } from 'vitest';
import { calculateCapacity, formatBytes } from '../src/engine/capacityEngine.js';

describe('Capacity Estimation Engine', () => {
  it('calculates accurate QPS and Read/Write ratios', () => {
    const outputs = calculateCapacity({
      dau: 10_000_000,
      readsPerUserPerDay: 20,
      writesPerUserPerDay: 2,
      avgReadPayloadBytes: 2048,
      avgWritePayloadBytes: 512,
      peakMultiplier: 2.5,
      retentionYears: 5,
      replicationFactor: 3,
    });

    // 10M * 20 = 200M reads / 86400s = ~2314.81 reads/sec
    expect(outputs.totalDailyReads).toBe(200_000_000);
    expect(outputs.totalDailyWrites).toBe(20_000_000);
    expect(Math.round(outputs.avgReadQps)).toBe(2315);
    expect(Math.round(outputs.avgWriteQps)).toBe(231);
    expect(outputs.readWriteRatio).toBe('10.0:1');
    expect(Math.round(outputs.peakReadQps)).toBe(Math.round(2314.8148 * 2.5));
  });

  it('calculates bandwidth and storage metrics correctly', () => {
    const outputs = calculateCapacity({
      dau: 50_000_000,
      readsPerUserPerDay: 10,
      writesPerUserPerDay: 1,
      avgReadPayloadBytes: 1024,
      avgWritePayloadBytes: 1024,
      peakMultiplier: 2.0,
      retentionYears: 3,
      replicationFactor: 3,
    });

    expect(outputs.dailyStorageBytes).toBe(50_000_000 * 1024);
    expect(outputs.retentionStorageBytes).toBe(outputs.dailyStorageBytes * 365 * 3);
    expect(outputs.totalStorageWithReplicationBytes).toBe(outputs.retentionStorageBytes * 3);
    expect(outputs.recommendedAppServers).toBeGreaterThanOrEqual(2);
    expect(outputs.recommendedRedisNodes).toBeGreaterThanOrEqual(2);
  });

  it('formats bytes correctly', () => {
    expect(formatBytes(1024)).toBe('1 KB');
    expect(formatBytes(1024 * 1024)).toBe('1 MB');
    expect(formatBytes(1024 * 1024 * 1024)).toBe('1 GB');
    expect(formatBytes(1024 * 1024 * 1024 * 1024)).toBe('1 TB');
  });
});
