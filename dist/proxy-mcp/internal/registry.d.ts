/**
 * Internal MCP Registry - Manages internal MCP definitions
 *
 * P6 Update: Uses overlay system for production enablement
 * Priority: overlay > local > base
 */
import { InternalMcpDefinition, InternalMcpsConfig, RouterConfig } from '../router/types';
import { RolloutConfig } from './overlay';
/**
 * Load internal MCPs config from file (uses overlay system)
 */
export declare function loadConfig(_configPath?: string): InternalMcpsConfig;
/**
 * Clear cached config (for testing)
 */
export declare function clearCache(): void;
/**
 * Get all registered MCPs
 */
export declare function getAllMcps(): InternalMcpDefinition[];
/**
 * Get enabled MCPs only
 */
export declare function getEnabledMcps(): InternalMcpDefinition[];
/**
 * Get MCP by name
 */
export declare function getMcpByName(name: string): InternalMcpDefinition | undefined;
/**
 * Get MCPs by tag
 */
export declare function getMcpsByTag(tag: string): InternalMcpDefinition[];
/**
 * Get router config
 */
export declare function getRouterConfig(): RouterConfig;
/**
 * Check if an MCP is enabled
 */
export declare function isMcpEnabled(name: string): boolean;
/**
 * Get MCP summary (for Claude context)
 */
export declare function getMcpSummary(): string;
/**
 * Check if an MCP is enabled for a specific runId (considers rollout)
 */
export declare function isMcpEnabledForRun(name: string, runId: string): boolean;
/**
 * Get rollout status for all MCPs
 */
export declare function getRolloutStatus(): Array<{
    name: string;
    enabled: boolean;
    rollout: string;
    rolloutConfig: RolloutConfig | null;
}>;
/**
 * Get rollout summary for system_health
 */
export declare function getRolloutSummary(): {
    total: number;
    enabled: number;
    canary: number;
    full: number;
    off: number;
    overlayActive: boolean;
    mcps: Array<{
        name: string;
        mode: 'off' | 'canary' | 'full';
        canaryPercent?: number;
    }>;
};
