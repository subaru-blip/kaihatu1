/**
 * Rules Router - Pattern-based routing with safety rules
 *
 * Priority order:
 * 1. Deny rules (highest priority - block immediately)
 * 2. Require human rules (dangerous operations)
 * 3. Allow rules (explicitly permitted)
 */
import { RouteResult, SafetyRule } from './types';
/**
 * Safety rules for dangerous operations
 * These always take precedence over semantic routing
 */
declare const SAFETY_RULES: SafetyRule[];
/**
 * Evaluate safety rules against input
 * Returns the most restrictive matching rule
 */
export declare function evaluateSafetyRules(input: string): RouteResult | null;
/**
 * Check if a specific MCP operation is dangerous
 */
export declare function isDangerousOperation(mcpName: string, operation: string, dangerousOps: string[]): boolean;
/**
 * Get all safety rule categories
 */
export declare function getSafetyCategories(): string[];
/**
 * Export safety rules for testing
 */
export { SAFETY_RULES };
