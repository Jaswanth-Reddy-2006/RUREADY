import { describe, it, expect } from 'vitest';
import { validateArchitecture, CanvasGraph } from '../src/engine/validatorEngine.js';

describe('Architecture Validation Engine', () => {
  it('flags empty canvas with critical error', () => {
    const report = validateArchitecture({ nodes: [], edges: [] });
    expect(report.score).toBe(0);
    expect(report.status).toBe('CRITICAL_ISSUES');
    expect(report.issues.length).toBeGreaterThan(0);
  });

  it('detects direct database exposure vulnerability', () => {
    const graph: CanvasGraph = {
      nodes: [
        {
          id: 'client_1',
          type: 'archNode',
          data: { label: 'Web Browser Client', category: 'TRAFFIC', subType: 'client_app' },
        },
        {
          id: 'db_1',
          type: 'archNode',
          data: { label: 'User Data DB', category: 'STORAGE', subType: 'relational_db' },
        },
      ],
      edges: [
        {
          id: 'e1',
          source: 'client_1',
          target: 'db_1',
          data: { protocol: 'HTTP_REST' },
        },
      ],
    };

    const report = validateArchitecture(graph);
    expect(report.securityCount).toBeGreaterThan(0);
    expect(report.issues.some((i) => i.category === 'SECURITY')).toBe(true);
  });

  it('detects database SPOF when no replicas exist', () => {
    const graph: CanvasGraph = {
      nodes: [
        {
          id: 'lb_1',
          type: 'archNode',
          data: { label: 'Load Balancer', category: 'TRAFFIC', subType: 'load_balancer' },
        },
        {
          id: 'app_1',
          type: 'archNode',
          data: { label: 'App Server', category: 'COMPUTE', subType: 'web_server' },
        },
        {
          id: 'db_1',
          type: 'archNode',
          data: { label: 'Postgres DB', category: 'STORAGE', subType: 'relational_db', config: { replication: 1 } },
        },
      ],
      edges: [
        { id: 'e1', source: 'lb_1', target: 'app_1', data: { protocol: 'HTTP_REST' } },
        { id: 'e2', source: 'app_1', target: 'db_1', data: { protocol: 'DB_CONNECTION' } },
      ],
    };

    const report = validateArchitecture(graph);
    expect(report.spofCount).toBeGreaterThan(0);
    expect(report.issues.some((i) => i.id.startsWith('DB_SPOF'))).toBe(true);
  });

  it('passes robust architecture with LB, Cache, Microservices, and DB Replicas', () => {
    const graph: CanvasGraph = {
      nodes: [
        {
          id: 'lb_1',
          type: 'archNode',
          data: { label: 'API Gateway', category: 'TRAFFIC', subType: 'api_gateway', config: { hasRateLimiting: true } },
        },
        {
          id: 'app_1',
          type: 'archNode',
          data: { label: 'User Microservice', category: 'COMPUTE', subType: 'microservice' },
        },
        {
          id: 'cache_1',
          type: 'archNode',
          data: { label: 'Redis Cluster', category: 'RELIABILITY', subType: 'cache' },
        },
        {
          id: 'db_1',
          type: 'archNode',
          data: { label: 'Postgres Primary', category: 'STORAGE', subType: 'relational_db', config: { replication: 3 } },
        },
        {
          id: 'obs_1',
          type: 'archNode',
          data: { label: 'Prometheus & Grafana', category: 'OBSERVABILITY', subType: 'prometheus_grafana' },
        },
      ],
      edges: [
        { id: 'e1', source: 'lb_1', target: 'app_1', data: { protocol: 'HTTP_REST' } },
        { id: 'e2', source: 'app_1', target: 'cache_1', data: { protocol: 'TCP_UDP' } },
        { id: 'e3', source: 'app_1', target: 'db_1', data: { protocol: 'DB_CONNECTION' } },
      ],
    };

    const report = validateArchitecture(graph, 1000, 4000);
    expect(report.score).toBeGreaterThanOrEqual(90);
    expect(report.spofCount).toBe(0);
    expect(report.securityCount).toBe(0);
  });
});
