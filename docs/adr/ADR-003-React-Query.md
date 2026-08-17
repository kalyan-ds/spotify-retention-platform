# ADR-003: TanStack Query v5 Data Layer Architecture

## Context & Problem Statement
Data fetching, caching, deduplication, and state synchronization require a declarative client-side cache manager.

## Decision Outcome
**Chosen Strategy**: TanStack Query v5 configured with 60,000ms stale time, automatic retry backoff, and full cache purge (`queryClient.clear()`) on user logout.
