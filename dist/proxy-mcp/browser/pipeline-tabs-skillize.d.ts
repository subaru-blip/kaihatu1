/**
 * Pipeline: web_skillize_from_tabs - P7.3
 *
 * One-command pipeline: list_tabs_urls(CDP) -> normalize URL bundle -> batch skillize
 *
 * Features:
 * - Minimal output: summary + refId only (no URL lists in response)
 * - Dry-run default: confirmWrite=false
 * - CDP connection check with human-friendly error
 * - inputRefId option: skip tabs collection, use existing URL bundle
 * - All intermediate data stored in memory with refIds
 *
 * Output: pipeline-run record containing all intermediate refIds
 */
import { MemoryNamespace } from '../memory/types';
/** Pipeline configuration */
export interface PipelineTabsSkillizeConfig {
    /** Skip tabs collection, use existing URL bundle refId */
    inputRefId?: string | null;
    /** Include only these domains */
    includeDomains?: string[] | null;
    /** Exclude these domains */
    excludeDomains?: string[] | null;
    /** Exclude URLs matching these patterns */
    excludeUrlPatterns?: string[] | null;
    /** Maximum URLs to process (default: 200) */
    maxUrls?: number;
    /** Per-domain limit (default: 50) */
    perDomainLimit?: number;
    /** Remove tracking parameters (default: true) */
    stripTracking?: boolean;
    /** Maximum URLs to fetch/skillize (default: 20) */
    maxFetch?: number;
    /** Concurrency for skillize (default: 3, but sequential for safety) */
    concurrency?: number;
    /** Rate limit between URLs in ms (default: 1000) */
    rateLimitMs?: number;
    /** Confirm write to disk (default: false = dry-run) */
    confirmWrite?: boolean;
    /** Memory namespace (default: 'long-term') */
    namespace?: MemoryNamespace;
}
/** Default configuration */
export declare const DEFAULT_PIPELINE_CONFIG: Required<Omit<PipelineTabsSkillizeConfig, 'inputRefId' | 'includeDomains' | 'excludeDomains' | 'excludeUrlPatterns'>> & {
    inputRefId: string | null;
    includeDomains: string[] | null;
    excludeDomains: string[] | null;
    excludeUrlPatterns: string[] | null;
};
/** Pipeline run record - stored in memory */
export interface PipelineRunRecord {
    pipelineId: string;
    startedAt: string;
    completedAt?: string;
    status: 'running' | 'completed' | 'failed';
    config: typeof DEFAULT_PIPELINE_CONFIG;
    stages: {
        tabs?: {
            refId: string;
            totalTabs: number;
            skipped?: boolean;
        };
        normalize?: {
            inputRefId: string;
            outputRefId: string;
            inputCount: number;
            outputCount: number;
            duplicatesRemoved: number;
        };
        skillize?: {
            inputRefId: string;
            outputRefId: string;
            processedCount: number;
            successCount: number;
            failureCount: number;
            dryRun: boolean;
        };
    };
    error?: string;
}
/** Pipeline result */
export interface PipelineResult {
    success: boolean;
    error?: string;
    refId?: string;
    summary?: string;
    requireHuman?: boolean;
    humanInstruction?: string;
}
/**
 * Run the full pipeline: tabs -> normalize -> skillize
 *
 * @param config Pipeline configuration
 * @returns Pipeline result with summary + refId
 */
export declare function runPipelineTabsSkillize(config?: Partial<PipelineTabsSkillizeConfig>): Promise<PipelineResult>;
