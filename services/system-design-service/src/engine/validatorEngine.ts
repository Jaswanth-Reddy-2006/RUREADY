// ═══════════════════════════════════════════════════════════════
// RU Ready? — Deterministic Architecture Validation Engine
// Graph traversal and rule verification for System Design Canvas
// ═══════════════════════════════════════════════════════════════

export interface CanvasNode {
  id: string;
  type?: string;
  position?: { x: number; y: number };
  data: {
    label: string;
    category: 'TRAFFIC' | 'COMPUTE' | 'STORAGE' | 'MESSAGING' | 'RELIABILITY' | 'OBSERVABILITY';
    subType: string;
    description?: string;
    config?: {
      instances?: number;
      engine?: string;
      replication?: number;
      cachePolicy?: string;
      isClustered?: boolean;
      hasRateLimiting?: boolean;
      hasCircuitBreaker?: boolean;
      [key: string]: any;
    };
  };
}

export interface CanvasEdge {
  id: string;
  source: string;
  target: string;
  data?: {
    protocol?: 'HTTP_REST' | 'GRPC' | 'WEBSOCKET' | 'TCP_UDP' | 'KAFKA_STREAM' | 'DB_CONNECTION' | 'ASYNC_QUEUE';
    label?: string;
    isAsync?: boolean;
  };
}

export interface CanvasGraph {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
}

export interface ValidationIssue {
  id: string;
  severity: 'ERROR' | 'WARNING' | 'INFO';
  category: 'SPOF' | 'BOTTLENECK' | 'SECURITY' | 'RELIABILITY' | 'SCALABILITY' | 'ORPHAN';
  nodeIds: string[];
  title: string;
  message: string;
  recommendation: string;
}

export interface ValidationReport {
  score: number; // 0 - 100
  status: 'EXCELLENT' | 'GOOD' | 'NEEDS_IMPROVEMENT' | 'CRITICAL_ISSUES';
  totalNodes: number;
  totalEdges: number;
  issues: ValidationIssue[];
  spofCount: number;
  bottleneckCount: number;
  securityCount: number;
  passedChecks: string[];
}

