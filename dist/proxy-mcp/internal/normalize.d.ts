/**
 * Normalize - Utility functions for normalizing MCP descriptions
 *
 * Used to create compact, searchable representations of MCPs
 * for semantic routing without exposing full tool definitions to Claude.
 */
import { InternalMcpDefinition } from '../router/types';
/**
 * Normalize text for indexing
 */
export declare function normalizeText(text: string): string;
/**
 * Extract keywords from text
 */
export declare function extractKeywords(text: string, maxKeywords?: number): string[];
/**
 * Create a compact index entry for an MCP
 */
export interface McpIndexEntry {
    name: string;
    keywords: string[];
    tags: string[];
    shortDescription: string;
}
/**
 * Create index entry for an MCP
 */
export declare function createIndexEntry(mcp: InternalMcpDefinition): McpIndexEntry;
/**
 * Create index for all MCPs
 */
export declare function createMcpIndex(mcps: InternalMcpDefinition[]): McpIndexEntry[];
/**
 * Format MCP for minimal context exposure
 */
export declare function formatMinimalMcp(mcp: InternalMcpDefinition): string;
/**
 * Format multiple MCPs for minimal context exposure
 */
export declare function formatMinimalMcpList(mcps: InternalMcpDefinition[]): string;
