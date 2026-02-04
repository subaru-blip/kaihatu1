/**
 * CDP Session Manager
 *
 * Manages Playwright CDP connection to existing Chrome instance.
 * Connection is cached for reuse across operations.
 */
import { CDPConfig, CDPConnection } from './types';
/**
 * Check if CDP port is available
 */
export declare function isCDPPortOpen(port?: number): Promise<boolean>;
/**
 * Connect to existing Chrome via CDP
 */
export declare function connectCDP(config?: Partial<CDPConfig>): Promise<CDPConnection>;
/**
 * Get cached connection if available
 */
export declare function getCachedConnection(): CDPConnection | null;
/**
 * Disconnect from Chrome (does NOT close Chrome, just releases connection)
 */
export declare function disconnectCDP(): Promise<void>;
/**
 * Clear cached connection (for testing)
 */
export declare function clearConnectionCache(): void;