export function validateArchitecture(graph: CanvasGraph, peakWriteQps: number = 2500, peakReadQps: number = 10000): ValidationReport {
  const nodes = graph.nodes || [];
  const edges = graph.edges || [];
  const issues: ValidationIssue[] = [];
  const passedChecks: string[] = [];

  if (nodes.length === 0) {
    return {
      score: 0,
      status: 'CRITICAL_ISSUES',
      totalNodes: 0,
      totalEdges: 0,
      issues: [
        {
          id: 'EMPTY_CANVAS',
          severity: 'ERROR',
          category: 'SPOF',
          nodeIds: [],
          title: 'Empty Architecture Canvas',
          message: 'The whiteboard is empty. Add core components to start designing the system.',
          recommendation: 'Drag an ingress component (e.g. Client, Load Balancer) and Compute service to begin.',
        },
      ],
      spofCount: 1,
      bottleneckCount: 0,
      securityCount: 0,
      passedChecks: [],
    };
  }

  // Node maps for graph traversal
  const nodeMap = new Map<string, CanvasNode>(nodes.map((n) => [n.id, n]));
  const outgoingEdges = new Map<string, CanvasEdge[]>();
  const incomingEdges = new Map<string, CanvasEdge[]>();

  nodes.forEach((n) => {
    outgoingEdges.set(n.id, []);
    incomingEdges.set(n.id, []);
  });

  edges.forEach((e) => {
    outgoingEdges.get(e.source)?.push(e);
    incomingEdges.get(e.target)?.push(e);
  });

  // Helper selectors
  const trafficNodes = nodes.filter((n) => n.data.category === 'TRAFFIC');
  const computeNodes = nodes.filter((n) => n.data.category === 'COMPUTE');
  const storageNodes = nodes.filter((n) => n.data.category === 'STORAGE');
  const messagingNodes = nodes.filter((n) => n.data.category === 'MESSAGING');
  const reliabilityNodes = nodes.filter((n) => n.data.category === 'RELIABILITY');
  const observabilityNodes = nodes.filter((n) => n.data.category === 'OBSERVABILITY');

  // Check 1: Ingress Gateway / Load Balancer
  const hasIngress = trafficNodes.some((n) =>
    ['load_balancer', 'api_gateway', 'dns', 'cdn'].includes(n.data.subType)
  );

  if (!hasIngress && nodes.length > 2) {
    issues.push({
      id: 'MISSING_INGRESS_GATEWAY',
      severity: 'WARNING',
      category: 'SPOF',
      nodeIds: trafficNodes.map((n) => n.id),
      title: 'Missing Load Balancer / API Gateway',
      message: 'No traffic distribution layer (Load Balancer or API Gateway) detected before compute nodes.',
      recommendation: 'Add an API Gateway or Load Balancer to distribute client traffic and manage SSL termination.',
    });
  } else if (hasIngress) {
    passedChecks.push('Traffic Ingress & Load Balancing configured');
  }

  // Check 2: Direct Database Exposure (CRITICAL SECURITY)
  edges.forEach((edge) => {
    const sourceNode = nodeMap.get(edge.source);
    const targetNode = nodeMap.get(edge.target);

    if (
      sourceNode &&
      targetNode &&
      (sourceNode.data.subType === 'client_app' || sourceNode.data.subType === 'dns') &&
      targetNode.data.category === 'STORAGE'
    ) {
      issues.push({
        id: `DIRECT_DB_EXPOSURE_${edge.id}`,
        severity: 'ERROR',
        category: 'SECURITY',
        nodeIds: [sourceNode.id, targetNode.id],
        title: 'Direct Database Exposure to Public Client',
        message: `Public client directly connects to '${targetNode.data.label}'. This is a critical security vulnerability.`,
        recommendation: 'Route client requests through an API Gateway and Backend Service layer.',
      });
    }
  });

  // Check 3: Orphan Nodes (Disconnected components)
  nodes.forEach((node) => {
    const incoming = incomingEdges.get(node.id) || [];
    const outgoing = outgoingEdges.get(node.id) || [];

    if (incoming.length === 0 && outgoing.length === 0 && nodes.length > 1) {
      issues.push({
        id: `ORPHAN_NODE_${node.id}`,
        severity: 'WARNING',
        category: 'ORPHAN',
        nodeIds: [node.id],
        title: `Disconnected Component: ${node.data.label}`,
        message: `'${node.data.label}' is isolated with no incoming or outgoing connections.`,
        recommendation: 'Connect this component to the appropriate upstream or downstream services.',
      });
    }
  });

  // Check 4: Database Single Point of Failure (SPOF)
  storageNodes.forEach((dbNode) => {
    if (dbNode.data.subType === 'relational_db') {
      const config = dbNode.data.config || {};
      const hasReplication = (config.replication && config.replication > 1) || config.isClustered;
      
      // Check if a read_replica node is connected
      const connectedReplica = (outgoingEdges.get(dbNode.id) || []).some((e) => {
        const target = nodeMap.get(e.target);
        return target && target.data.subType === 'read_replica';
      }) || (incomingEdges.get(dbNode.id) || []).some((e) => {
        const source = nodeMap.get(e.source);
        return source && source.data.subType === 'read_replica';
      });

      if (!hasReplication && !connectedReplica) {
        issues.push({
          id: `DB_SPOF_${dbNode.id}`,
          severity: 'ERROR',
          category: 'SPOF',
          nodeIds: [dbNode.id],
          title: `Primary Database SPOF: ${dbNode.data.label}`,
          message: `Relational database '${dbNode.data.label}' has no read replicas or failover clustering configured.`,
          recommendation: 'Attach a Read Replica node or configure Multi-AZ replication to ensure high availability.',
        });
      } else {
        passedChecks.push(`Database redundancy verified for ${dbNode.data.label}`);
      }
    }
  });

  // Check 5: Read Heavy Bottleneck (Cache Check)
  const hasCacheLayer =
    storageNodes.some((n) => n.data.subType === 'key_value' || n.data.subType === 'cache') ||
    reliabilityNodes.some((n) => n.data.subType === 'cache') ||
    trafficNodes.some((n) => n.data.subType === 'cdn');

  if (peakReadQps > 5000 && !hasCacheLayer && storageNodes.length > 0) {
    issues.push({
      id: 'MISSING_CACHE_LAYER',
      severity: 'WARNING',
      category: 'BOTTLENECK',
      nodeIds: storageNodes.map((n) => n.id),
      title: 'Missing In-Memory Caching Layer (High Read QPS)',
      message: `System experiences ${peakReadQps.toLocaleString()} peak read QPS, but lacks an in-memory cache (Redis/Memcached or CDN).`,
      recommendation: 'Add a Redis/Key-Value Cache between Application Servers and Database to offload read load.',
    });
  } else if (hasCacheLayer) {
    passedChecks.push('In-Memory Caching / CDN acceleration enabled');
  }

  // Check 6: Write Heavy Bottleneck (Async Message Queue Check)
  const hasMessageQueue = messagingNodes.some((n) =>
    ['kafka', 'rabbitmq', 'pubsub', 'async_queue'].includes(n.data.subType)
  );

  if (peakWriteQps > 2000 && !hasMessageQueue && computeNodes.length > 0 && storageNodes.length > 0) {
    issues.push({
      id: 'UNBUFFERED_HIGH_WRITES',
      severity: 'WARNING',
      category: 'BOTTLENECK',
      nodeIds: computeNodes.map((n) => n.id),
      title: 'Unbuffered Synchronous Writes under Peak Load',
      message: `Direct synchronous writes under ${peakWriteQps.toLocaleString()} peak write QPS can exhaust database connection pools.`,
      recommendation: 'Introduce an asynchronous message broker (Kafka or RabbitMQ) and worker pool to buffer writes.',
    });
  } else if (hasMessageQueue) {
    passedChecks.push('Asynchronous Message Queue / Event Stream buffering active');
  }

  // Check 7: Rate Limiting & DDoS Protection
  const hasRateLimiter =
    trafficNodes.some((n) => n.data.subType === 'rate_limiter' || n.data.config?.hasRateLimiting) ||
    reliabilityNodes.some((n) => n.data.subType === 'rate_limiter');

  if (!hasRateLimiter && nodes.length > 3) {
    issues.push({
      id: 'MISSING_RATE_LIMITER',
      severity: 'INFO',
      category: 'SECURITY',
      nodeIds: trafficNodes.map((n) => n.id),
      title: 'Rate Limiting & Throttling Recommended',
      message: 'No rate limiting component detected. The system may be susceptible to noisy neighbors or DDoS surges.',
      recommendation: 'Add a Token Bucket / Leaky Bucket Rate Limiter at the API Gateway layer.',
    });
  } else if (hasRateLimiter) {
    passedChecks.push('Rate Limiting & Traffic Throttling configured');
  }

  // Check 8: Observability & Monitoring
  if (nodes.length >= 4 && observabilityNodes.length === 0) {
    issues.push({
      id: 'MISSING_OBSERVABILITY',
      severity: 'INFO',
      category: 'RELIABILITY',
      nodeIds: [],
      title: 'Missing Distributed Observability & Monitoring',
      message: 'Multi-tier distributed architecture has no centralized monitoring, log aggregator, or tracing.',
      recommendation: 'Add Prometheus/Grafana or Distributed Tracing to monitor latency (p95/p99) and error rates.',
    });
  } else if (observabilityNodes.length > 0) {
    passedChecks.push('Observability & Distributed Tracing included');
  }

  // Calculate Health Score
  let score = 100;
  let spofCount = 0;
  let bottleneckCount = 0;
  let securityCount = 0;

  issues.forEach((issue) => {
    if (issue.severity === 'ERROR') score -= 20;
    else if (issue.severity === 'WARNING') score -= 10;
    else if (issue.severity === 'INFO') score -= 5;

    if (issue.category === 'SPOF') spofCount++;
    if (issue.category === 'BOTTLENECK') bottleneckCount++;
    if (issue.category === 'SECURITY') securityCount++;
  });

  score = Math.max(10, Math.min(100, score));

  let status: ValidationReport['status'] = 'EXCELLENT';
  if (score < 50 || spofCount > 1 || securityCount > 0) status = 'CRITICAL_ISSUES';
  else if (score < 75) status = 'NEEDS_IMPROVEMENT';
  else if (score < 90) status = 'GOOD';

  return {
    score,
    status,
    totalNodes: nodes.length,
    totalEdges: edges.length,
    issues,
    spofCount,
    bottleneckCount,
    securityCount,
    passedChecks,
  };
}
