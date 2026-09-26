// ═══════════════════════════════════════════════════════════════
// RU Ready? — System Design Problem Bank
// Production-grade interview problems covering SDE-2 to Staff level
// ═══════════════════════════════════════════════════════════════

export interface SystemDesignProblemDefinition {
  id: string;
  slug: string;
  title: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  category: 'WEB_SCALE' | 'REAL_TIME' | 'STORAGE' | 'HIGH_THROUGHPUT' | 'INFRASTRUCTURE' | 'FINTECH';
  summary: string;
  description: string;
  functionalRequirements: string[];
  nonFunctionalRequirements: string[];
  trafficDefaults: {
    dau: number;
    readsPerUserPerDay: number;
    writesPerUserPerDay: number;
    avgReadPayloadBytes: number;
    avgWritePayloadBytes: number;
    peakMultiplier: number;
    retentionYears: number;
    replicationFactor: number;
  };
  suggestedComponents: string[];
  stagesGuidance: {
    stage1Requirements: string[];
    stage2Capacity: string[];
    stage3HighLevel: string[];
    stage4DeepDive: string[];
    stage5Scalability: string[];
    stage6TradeOffs: string[];
  };
  referenceArchitecture: {
    nodes: any[];
    edges: any[];
    explanation: string;
  };
}

