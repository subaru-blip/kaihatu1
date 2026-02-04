/**
 * URL Bundle Skillize - P7.2
 *
 * Batch process URL bundle through skillize.
 * Rate-limited, dry-run by default, supervisor approval for writes.
 *
 * Input: refId pointing to normalized URL bundle
 * Output: summary + outputRefId with skillize results
 */
import { MemoryNamespace } from '../memory/types';
/** Batch skillize configuration */
export interface BatchSkillizeConfig {
    /** Maximum URLs to process (default: 50) */
    maxUrls?: number;
    /** Rate limit delay between URLs in ms (default: 1000) */
    rateLimitMs?: number;
    /** Confirm write to disk (default: false = dry-run) */
    confirmWrite?: boolean;
    /** Template override (auto-detect if not specified) */
    template?: 'docs' | 'ecommerce' | 'internal-tool';
    /** Memory namespace for output (default: 'long-term') */
    namespace?: MemoryNamespace;
    /** Stop on first error (default: false) */
    stopOnError?: boolean;
}
/** Default configuration */
export declare const DEFAULT_BATCH_SKILLIZE_CONFIG: Required<BatchSkillizeConfig>;
/** Skillize result for a single URL */
export interface SkillizeUrlResult {
    url: string;
    success: boolean;
    refId?: string;
    skillName?: string;
    template?: string;
    error?: string;
}
/** Batch skillize result */
export interface BatchSkillizeResult {
    success: boolean;
    error?: string;
    outputRefId?: string;
    summary?: string;
    data?: {
        inputCount: number;
        processedCount: number;
        successCount: number;
        failureCount: number;
        skippedCount: number;
        results: SkillizeUrlResult[];
        dryRun: boolean;
    };
}
/**
 * Batch skillize URL bundle
 *
 * Takes normalized URL bundle from memory, processes each URL through skillize,
 * stores results in memory, returns summary + outputRefId.
 *
 * @param inputRefId - Reference ID to normalized URL bundle in memory
 * @param config - Batch processing configuration
 * @returns Batch skillize result with outputRefId
 */
export declare function batchSkillizeUrlBundle(inputRefId: string, config?: Partial<BatchSkillizeConfig>): Promise<BatchSkillizeResult>;
/**
 * Get batch skillize preview
 *
 * Returns preview of what would be processed without actually running skillize.
 *
 * @param inputRefId - Reference ID to normalized URL bundle
 * @param config - Configuration to apply
 */
export declare function getBatchSkillizePreview(inputRefId: string, config?: Partial<BatchSkillizeConfig>): Promise<{
    success: boolean;
    error?: string;
    preview?: {
        totalUrls: number;
        urlsToProcess: number;
        urlsToSkip: number;
        domains: Record<string, number>;
        estimatedTimeMs: number;
        config: Required<BatchSkillizeConfig>;
    };
}>;
