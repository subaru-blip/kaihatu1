/**
 * Context Budget Monitor
 *
 * Based on Anthropic's best practice for preventing context exhaustion:
 * "Monitor token usage proactively to avoid context window overflow"
 *
 * Features:
 * - Token estimation per operation type
 * - Cumulative usage tracking
 * - Multi-threshold warnings (60%, 80%, 90%, 95%)
 * - Automatic compaction recommendations
 * - Integration with self-healing coordinator
 *
 * @see https://www.anthropic.com/engineering/claude-code-best-practices
 */
export declare const CONTEXT_LIMITS: {
    readonly claude_3_5_sonnet: 200000;
    readonly claude_3_opus: 200000;
    readonly claude_opus_4_5: 200000;
    readonly default: 200000;
};
export declare const OPERATION_TOKEN_ESTIMATES: {
    readonly file_read_small: 500;
    readonly file_read_medium: 2000;
    readonly file_read_large: 8000;
    readonly file_read_huge: 20000;
    readonly file_write: 200;
    readonly file_edit: 300;
    readonly glob_search: 300;
    readonly grep_search_small: 500;
    readonly grep_search_large: 3000;
    readonly bash_simple: 200;
    readonly bash_medium: 1000;
    readonly bash_large: 5000;
    readonly task_spawn: 1000;
    readonly task_result_small: 2000;
    readonly task_result_large: 10000;
    readonly user_message_avg: 500;
    readonly assistant_response_avg: 1500;
    readonly system_prompt: 5000;
    readonly tool_definition: 100;
    readonly mcp_server_overhead: 200;
};
export declare const BUDGET_THRESHOLDS: {
    readonly info: 0.6;
    readonly warning: 0.8;
    readonly critical: 0.9;
    readonly emergency: 0.95;
};
export type BudgetLevel = 'ok' | 'info' | 'warning' | 'critical' | 'emergency';
export interface ContextBudgetState {
    sessionId: string;
    modelId: string;
    contextLimit: number;
    estimatedUsed: number;
    estimatedRemaining: number;
    usagePercent: number;
    level: BudgetLevel;
    operationCount: number;
    lastUpdated: string;
    history: ContextOperation[];
}
export interface ContextOperation {
    timestamp: string;
    type: keyof typeof OPERATION_TOKEN_ESTIMATES | 'custom';
    estimatedTokens: number;
    description?: string;
}
export interface BudgetWarning {
    level: BudgetLevel;
    message: string;
    recommendations: string[];
    estimatedSavings?: number;
}
/**
 * Initialize a new context budget session
 */
export declare function initContextBudget(sessionId: string, modelId?: string): ContextBudgetState;
/**
 * Record a context-consuming operation
 */
export declare function recordContextUsage(operationType: keyof typeof OPERATION_TOKEN_ESTIMATES | 'custom', customTokens?: number, description?: string): BudgetWarning | null;
/**
 * Estimate tokens from content length
 */
export declare function estimateTokens(content: string): number;
/**
 * Estimate file read tokens based on line count
 */
export declare function estimateFileReadTokens(lineCount: number): number;
/**
 * Get current budget level from usage percentage
 */
export declare function getBudgetLevel(usagePercent: number): BudgetLevel;
/**
 * Check if budget warning should be issued
 */
export declare function checkBudgetWarning(state: ContextBudgetState): BudgetWarning | null;
/**
 * Get current context budget state
 */
export declare function getContextBudget(): ContextBudgetState | null;
/**
 * Get budget summary for display
 */
export declare function getBudgetSummary(): string;
/**
 * Simulate compaction (reduce tracked usage)
 */
export declare function simulateCompaction(reductionPercent?: number): void;
/**
 * Get top context consumers
 */
export declare function getTopConsumers(limit?: number): Array<{
    type: string;
    totalTokens: number;
    count: number;
    avgTokens: number;
}>;
/**
 * Reset session (for testing)
 */
export declare function resetContextBudget(): void;
/**
 * Context-aware operation wrapper
 */
export declare function withContextTracking<T>(operationType: keyof typeof OPERATION_TOKEN_ESTIMATES, operation: () => Promise<T>, description?: string): Promise<{
    result: T;
    warning: BudgetWarning | null;
}>;
export type ContextEventType = 'context_budget_init' | 'context_budget_warning' | 'context_budget_critical' | 'context_budget_emergency' | 'context_budget_compaction' | 'context_operation';
