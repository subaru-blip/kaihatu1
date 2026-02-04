/**
 * URL Bundle Processing
 *
 * Normalizes and groups URLs collected from browser extensions or CDP.
 * Handles deduplication, UTM removal, trailing slash normalization, and domain grouping.
 *
 * Input: refId pointing to URL list in memory
 * Output: summary + outputRefId with normalized URLs
 */
import { MemoryNamespace } from '../memory/types';
/** URL Bundle configuration */
export interface UrlBundleConfig {
    /** Maximum URLs to process (default: 200) */
    maxUrls?: number;
    /** Remove UTM parameters (default: true) */
    removeUtm?: boolean;
    /** Normalize trailing slashes (default: true) */
    normalizeTrailingSlash?: boolean;
    /** Group by domain (default: true) */
    groupByDomain?: boolean;
    /** Memory namespace for output (default: short-term) */
    namespace?: MemoryNamespace;
}
/** Default configuration */
export declare const DEFAULT_URL_BUNDLE_CONFIG: Required<UrlBundleConfig>;
/** Result of URL normalization */
export interface UrlBundleResult {
    success: boolean;
    error?: string;
    /** Output refId for normalized URLs */
    outputRefId?: string;
    summary?: string;
    data?: {
        inputCount: number;
        outputCount: number;
        removedCount: number;
        duplicatesRemoved: number;
        domainGroups?: Record<string, number>;
    };
}
/** Normalized URL entry */
export interface NormalizedUrl {
    url: string;
    domain: string;
    originalUrl?: string;
}
/** Domain group */
export interface DomainGroup {
    domain: string;
    urls: NormalizedUrl[];
    count: number;
}
/**
 * Normalize a single URL
 */
export declare function normalizeUrl(url: string, config: Required<UrlBundleConfig>): NormalizedUrl | null;
/**
 * Parse URL list from various formats
 */
export declare function parseUrlList(content: string): string[];
/**
 * Normalize URL bundle from memory refId
 *
 * @param inputRefId - Reference ID to URL list in memory
 * @param config - Normalization configuration
 * @returns Normalized URL bundle result with outputRefId
 */
export declare function normalizeUrlBundle(inputRefId: string, config?: Partial<UrlBundleConfig>): Promise<UrlBundleResult>;
/**
 * Get URL bundle statistics without processing
 */
export declare function getUrlBundleStats(inputRefId: string, _namespace?: MemoryNamespace): Promise<{
    success: boolean;
    error?: string;
    stats?: {
        totalUrls: number;
        uniqueDomains: number;
        topDomains: Array<{
            domain: string;
            count: number;
        }>;
    };
}>;
