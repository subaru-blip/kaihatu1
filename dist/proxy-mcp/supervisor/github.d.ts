/**
 * GitHub Integration - M6
 *
 * Issue logging and approval management
 * P20 Update: i18n support for Japanese default
 */
import { SupervisorState, ExecutionPlan } from './types';
/**
 * Check if gh CLI is available
 */
export declare function isGhAvailable(): boolean;
/**
 * Get default repository from git remote
 */
export declare function getDefaultRepo(): string | null;
/**
 * Create a RUNLOG issue for tracking the supervisor run
 */
export declare function createRunlogIssue(state: SupervisorState, repo?: string): Promise<number | null>;
/**
 * Create an approval request issue
 */
export declare function createApprovalIssue(state: SupervisorState, plan: ExecutionPlan, repo?: string): Promise<number | null>;
/**
 * Check if an issue has been approved
 */
export declare function checkApproval(issueId: number, repo?: string): Promise<{
    approved: boolean;
    approvedBy?: string;
    rejectedBy?: string;
}>;
/**
 * Add a comment to an issue
 */
export declare function addIssueComment(issueId: number, comment: string, repo?: string): Promise<boolean>;
/**
 * Close an issue
 */
export declare function closeIssue(issueId: number, comment?: string, repo?: string): Promise<boolean>;
