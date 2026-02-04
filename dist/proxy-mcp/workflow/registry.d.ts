/**
 * Workflow Registry
 * Loads and validates workflow definitions from config/workflows/
 */
import type { WorkflowDefinition } from './types';
/**
 * Set custom workflows directory (for testing)
 */
export declare function setWorkflowsDir(dir: string): void;
/**
 * Reset workflows directory to default (for testing cleanup)
 */
export declare function resetWorkflowsDir(): void;
/**
 * Load all workflow definitions
 */
export declare function loadAllWorkflows(): Map<string, WorkflowDefinition>;
/**
 * Load a specific workflow by ID
 */
export declare function loadWorkflow(workflowId: string): WorkflowDefinition;
export declare function getWorkflow(workflowId: string): WorkflowDefinition;
/**
 * Clear cache (for testing)
 */
export declare function clearCache(): void;
