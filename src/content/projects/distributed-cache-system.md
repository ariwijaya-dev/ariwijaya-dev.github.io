---
title: 'Distributed Cache System with gRPC'
description: 'Built a high-performance distributed caching layer using Go, gRPC, and Redis cluster achieving 99.99% availability.'
publishDate: 2024-11-15
tags: [Go, gRPC, Redis, Kubernetes]
featured: true
metrics:
  latency: 'p50: 2ms, p99: 15ms'
  throughput: '100K ops/sec'
  availability: '99.99%'
  scale: '50TB data, 12 regions'
---

## The Problem

Our monolithic application was experiencing severe performance degradation during peak traffic hours. The single-node Redis instance became a bottleneck, causing cache hit ratios to drop below 40% and database load to increase by 300%. We needed a solution that could:

- Scale horizontally across multiple regions
- Maintain sub-20ms latency at p99
- Provide strong consistency guarantees
- Handle 100K+ operations per second

## Architecture Diagram

The solution implements a consistent hashing-based distributed cache with gRPC communication between nodes:

```mermaid
graph TB
    Client[Client Apps]
    LB[Load Balancer]

    subgraph "Cache Layer"
        CG1[Cache Gateway 1]
        CG2[Cache Gateway 2]
        CG3[Cache Gateway 3]
    end

    subgraph "Redis Cluster"
        R1[(Redis Shard 1)]
        R2[(Redis Shard 2)]
        R3[(Redis Shard 3)]
        R4[(Redis Shard 4)]
    end

    Client --> LB
    LB --> CG1
    LB --> CG2
    LB --> CG3

    CG1 --> R1
    CG1 --> R2
    CG2 --> R2
    CG2 --> R3
    CG3 --> R3
    CG3 --> R4

    style CacheGateway fill:#3b82f6
    style RedisShard fill:#10b981
```

## Key Challenges

### Concurrency and Race Conditions

Implementing cache stampede prevention using a single-flight pattern with mutex-based deduplication:

```go
type SingleFlight struct {
  mu    sync.Mutex
  calls map[string]*call
}

type call struct {
  wg  sync.WaitGroup
  val interface{}
  err error
}

func (sf *SingleFlight) Do(key string, fn func() (interface{}, error)) (interface{}, error) {
  sf.mu.Lock()
  if sf.calls == nil {
    sf.calls = make(map[string]*call)
  }

  if c, ok := sf.calls[key]; ok {
    sf.mu.Unlock()
    c.wg.Wait()
    return c.val, c.err
  }

  c := new(call)
  c.wg.Add(1)
  sf.calls[key] = c
  sf.mu.Unlock()

  c.val, c.err = fn()
  c.wg.Done()

  sf.mu.Lock()
  delete(sf.calls, key)
  sf.mu.Unlock()

  return c.val, c.err
}
```

### Scaling with Consistent Hashing

Implemented Ketama consistent hashing to minimize data redistribution when nodes join/leave the cluster:

- 160 virtual nodes per physical node for even distribution
- MD5-based hashing for key distribution
- O(log N) lookup complexity
- Graceful handling of node failures

## Performance Metrics

After deployment, we observed significant improvements:

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Cache Hit Ratio | 38% | 94% | +147% |
| p99 Latency | 180ms | 15ms | -92% |
| Throughput | 12K ops/s | 100K ops/s | +733% |
| DB Load | 100% baseline | 18% | -82% |

The system now handles 50TB of cached data across 12 geographic regions with automatic failover and disaster recovery capabilities.
