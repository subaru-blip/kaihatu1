/**
 * Resilience Module - Timeout, Retry, and Circuit Breaker Integration
 *
 * Provides fault-tolerant execution for internal MCP calls
 */
import { CircuitBreakerConfig } from './circuit-breaker';
/**
 * Timeout configuration
 */
export interface TimeoutConfig {
    spawnMs: number;
    toolCallMs: number;
}
/**
 * Retry configuration
 */
export interface RetryConfig {
    maxAttempts: number;
    backoffMs: number;
    jitter: boolean;
}
/**
 * Full resilience configuration
 */
export interface ResilienceConfig {
    timeout: TimeoutConfig;
    retry: RetryConfig;
    circuit: CircuitBreakerConfig;
}
export declare const DEFAULT_RESILIENCE_CONFIG: ResilienceConfig;
/**
 * Error class for resilience failures
 */
export declare class ResilienceError extends Error {
    readonly type: 'timeout' | 'circuit_open' | 'max_retries' | 'execution';
    readonly mcpName: string;
    readonly attempts: number;
    constructor(message: string, type: 'timeout' | 'circuit_open' | 'max_retries' | 'execution', mcpName: string, attempts?: number);
}
/**
 * Execute a function with timeout
 */
export declare function withTimeout<T>(fn: () => Promise<T>, timeoutMs: number, label?: string): Promise<T>;
/**
 * Execute a function with retry logic
 */
export declare function withRetry<T>(fn: () => Promise<T>, config: RetryConfig, mcpName: string): Promise<T>;
/**
 * Execute an internal MCP call with full resilience (timeout, retry, circuit breaker)
 */
export declare function executeWithResilience<T>(mcpName: string, runId: string, fn: () => Promise<T>, config?: ResilienceConfig): Promise<T>;
/**
 * Get resilience config for a specific MCP (can be overridden in internal-mcps.json)
 */
export declare function getResilienceConfig(mcpConfig: {
    resilience?: Partial<ResilienceConfig>;
} | undefined): ResilienceConfig;
