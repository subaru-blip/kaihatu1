/**
 * Workflow State Store
 * Handles .workflow_state.json persistence with UTF-8 safety
 */
import type { WorkflowState } from './types';
/**
 * Set custom state directory (for testing)
 */
export declare function setStateDir(dir: string): void;
/**
 * Reset state directory to default (for testing cleanup)
 */
export declare function resetStateDir(): void;
/**
 * Load workflow state from .workflow_state.json
 * Returns null if file doesn't exist
 */
export declare function loadState(): WorkflowState | null;
/**
 * Save workflow state to .workflow_state.json (atomic write)
 */
export declare function saveState(state: WorkflowState): void;
/**
 * Clear workflow state (delete .workflow_state.json)
 * Note: Temp files are not cleaned up here to avoid race conditions in parallel tests.
 * They will be cleaned up automatically by the OS or can be removed manually.
 */
export declare function clearState(): void;
/**
 * Check if workflow state exists
 */
export declare function hasState(): boolean;
