/**
 * Overlay Configuration System
 *
 * Loads and merges MCP configurations from multiple sources:
 * 1. Base: config/proxy-mcp/internal-mcps.json
 * 2. Overlay: TAISUN_INTERNAL_MCPS_OVERLAY_PATH env var
 * 3. Local: config/proxy-mcp/internal-mcps.local.json (fallback)
 *
 * Priority: overlay > local > base
 */
import { InternalMcpDefinition, InternalMcpsConfig, LocalMcpOverride, LocalMcpsConfig } from '../router/types';
/**
 * Rollout configuration for canary deployments
 */
export interface RolloutConfig {
    mode: 'off' | 'canary' | 'full';
    canaryPercent?: number;
    allowlist?: {
        runIds?: string[];
        userIds?: string[];
        toolNames?: string[];
    };
}
/**
 * Extended MCP override with rollout support
 */
export interface McpOverrideWithRollout extends LocalMcpOverride {
    rollout?: RolloutConfig;
}
/**
 * Overlay config structure
 */
export interface OverlayConfig {
    mcps: McpOverrideWithRollout[];
}
/**
 * Load base configuration
 */
export declare function loadBaseConfig(): InternalMcpsConfig;
/**
 * Load overlay configuration from environment-specified path
 */
export declare function loadOverlayConfig(): OverlayConfig | null;
/**
 * Load local configuration (fallback)
 */
export declare function loadLocalConfig(): LocalMcpsConfig | null;
/**
 * Merge configurations with priority: overlay > local > base
 */
export declare function mergeConfigs(base: InternalMcpsConfig, local: LocalMcpsConfig | null, overlay: OverlayConfig | null): InternalMcpDefinition[];
/**
 * Load and merge all configurations
 */
export declare function loadMergedConfig(): InternalMcpDefinition[];
/**
 * Get rollout config for a specific MCP
 */
export declare function getRolloutConfig(mcpName: string): RolloutConfig | null;
/**
 * Get overlay path (for CLI tools)
 */
export declare function getOverlayPath(): string | null;
