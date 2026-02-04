/**
 * Schedule State Manager - P18
 *
 * Persists job state to prevent duplicate executions after restarts
 */
import { JobState, JobName } from './types';
/**
 * Schedule State Manager
 */
export declare class ScheduleStateManager {
    private stateDir;
    private statePath;
    private state;
    constructor(stateDir: string);
    /**
     * Load state from disk
     */
    private load;
    /**
     * Save state to disk
     */
    private save;
    /**
     * Get job state
     */
    getJobState(jobName: JobName): JobState;
    /**
     * Get all job states
     */
    getAllJobStates(): Record<JobName, JobState>;
    /**
     * Record successful job run
     */
    recordSuccess(jobName: JobName): void;
    /**
     * Record failed job run
     */
    recordFailure(jobName: JobName, error: string): void;
    /**
     * Record skipped job run
     */
    recordSkipped(jobName: JobName): void;
    /**
     * Check if job was already run in the current period
     */
    wasRunInCurrentPeriod(jobName: JobName, cadence: 'daily' | 'weekly', now: Date): boolean;
    /**
     * Reset state (for testing)
     */
    reset(): void;
    /**
     * Get state file path (for testing/debugging)
     */
    getStatePath(): string;
}
