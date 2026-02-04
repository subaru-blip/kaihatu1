/**
 * Internal MCP Client - Communicates with internal MCP servers via stdio
 *
 * M4: Minimal implementation for chrome/puppeteer integration
 */
import { InternalMcpDefinition } from '../router/types';
interface McpClientOptions {
    timeout?: number;
}
/**
 * MCP Client for stdio transport
 */
export declare class McpClient {
    private definition;
    private process;
    private requestId;
    private pendingRequests;
    private buffer;
    private options;
    constructor(definition: InternalMcpDefinition, options?: McpClientOptions);
    /**
     * Get client for named MCP
     */
    static forMcp(name: string, options?: McpClientOptions): McpClient | null;
    /**
     * Check if MCP is available (enabled)
     */
    isAvailable(): boolean;
    /**
     * Start the MCP server process
     */
    start(): Promise<void>;
    /**
     * Stop the MCP server process
     */
    stop(): void;
    /**
     * Call a tool on the MCP server
     */
    callTool(name: string, args?: Record<string, unknown>): Promise<unknown>;
    /**
     * List available tools
     */
    listTools(): Promise<unknown>;
    /**
     * Send JSON-RPC request and wait for response
     */
    private sendRequest;
    /**
     * Handle incoming data from the MCP server
     */
    private handleData;
    /**
     * Handle JSON-RPC response
     */
    private handleResponse;
    /**
     * Cleanup resources
     */
    private cleanup;
}
/**
 * Get or create client for named MCP
 */
export declare function getClient(name: string): McpClient | null;
/**
 * Stop all clients
 */
export declare function stopAllClients(): void;
export {};