export const SYSTEM_DESIGN_PROBLEMS: SystemDesignProblemDefinition[] = [
  {
    id: 'sd_url_shortener',
    slug: 'url-shortener',
    title: 'Design a URL Shortener (TinyURL)',
    difficulty: 'EASY',
    category: 'WEB_SCALE',
    summary: 'Design a high-scale service like TinyURL or Bitly that generates short aliases for long URLs with sub-10ms redirection.',
    description: `Design a scalable URL shortening service capable of creating custom or randomized short aliases for original URLs, redirecting users with minimal latency, expiring links, and tracking access analytics.`,
    functionalRequirements: [
      'Given a long URL, generate a unique, short alias (e.g., 7-character Base62 string).',
      'When a user accesses the short URL, quickly redirect them to the original URL (301 or 302 redirect).',
      'Users can optionally specify a custom alias or expiration time.',
      'Basic telemetry: click counts and geographical access stats.',
    ],
    nonFunctionalRequirements: [
      'High Availability (99.99% uptime): Redirects must never fail.',
      'Ultra-low Latency: Redirection time < 15ms (p99).',
      'Read-Heavy Workload: 100:1 Read to Write ratio.',
      'Unpredictable short URL strings (non-sequential to prevent enumeration attacks).',
    ],
    trafficDefaults: {
      dau: 20_000_000,
      readsPerUserPerDay: 50,
      writesPerUserPerDay: 0.5,
      avgReadPayloadBytes: 512,
      avgWritePayloadBytes: 1024,
      peakMultiplier: 2.5,
      retentionYears: 5,
      replicationFactor: 3,
    },
    suggestedComponents: [
      'client_app',
      'dns',
      'cdn',
      'load_balancer',
      'api_gateway',
      'rate_limiter',
      'web_server',
      'key_value',
      'relational_db',
      'read_replica',
      'kafka',
      'worker',
    ],
    stagesGuidance: {
      stage1Requirements: [
        'Clarify character length (7 chars Base62 = 62^7 = ~3.5 Trillion combinations).',
        'Clarify 301 (Permanent Redirect - browser cached) vs 302 (Temporary Redirect - allows server tracking).',
        'Determine link expiration policies and collision handling.',
      ],
      stage2Capacity: [
        'Estimate write QPS (~115 writes/s) and read QPS (~11,574 reads/s).',
        'Calculate 5-year storage (~18 TB without replication, ~54 TB with 3x replica).',
        'Calculate Cache memory for top 20% URLs (80/20 rule) in Redis.',
      ],
      stage3HighLevel: [
        'Diagram Client -> CDN -> Load Balancer -> Web App Cluster -> Redis Cache -> SQL/NoSQL Database.',
        'Include an Asynchronous Analytics Pipeline via Kafka and ClickHouse/Worker.',
      ],
      stage4DeepDive: [
        'Compare Hash generation approaches: MD5/SHA-256 + Base62 vs Key Generation Service (KGS) / Pre-generated Token Range (Zookeeper).',
        'Explain Redis Cache eviction policy (LRU).',
      ],
      stage5Scalability: [
        'Discuss database sharding by Hash of short URL vs range-based sharding.',
        'Address database master-replica failover and cache stampede prevention (mutex/probabilistic early expiration).',
      ],
      stage6TradeOffs: [
        'CAP Theorem: AP (High Availability with eventual consistency for analytics) vs CP for URL collision prevention.',
        'SQL (Postgres/MySQL with B-tree index) vs NoSQL (DynamoDB/Cassandra) performance and maintenance trade-offs.',
      ],
    },
    referenceArchitecture: {
      nodes: [
        { id: '1', type: 'archNode', position: { x: 50, y: 180 }, data: { label: 'Web / Mobile Client', category: 'TRAFFIC', subType: 'client_app' } },
        { id: '2', type: 'archNode', position: { x: 240, y: 180 }, data: { label: 'Cloudflare CDN / DNS', category: 'TRAFFIC', subType: 'cdn' } },
        { id: '3', type: 'archNode', position: { x: 440, y: 180 }, data: { label: 'Nginx Load Balancer', category: 'TRAFFIC', subType: 'load_balancer' } },
        { id: '4', type: 'archNode', position: { x: 640, y: 180 }, data: { label: 'URL Shortener API Cluster', category: 'COMPUTE', subType: 'web_server' } },
        { id: '5', type: 'archNode', position: { x: 860, y: 80 }, data: { label: 'Redis Cache Cluster (LRU)', category: 'RELIABILITY', subType: 'cache' } },
        { id: '6', type: 'archNode', position: { x: 860, y: 260 }, data: { label: 'Primary DB (PostgreSQL)', category: 'STORAGE', subType: 'relational_db' } },
        { id: '7', type: 'archNode', position: { x: 1080, y: 260 }, data: { label: 'Read Replicas (Multi-AZ)', category: 'RELIABILITY', subType: 'read_replica' } },
        { id: '8', type: 'archNode', position: { x: 640, y: 340 }, data: { label: 'Kafka Telemetry Queue', category: 'MESSAGING', subType: 'kafka' } },
        { id: '9', type: 'archNode', position: { x: 860, y: 380 }, data: { label: 'Analytics Clickhouse Worker', category: 'COMPUTE', subType: 'worker' } },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2', data: { protocol: 'HTTP_REST' } },
        { id: 'e2-3', source: '2', target: '3', data: { protocol: 'HTTP_REST' } },
        { id: 'e3-4', source: '3', target: '4', data: { protocol: 'HTTP_REST' } },
        { id: 'e4-5', source: '4', target: '5', data: { protocol: 'TCP_UDP' } },
        { id: 'e4-6', source: '4', target: '6', data: { protocol: 'DB_CONNECTION' } },
        { id: 'e6-7', source: '6', target: '7', data: { protocol: 'DB_CONNECTION' } },
        { id: 'e4-8', source: '4', target: '8', data: { protocol: 'KAFKA_STREAM' } },
        { id: 'e8-9', source: '8', target: '9', data: { protocol: 'ASYNC_QUEUE' } },
      ],
      explanation: 'Clients hit Cloudflare CDN for edge-cached hot redirects. Cache misses hit the Load Balancer and API cluster. API queries Redis LRU cluster before falling back to PostgreSQL read replicas. Clicks and telemetry are pushed asynchronously to Kafka for batch analytics ingestion.',
    },
  },
  {
    id: 'sd_realtime_chat',
    slug: 'realtime-chat',
    title: 'Design a Real-Time Chat System (Slack / Discord)',
    difficulty: 'MEDIUM',
    category: 'REAL_TIME',
    summary: 'Architect a low-latency 1v1 and group messaging system handling millions of concurrent WebSocket connections, presence, and chat history.',
    description: `Design a scalable real-time messaging platform supporting instant 1v1 direct messages, large group channels (up to 100,000 members), user presence (online/away/offline), message delivery receipts, and searchable message history.`,
    functionalRequirements: [
      'Real-time 1v1 direct messaging with sub-50ms delivery latency.',
      'Group channels with up to 100,000 members and real-time broadcasting.',
      'User online/offline status presence tracker.',
      'Persistent chat history with cursor-based pagination and search.',
      'Push notifications for offline users.',
    ],
    nonFunctionalRequirements: [
      'Ultra-low Latency: Message delivery < 50ms end-to-end.',
      'High Concurrency: 10 Million simultaneous active WebSocket connections.',
      'Message Reliability & Ordering: Zero dropped messages; strict chronological ordering within a channel.',
      'Data Durability: Stored messages must survive hardware failures.',
    ],
    trafficDefaults: {
      dau: 50_000_000,
      readsPerUserPerDay: 200,
      writesPerUserPerDay: 40,
      avgReadPayloadBytes: 1024,
      avgWritePayloadBytes: 512,
      peakMultiplier: 3.0,
      retentionYears: 3,
      replicationFactor: 3,
    },
    suggestedComponents: [
      'client_app',
      'load_balancer',
      'api_gateway',
      'websocket_gw',
      'microservice',
      'kafka',
      'pubsub',
      'wide_column',
      'key_value',
      'worker',
      'distributed_tracing',
    ],
    stagesGuidance: {
      stage1Requirements: [
        'Clarify maximum group channel size and fan-out implications.',
        'Clarify media attachments vs pure text message handling.',
        'Establish message sequencing semantics (Snowflake ID or Lamport timestamp).',
      ],
      stage2Capacity: [
        'Calculate WebSocket connection memory (~10M sockets × 10KB = ~100 GB RAM across connection servers).',
        'Estimate message write throughput: (50M × 40) / 86400 = ~23,148 msgs/sec (Peak ~70,000 msgs/sec).',
        'Storage growth for 3 years factoring metadata.',
      ],
      stage3HighLevel: [
        'Separate Stateful WebSocket Gateway cluster from Stateless REST/gRPC API cluster.',
        'Introduce Redis Pub/Sub or Kafka routing mesh to deliver messages across different socket connection nodes.',
        'Use Wide-Column Store (Apache Cassandra or ScyllaDB) partitioned by (channel_id, message_id).',
      ],
      stage4DeepDive: [
        'How to maintain global connection registry (Redis Cluster mapping userId -> gatewayNodeId).',
        'Heartbeat mechanism for presence (5-second keepalive with 30s TTL in Redis).',
        'Fan-out on write for small groups vs fan-out on read for huge public channels.',
      ],
      stage5Scalability: [
        'Graceful WebSocket server restart without dropping all 50,000 connections at once (reconnect jitter).',
        'Handling celebrity channels with 100k listeners via ephemeral broadcast trees.',
      ],
      stage6TradeOffs: [
        'WebSockets vs Server-Sent Events (SSE) vs Long Polling.',
        'Cassandra vs DynamoDB vs PostgreSQL for chat timeline queries.',
      ],
    },
    referenceArchitecture: {
      nodes: [
        { id: '1', type: 'archNode', position: { x: 60, y: 180 }, data: { label: 'Chat Clients (Web/Mobile)', category: 'TRAFFIC', subType: 'client_app' } },
        { id: '2', type: 'archNode', position: { x: 260, y: 180 }, data: { label: 'Layer 4 Load Balancer (HAProxy)', category: 'TRAFFIC', subType: 'load_balancer' } },
        { id: '3', type: 'archNode', position: { x: 480, y: 100 }, data: { label: 'WebSocket Gateway Cluster', category: 'MESSAGING', subType: 'websocket_gw' } },
        { id: '4', type: 'archNode', position: { x: 480, y: 280 }, data: { label: 'REST API Cluster (Auth & History)', category: 'COMPUTE', subType: 'microservice' } },
        { id: '5', type: 'archNode', position: { x: 720, y: 100 }, data: { label: 'Redis Pub/Sub & Presence', category: 'RELIABILITY', subType: 'cache' } },
        { id: '6', type: 'archNode', position: { x: 720, y: 220 }, data: { label: 'Kafka Message Bus', category: 'MESSAGING', subType: 'kafka' } },
        { id: '7', type: 'archNode', position: { x: 940, y: 220 }, data: { label: 'Message Ingestion Worker', category: 'COMPUTE', subType: 'worker' } },
        { id: '8', type: 'archNode', position: { x: 1160, y: 220 }, data: { label: 'Cassandra / ScyllaDB (History)', category: 'STORAGE', subType: 'wide_column' } },
        { id: '9', type: 'archNode', position: { x: 940, y: 340 }, data: { label: 'Push Notification Service', category: 'COMPUTE', subType: 'microservice' } },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2', data: { protocol: 'WEBSOCKET' } },
        { id: 'e2-3', source: '2', target: '3', data: { protocol: 'WEBSOCKET' } },
        { id: 'e2-4', source: '2', target: '4', data: { protocol: 'HTTP_REST' } },
        { id: 'e3-5', source: '3', target: '5', data: { protocol: 'TCP_UDP' } },
        { id: 'e3-6', source: '3', target: '6', data: { protocol: 'KAFKA_STREAM' } },
        { id: 'e6-7', source: '6', target: '7', data: { protocol: 'ASYNC_QUEUE' } },
        { id: 'e7-8', source: '7', target: '8', data: { protocol: 'DB_CONNECTION' } },
        { id: 'e6-9', source: '6', target: '9', data: { protocol: 'ASYNC_QUEUE' } },
        { id: 'e4-8', source: '4', target: '8', data: { protocol: 'DB_CONNECTION' } },
      ],
      explanation: 'Clients establish stateful WebSocket connections through HAProxy to the WebSocket Gateway. Inter-server message routing and presence status are managed via Redis Pub/Sub. Messages are asynchronously streamed to Kafka, persisted into Cassandra, and triggered for push notifications to offline members.',
    },
  },
  {
    id: 'sd_distributed_rate_limiter',
    slug: 'rate-limiter',
    title: 'Design a Distributed Rate Limiter',
    difficulty: 'EASY',
    category: 'INFRASTRUCTURE',
    summary: 'Build a distributed, high-throughput rate limiter middleware to protect internal microservices and public APIs from abusive traffic.',
    description: `Design a low-overhead, resilient rate limiting service supporting multiple rate limiting algorithms (Token Bucket, Sliding Window Log, Sliding Window Counter), multi-tier limits (per IP, per API key, per endpoint), and sub-2ms decision latency.`,
    functionalRequirements: [
      'Inspect incoming HTTP requests and return HTTP 429 (Too Many Requests) when limits are exceeded.',
      'Support flexible rate limit rules (e.g. 100 req/min per user, 5000 req/min per tenant).',
      'Provide standard response headers: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset.',
      'Support white-listing / bypass for internal service tokens.',
    ],
    nonFunctionalRequirements: [
      'Ultra-low Latency: Rate limit check must take < 2ms so it does not degrade API response times.',
      'High Accuracy & Synchronization across multi-region edge gateways.',
      'Fault Tolerance: If the rate limiter service or cache crashes, system should fail open (or fail closed based on config).',
      'Low Memory Footprint: Efficient storage for 100M active tracking keys.',
    ],
    trafficDefaults: {
      dau: 100_000_000,
      readsPerUserPerDay: 50,
      writesPerUserPerDay: 10,
      avgReadPayloadBytes: 256,
      avgWritePayloadBytes: 256,
      peakMultiplier: 3.0,
      retentionYears: 1,
      replicationFactor: 2,
    },
    suggestedComponents: [
      'client_app',
      'load_balancer',
      'api_gateway',
      'rate_limiter',
      'key_value',
      'cache',
      'prometheus_grafana',
    ],
    stagesGuidance: {
      stage1Requirements: [
        'Clarify client identification (IP address, OAuth User ID, API Key).',
        'Discuss hard limit vs soft limit (warning alerts).',
      ],
      stage2Capacity: [
        'Calculate memory for 100M keys: Sliding Window Counter (128 bytes per key) = ~12.8 GB in Redis Cluster.',
        'Compute evaluation QPS: 100k - 500k RPS check volume.',
      ],
      stage3HighLevel: [
        'Compare Centralized Redis cluster vs In-Memory Local Cache with synchronized background gossip/Redis synchronization.',
      ],
      stage4DeepDive: [
        'Deep dive into algorithms: Token Bucket vs Leaky Bucket vs Sliding Window Counter (Lua scripts in Redis to prevent race conditions).',
      ],
      stage5Scalability: [
        'Multi-region synchronization (Local token bucket refills + periodic global sync).',
        'Fail-open policy using Circuit Breakers to prevent bringing down production.',
      ],
      stage6TradeOffs: [
        'Accuracy vs Latency: Atomic Redis Lua script (strict consistency, network hop) vs Local in-process memory batching (loose consistency, zero network hop).',
      ],
    },
    referenceArchitecture: {
      nodes: [
        { id: '1', type: 'archNode', position: { x: 60, y: 180 }, data: { label: 'Public Traffic / API Clients', category: 'TRAFFIC', subType: 'client_app' } },
        { id: '2', type: 'archNode', position: { x: 260, y: 180 }, data: { label: 'Envoy / Kong API Gateway', category: 'TRAFFIC', subType: 'api_gateway' } },
        { id: '3', type: 'archNode', position: { x: 480, y: 180 }, data: { label: 'Rate Limiter Service Filter', category: 'TRAFFIC', subType: 'rate_limiter' } },
        { id: '4', type: 'archNode', position: { x: 700, y: 100 }, data: { label: 'Redis Cluster (Sliding Window)', category: 'RELIABILITY', subType: 'cache' } },
        { id: '5', type: 'archNode', position: { x: 700, y: 260 }, data: { label: 'Core Microservices', category: 'COMPUTE', subType: 'microservice' } },
        { id: '6', type: 'archNode', position: { x: 480, y: 340 }, data: { label: 'Prometheus & Grafana Metrics', category: 'OBSERVABILITY', subType: 'prometheus_grafana' } },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2', data: { protocol: 'HTTP_REST' } },
        { id: 'e2-3', source: '2', target: '3', data: { protocol: 'GRPC' } },
        { id: 'e3-4', source: '3', target: '4', data: { protocol: 'TCP_UDP' } },
        { id: 'e3-5', source: '3', target: '5', data: { protocol: 'GRPC' } },
        { id: 'e3-6', source: '3', target: '6', data: { protocol: 'TCP_UDP' } },
      ],
      explanation: 'API Gateway passes request metadata over gRPC to the Rate Limiter plugin. The plugin runs atomic Redis Lua scripts evaluating sliding window counters. Approved requests proceed to downstream microservices, while rejected requests return 429 with Retry-After headers.',
    },
  },
  {
    id: 'sd_uber_ride_matching',
    slug: 'uber-ride-matching',
    title: 'Design Uber / Lyft Ride Matching & Real-Time Dispatch',
    difficulty: 'HARD',
    category: 'REAL_TIME',
    summary: 'Design a real-time geospatial dispatch system that tracks millions of active drivers and matches rider pickup requests within seconds.',
    description: `Design a high-scale real-time geospatial matching architecture for a ride-sharing service. The platform must continuously ingest GPS telemetry from 5M active drivers (every 4 seconds), efficiently query nearby available drivers within a spatial radius, optimize pricing dynamically (surge), and coordinate ride state transitions.`,
    functionalRequirements: [
      'Drivers transmit GPS coordinates (latitude, longitude, status) every 4 seconds.',
      'Riders request a ride and get matched to the optimal nearby driver in < 3 seconds.',
      'Real-time trip tracking: rider sees driver vehicle moving smoothly on the map.',
      'Dynamic surge pricing calculation based on supply and demand in spatial hex cells.',
      'Complete lifecycle state machine (REQUESTED, MATCHED, PICKUP, IN_PROGRESS, COMPLETED, CANCELLED).',
    ],
    nonFunctionalRequirements: [
      'Geospatial Query Latency: Find top 10 nearest drivers in < 50ms.',
      'High Write Ingestion: Ingest 1.25 Million location updates per second smoothly.',
      'Consistency in Dispatch: Prevent race conditions where two riders match with the same driver.',
      'Fault Tolerance: Zero lost active trip states across server restarts.',
    ],
    trafficDefaults: {
      dau: 40_000_000,
      readsPerUserPerDay: 30,
      writesPerUserPerDay: 15,
      avgReadPayloadBytes: 2048,
      avgWritePayloadBytes: 256,
      peakMultiplier: 2.5,
      retentionYears: 7,
      replicationFactor: 3,
    },
    suggestedComponents: [
      'client_app',
      'load_balancer',
      'websocket_gw',
      'api_gateway',
      'microservice',
      'kafka',
      'key_value',
      'worker',
      'relational_db',
      'distributed_tracing',
    ],
    stagesGuidance: {
      stage1Requirements: [
        'Clarify spatial indexing precision (Uber H3 hexagonal grid vs Google S2 vs QuadTrees/Geohashes).',
        'Clarify matching criteria: ETA vs straight-line distance vs driver rating.',
      ],
      stage2Capacity: [
        'Calculate Driver GPS ingestion: 5M drivers × 1 update / 4s = 1,250,000 writes/second.',
        'Bandwidth: 1.25M × 256 B = 320 MB/s (2.56 Gbps network ingress).',
        'In-memory spatial index memory: 5M driver records × 100 bytes = ~500 MB RAM (easily fits in Redis memory).',
      ],
      stage3HighLevel: [
        'Split into Location Ingestion Pipeline (Kafka -> Flink/Spark -> In-Memory Geospatial Index) and Ride Matching Engine (H3 hexagon queries -> Dijkstra/OSRM routing).',
      ],
      stage4DeepDive: [
        'Atomic driver lock during dispatch proposal (Redis distributed lock with Redlock / TTL).',
        'Spatial indexing with Uber H3 resolution 8 (~460m hex radius).',
      ],
      stage5Scalability: [
        'Geographic partitioning: Shard location clusters and matchers by City/Geohash prefix.',
        'Graceful degradation under heavy rain/surge events (expand search radius dynamically).',
      ],
      stage6TradeOffs: [
        'Immediate first-accept match vs Batch matching (e.g. 5-second Hungarian matching window for global minimum wait time).',
        'Redis Geospatial commands (GEOADD/GEORADIUS) vs Custom In-Memory QuadTree microservice.',
      ],
    },
    referenceArchitecture: {
      nodes: [
        { id: '1', type: 'archNode', position: { x: 50, y: 120 }, data: { label: 'Driver App (GPS Pings)', category: 'TRAFFIC', subType: 'client_app' } },
        { id: '2', type: 'archNode', position: { x: 50, y: 280 }, data: { label: 'Rider App (Requests)', category: 'TRAFFIC', subType: 'client_app' } },
        { id: '3', type: 'archNode', position: { x: 260, y: 120 }, data: { label: 'Location Ingestion Gateway', category: 'MESSAGING', subType: 'websocket_gw' } },
        { id: '4', type: 'archNode', position: { x: 260, y: 280 }, data: { label: 'Dispatch & Booking API Gateway', category: 'TRAFFIC', subType: 'api_gateway' } },
        { id: '5', type: 'archNode', position: { x: 480, y: 120 }, data: { label: 'Kafka GPS Event Stream', category: 'MESSAGING', subType: 'kafka' } },
        { id: '6', type: 'archNode', position: { x: 700, y: 120 }, data: { label: 'Geospatial Index (Redis H3)', category: 'RELIABILITY', subType: 'cache' } },
        { id: '7', type: 'archNode', position: { x: 480, y: 280 }, data: { label: 'Ride Matching Engine', category: 'COMPUTE', subType: 'microservice' } },
        { id: '8', type: 'archNode', position: { x: 700, y: 280 }, data: { label: 'Trip State & Settlement DB', category: 'STORAGE', subType: 'relational_db' } },
        { id: '9', type: 'archNode', position: { x: 920, y: 200 }, data: { label: 'Surge Pricing Stream Engine', category: 'COMPUTE', subType: 'worker' } },
      ],
      edges: [
        { id: 'e1-3', source: '1', target: '3', data: { protocol: 'WEBSOCKET' } },
        { id: 'e2-4', source: '2', target: '4', data: { protocol: 'HTTP_REST' } },
        { id: 'e3-5', source: '3', target: '5', data: { protocol: 'KAFKA_STREAM' } },
        { id: 'e5-6', source: '5', target: '6', data: { protocol: 'ASYNC_QUEUE' } },
        { id: 'e4-7', source: '4', target: '7', data: { protocol: 'GRPC' } },
        { id: 'e7-6', source: '7', target: '6', data: { protocol: 'TCP_UDP' } },
        { id: 'e7-8', source: '7', target: '8', data: { protocol: 'DB_CONNECTION' } },
        { id: 'e5-9', source: '5', target: '9', data: { protocol: 'KAFKA_STREAM' } },
      ],
      explanation: 'Driver GPS streams are ingested via WebSocket to Kafka, updating the Uber H3 geospatial index in Redis. Rider ride requests hit the Ride Matching Engine, which executes proximity searches against Redis H3 hex cells and writes confirmed trip state to PostgreSQL.',
    },
  },
];
