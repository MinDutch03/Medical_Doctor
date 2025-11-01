// Central API index for aggregating REST handlers in one place.
// This keeps a clean structure similar to an Express router index while
// remaining framework-agnostic (no express import required).

// Client barrel: expose only client-safe helpers
export * from "@/routes/api/client";


