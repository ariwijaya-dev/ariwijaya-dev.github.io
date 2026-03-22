---
title: 'Kubernetes Operator for Custom Resources'
description: 'Developed a Kubernetes operator using Kubebuilder and controller-runtime to manage custom resources and automate operational workflows.'
publishDate: 2024-10-22
tags: [Go, Kubernetes, Operator, CRD]
featured: true
metrics:
  latency: 'Reconciliation: 500ms avg'
  throughput: '1000+ CRs managed'
  availability: '99.95%'
  scale: '50+ clusters'
---

## The Problem

Our platform team was spending hours on repetitive operational tasks:

- Manual certificate rotation for TLS endpoints
- Manual scaling decisions based on metrics
- Inconsistent deployment configurations across environments
- No automated rollback capabilities

We needed a way to codify operational knowledge and let Kubernetes manage our custom workloads.

## Architecture Diagram

The operator implements the control pattern with reconciliation loops:

```mermaid
sequenceDiagram
    participant API as Kubernetes API
    participant Operator as Operator Controller
    participant Cache as Informer Cache
    participant Worker as Worker Queue

    API->>Cache: Watch Events (CRs)
    Cache->>Operator: Enqueue Events
    Operator->>Worker: Process Reconciliation

    loop Reconciliation Loop
        Worker->>API: Get CR State
        Worker->>API: Get Child Resources
        Worker->>Worker: Calculate Desired State
        Worker->>API: Create/Update/Delete Resources
        Worker->>API: Update CR Status
    end

    Note over Operator,Worker: Automatic reconciliation on change
```

## Key Challenges

### Concurrency in Reconciliation

Handling multiple concurrent reconciliation requests for the same resource:

```go
func (r *MyResourceReconciler) Reconcile(ctx context.Context, req ctrl.Request) (ctrl.Result, error) {
  // Use a unique key per resource to prevent concurrent reconciliations
  key := req.NamespacedName.String()

  // Check if already reconciling
  if !r.semaphore.TryAcquire(key) {
    return ctrl.Result{RequeueAfter: time.Second * 5}, nil
  }
  defer r.semaphore.Release(key)

  // Fetch the resource
  resource := &mygroupv1.MyResource{}
  if err := r.Get(ctx, req.NamespacedName, resource); err != nil {
    return ctrl.Result{}, client.IgnoreNotFound(err)
  }

  // Reconcile logic here
  return r.reconcile(ctx, resource)
}
```

### Scaling with Work Queues

Implementing rate limiting and exponential backoff for failed reconciliations:

- **Rate Limiting**: Max 10 reconciliations per second per resource
- **Exponential Backoff**: 1s → 2s → 4s → 8s → max 1 minute
- **Fast Requeue**: For transient errors (network timeouts)
- **Slow Requeue**: For persistent errors requiring manual intervention

## Performance Metrics

The operator successfully manages production workloads:

| Metric | Value |
|--------|-------|
| Reconciliation Time | p50: 200ms, p99: 2s |
| Memory per Replica | 50MB RSS |
| CPU per Replica | 0.1 cores (idle), 0.5 cores (peak) |
| Uptime | 99.95% (planned maintenance excluded) |

## Operational Benefits

**Time Saved**: Automated 15+ operational tasks, saving ~20 hours/week

**Consistency**: All deployments follow the same codified patterns

**Self-Healing**: Automatic recovery from common failures without human intervention

**GitOps Ready**: Full integration with ArgoCD for declarative cluster management

The operator framework now serves as the foundation for all our custom Kubernetes controllers, reducing development time for new operators by 60%.
