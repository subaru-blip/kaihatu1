/**
 * Hybrid Router - Combines rule-based and semantic routing
 *
 * Priority:
 * 1. Safety rules (deny/require_human)
 * 2. Semantic matching (find best MCP)
 * 3. Fallback (require_human_or_clarify)
 */
import { RouteResult, RouterConfig, InternalMcpDefinition } from './types';
/**
 * Main routing function
 * Returns routing decision for a given input
 */
export declare function route(input: string, mcps: InternalMcpDefinition[], config?: Partial<RouterConfig>): RouteResult;
/**
 * Quick check if input is safe (no safety rules triggered)
 */
export declare function isSafe(input: string): boolean;
/**
 * Get routing explanation (for debugging/logging)
 */
export declare function explainRoute(input: string, mcps: InternalMcpDefinition[], config?: Partial<RouterConfig>): string;
export * from './types';
export { evaluateSafetyRules, getSafetyCategories, SAFETY_RULES } from './rules';
export { findMatchingMcps, findBestMatch, calculateSimilarity } from './semantic';
