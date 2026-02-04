/**
 * Schedule Runner - P18
 *
 * Executes scheduled ops jobs (daily/weekly reports, digest)
 */
import { ScheduleConfig, JobConfig, JobName, JobResult, RunOnceResult } from './types';
/**
 * Load schedule configuration
 *
 * Environment variable overrides:
 * - OPS_SCHEDULE_ENABLED=true: Override global enabled flag
 */
export declare function loadScheduleConfig(): ScheduleConfig | null;
/**
 * Check if current time matches job schedule
 */
export declare function shouldRunJob(jobConfig: JobConfig, now: Date, _timezone: string): boolean;
/**
 * Apply redaction to content
 */
export declare function redactContent(content: string, patterns: string[], placeholder: string): string;
/**
 * Execute a single job
 */
export declare function executeJob(jobName: JobName, config: ScheduleConfig): Promise<JobResult>;
/**
 * Run once: check and execute all due jobs
 */
export declare function runOnce(now?: Date): Promise<RunOnceResult>;
/**
 * Run loop: continuously check for due jobs
 */
export declare function runLoop(intervalMs?: number, signal?: AbortSignal): Promise<void>;
