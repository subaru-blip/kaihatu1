/**
 * Rollout Logic for Canary Deployments
 *
 * Deterministic canary selection based on runId + mcpName hash
 */
import { RolloutConfig } from './overlay';
/**
 * Check if an MCP is enabled for a given runId based on rollout config
 *
 * @param mcpName - Name of the internal MCP
 * @param runId - Run ID for deterministic canary selection
 * @returns true if the MCP should be enabled for this runId
 */
export declare function isRolloutEnabled(mcpName: string, runId: string): boolean;
/**
 * Deterministic canary selection
 *
 * Uses sha256 hash of runId:mcpName to generate a bucket (0-99)
 * Returns true if bucket < canaryPercent
 */
export declare function isInCanary(mcpName: string, runId: string, rollout: RolloutConfig): boolean;
/**
 * Calculate deterministic bucket (0-99) from mcpName and runId
 */
export declare function calculateBucket(mcpName: string, runId: string): number;
/**
 * Get rollout status summary for all MCPs
 */
export declare function getRolloutSummary(): Record<string, {
    mode: string;
    percent?: number;
}>;
/**
 * Format rollout status for display
 */
export declare function formatRolloutStatus(mcpName: string): string;
