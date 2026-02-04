/**
 * Workflow Type Definitions
 * Phase 1: State Management Only (no strict enforcement)
 * Phase 2: Strict Enforcement Mode
 * Phase 3: Advanced Features (Conditional Branching, Parallel Execution, Rollback)
 */
export interface WorkflowValidation {
    type: 'file_exists' | 'command' | 'json_schema';
    target?: string;
    command?: string;
    schema?: string;
    errorMessage: string;
}
/**
 * 条件判定の種類
 */
export type ConditionType = 'file_content' | 'file_exists' | 'command_output' | 'metadata_value';
/**
 * 条件定義
 */
export interface Condition {
    type: ConditionType;
    source: string;
    pattern?: string;
    expectedValue?: string;
}
/**
 * 条件分岐定義
 */
export interface ConditionalNext {
    condition: Condition;
    branches: Record<string, string>;
    defaultNext?: string;
}
/**
 * 並列フェーズ定義
 */
export interface ParallelNext {
    phases: string[];
    waitStrategy: 'all' | 'any';
    timeoutMs?: number;
}
/**
 * 並列実行状態
 */
export interface ParallelExecutionState {
    parallelGroupId: string;
    startedPhases: string[];
    completedPhases: string[];
    waitStrategy: 'all' | 'any';
    startedAt: string;
    completedAt?: string;
}
/**
 * ロールバック履歴
 */
export interface RollbackHistory {
    rollbackId: string;
    fromPhase: string;
    toPhase: string;
    reason?: string;
    deletedArtifacts: string[];
    timestamp: string;
    performedBy?: string;
}
/**
 * フェーズスナップショット（復元用）
 */
export interface PhaseSnapshot {
    phaseId: string;
    artifacts: Record<string, string>;
    metadata: Record<string, unknown>;
    timestamp: string;
}
export interface WorkflowPhase {
    id: string;
    name: string;
    description?: string;
    allowedSkills?: string[];
    requiredArtifacts?: string[];
    validations?: WorkflowValidation[];
    nextPhase?: string | null;
    conditionalNext?: ConditionalNext;
    parallelNext?: ParallelNext;
    allowRollbackTo?: string[];
    snapshotEnabled?: boolean;
}
export interface WorkflowDefinition {
    id: string;
    name: string;
    version: string;
    description?: string;
    phases: WorkflowPhase[];
}
export interface WorkflowState {
    workflowId: string;
    currentPhase: string;
    completedPhases: string[];
    startedAt: string;
    lastUpdatedAt: string;
    strict: boolean;
    metadata?: Record<string, unknown>;
    parallelExecutions?: ParallelExecutionState[];
    rollbackHistory?: RollbackHistory[];
    snapshots?: PhaseSnapshot[];
    branchHistory?: string[];
}
export interface ValidationResult {
    passed: boolean;
    errors: string[];
    warnings: string[];
}
export interface CanRunSkillResult {
    ok: boolean;
    reason?: string;
    suggestedNext?: string;
}
export interface PhaseTransitionResult {
    success: boolean;
    newPhase?: string;
    errors: string[];
    message: string;
}
