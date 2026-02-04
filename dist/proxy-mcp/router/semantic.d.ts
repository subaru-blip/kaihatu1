/**
 * Semantic Router - Find matching MCPs based on meaning similarity
 *
 * Uses a simple TF-IDF-like approach for MVP.
 * Can be replaced with embedding-based similarity later.
 */
import { McpCandidate, InternalMcpDefinition } from './types';
/**
 * Calculate similarity score between query and MCP
 * Uses a combination of:
 * - Tag matching (high weight)
 * - Description token overlap (medium weight)
 * - Name matching (low weight)
 */
export declare function calculateSimilarity(query: string, mcp: InternalMcpDefinition): number;
/**
 * Find matching MCPs based on semantic similarity
 */
export declare function findMatchingMcps(query: string, mcps: InternalMcpDefinition[], threshold: number, topK: number): McpCandidate[];
/**
 * Find best matching MCP
 */
export declare function findBestMatch(query: string, mcps: InternalMcpDefinition[], threshold: number): McpCandidate | null;
/**
 * Normalize MCP description for indexing (future use with embeddings)
 */
export declare function normalizeDescription(description: string): string;
