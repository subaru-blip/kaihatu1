/**
 * Circuit Breaker Implementation
 *
 * States:
 * - CLOSED: Normal operation, calls go through
 * - OPEN: Failures exceeded threshold, calls fail fast
 * - HALF_OPEN: Testing if service recovered
 */
export type CircuitState = 'closed' | 'open' | 'half-open';
export interface CircuitBreakerConfig {
    enabled: boolean;
    failureThreshold: number;
    cooldownMs: number;
    halfOpenMaxCalls: number;
    successThreshold: number;
}
export declare const DEFAULT_CIRCUIT_CONFIG: CircuitBreakerConfig;
/**
 * Check if a call is allowed through the circuit breaker
 */
export declare function isCallAllowed(mcpName: string, config?: CircuitBreakerConfig): boolean;
/**
 * Record a successful call
 */
export declare function recordSuccess(mcpName: string, config?: CircuitBreakerConfig): void;
/**
 * Record a failed call
 */
export declare function recordFailure(mcpName: string, config?: CircuitBreakerConfig): void;
/**
 * Get current circuit state
 */
export declare function getCircuitState(mcpName: string): CircuitState;
/**
 * Get all circuit states for monitoring
 */
export declare function getAllCircuitStates(): Map<string, CircuitState>;
/**
 * Get circuit stats summary
 */
export declare function getCircuitSummary(): {
    total: number;
    closed: number;
    open: number;
    halfOpen: number;
};
/**
 * Reset circuit breaker (for testing)
 */
export declare function resetCircuit(mcpName: string): void;
/**
 * Reset all circuits (for testing)
 */
export declare function resetAllCircuits(): void;
