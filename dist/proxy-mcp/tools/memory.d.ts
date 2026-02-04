/**
 * Memory Tools - Store and retrieve data without cluttering conversation
 *
 * M3 Update: Uses MemoryService with short/long namespace separation
 * and minimal output principle (summary + refId center).
 *
 * Security: Input validation added to prevent DoS and injection attacks.
 * M4 Update: Added content_path support for reading large files safely.
 */
import { ToolResult } from '../types';
import { MemoryNamespace } from '../memory';
/**
 * Add content to memory and return a reference ID
 *
 * Output is minimal: refId + summary + metadata only
 *
 * M4 Update: Supports content_path for reading large files safely
 */
export declare function memoryAdd(content: string | undefined, namespace?: MemoryNamespace, options?: {
    tags?: string[];
    source?: string;
    importance?: number;
    metadata?: Record<string, unknown>;
    contentPath?: string;
}): Promise<ToolResult>;
/**
 * Search memory by ID or keyword
 *
 * Output is minimal by default: summary + refId + score + tags
 * Use includeContent=true to get content preview (still limited)
 */
export declare function memorySearch(query: string, options?: {
    namespace?: MemoryNamespace;
    tags?: string[];
    limit?: number;
    includeContent?: boolean;
}): Promise<ToolResult>;
/**
 * Get memory statistics
 */
export declare function memoryStats(): Promise<ToolResult>;
/**
 * Clear short-term memory (cleanup)
 */
export declare function memoryClearShortTerm(): Promise<ToolResult>;
/**
 * Clear all memory (for testing)
 */
export declare function memoryClearAll(): Promise<ToolResult>;
/**
 * Get full content by ID (bypasses preview truncation)
 *
 * Use for large content like URL bundles that need full data.
 */
export declare function memoryGetContent(id: string): Promise<ToolResult>;
/**
 * Delete a specific memory entry by ID
 */
export declare function memoryDelete(id: string): Promise<ToolResult>;
/**
 * Cleanup expired entries
 */
export declare function memoryCleanup(): Promise<ToolResult>;
