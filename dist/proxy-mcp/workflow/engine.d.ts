/**
 * Workflow Engine
 * Core state machine logic for workflow execution
 */
import type { WorkflowState, WorkflowPhase, ValidationResult, CanRunSkillResult, PhaseTransitionResult, RollbackHistory } from './types';
/**
 * Start a new workflow
 */
export declare function startWorkflow(workflowId: string, strict?: boolean, metadata?: Record<string, unknown>): WorkflowState;
/**
 * Get current workflow status
 */
export declare function getStatus(): {
    active: boolean;
    state: WorkflowState | null;
    currentPhase: WorkflowPhase | null;
    nextPhase: WorkflowPhase | null;
    progress: string;
};
/**
 * Check if workflow is active
 */
export declare function hasState(): boolean;
/**
 * Check if workflow is in strict mode (Phase 2)
 */
export declare function isStrictMode(): boolean;
/**
 * Check if a skill can run in the current phase
 * Phase 1 (strict=false): advisory only, warnings
 * Phase 2 (strict=true): enforcement, blocking
 */
export declare function canRunSkill(skillName: string): CanRunSkillResult;
/**
 * Validate current phase completion
 */
export declare function validatePhase(): ValidationResult;
/**
 * Transition to next phase
 */
export declare function transitionToNextPhase(): PhaseTransitionResult;
/**
 * Verify workflow completion
 */
export declare function verifyCompletion(): ValidationResult;
/**
 * 指定フェーズにロールバック
 * Phase 3: Rollback to specified phase
 */
export declare function rollbackToPhase(targetPhaseId: string, reason?: string): RollbackHistory;
