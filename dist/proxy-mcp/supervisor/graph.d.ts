/**
 * Supervisor Graph - M6
 *
 * State machine for supervised execution
 *
 * Graph flow:
 * ingest → route → plan → (approval?) → execute_safe → finalize
 */
import { SupervisorOptions, SupervisorResult } from './types';
/**
 * Run the supervisor state machine
 */
export declare function runSupervisor(input: string, options?: SupervisorOptions): Promise<SupervisorResult>;
/**
 * Resume a paused supervisor run
 */
export declare function resumeSupervisor(runId: string, approvalIssueId?: number, options?: SupervisorOptions): Promise<SupervisorResult>;
/**
 * Create supervisor graph (simplified - for compatibility)
 */
export declare function createSupervisorGraph(options?: SupervisorOptions): {
    invoke: (input: string) => Promise<SupervisorResult>;
};
