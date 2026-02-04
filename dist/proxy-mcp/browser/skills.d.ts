/**
 * Web Skills - Browser automation skills for M4/P7
 *
 * Skills:
 * - web.read_url: Read URL and summarize (full content to refId)
 * - web.extract_links: Extract page links (large lists to refId)
 * - web.capture_dom_map: Capture DOM structure (map to refId)
 * - web.list_tabs_urls: List all open tab URLs via CDP
 * - url.normalize_bundle: Normalize URL bundle (refId → refId)
 *
 * Backends:
 * - default: Uses chrome MCP (puppeteer)
 * - cdp: Uses Playwright CDP to connect to existing Chrome (P7)
 *
 * All output follows minimal output principle: summary + refId
 */
import { WebSkillResult } from './types';
import { MemoryNamespace } from '../memory/types';
import { UrlBundleConfig } from './url-bundle';
import { BatchSkillizeConfig } from './url-bundle-skillize';
import { PipelineTabsSkillizeConfig } from './pipeline-tabs-skillize';
/** Backend type for web skills */
export type WebBackend = 'default' | 'cdp';
/**
 * web.read_url - Read URL and summarize
 *
 * Opens URL, extracts text content, checks for CAPTCHA,
 * stores full content in memory, returns summary + refId
 *
 * @param url - URL to read
 * @param options.backend - 'default' (puppeteer) or 'cdp' (Playwright CDP)
 * @param options.namespace - Memory namespace for storage
 * @param options.maxLength - Max content length
 */
export declare function readUrl(url: string, options?: {
    backend?: WebBackend;
    namespace?: MemoryNamespace;
    maxLength?: number;
}): Promise<WebSkillResult>;
/**
 * web.extract_links - Extract page links
 *
 * Extracts all links from page, stores full list in memory,
 * returns summary with link count + refId
 *
 * @param url - URL to extract links from
 * @param options.backend - 'default' (puppeteer) or 'cdp' (Playwright CDP)
 * @param options.namespace - Memory namespace for storage
 * @param options.filter - 'internal', 'external', or 'all'
 */
export declare function extractLinks(url: string, options?: {
    backend?: WebBackend;
    namespace?: MemoryNamespace;
    filter?: 'internal' | 'external' | 'all';
}): Promise<WebSkillResult>;
/**
 * web.capture_dom_map - Capture DOM structure
 *
 * Analyzes page DOM structure, identifies major components,
 * stores full map in memory, returns summary + refId
 *
 * @param url - URL to capture DOM from
 * @param options.backend - 'default' (puppeteer) or 'cdp' (Playwright CDP)
 * @param options.namespace - Memory namespace for storage
 */
export declare function captureDomMap(url: string, options?: {
    backend?: WebBackend;
    namespace?: MemoryNamespace;
}): Promise<WebSkillResult>;
/**
 * web.list_tabs_urls - List all open tab URLs via CDP
 *
 * Lists all open tabs in the connected Chrome browser.
 * Stores full list in memory, returns summary + refId.
 * CDP-only skill (requires Chrome running with --remote-debugging-port).
 *
 * @param options.namespace - Memory namespace for storage
 */
export declare function listTabsUrls(options?: {
    namespace?: MemoryNamespace;
}): Promise<WebSkillResult>;
/**
 * url.normalize_bundle - Normalize URL bundle
 *
 * Takes an input refId pointing to URL list in memory,
 * normalizes (dedup, UTM removal, trailing slash), groups by domain,
 * stores result in memory, returns summary + outputRefId.
 *
 * Input formats supported:
 * - JSON array of URLs: ["url1", "url2"]
 * - JSON array of objects: [{ url: "url1" }, { href: "url2" }]
 * - JSON object with urls/tabs/links array
 * - Newline-separated URLs
 * - Comma-separated URLs
 *
 * @param inputRefId - Memory refId pointing to URL list
 * @param options.maxUrls - Maximum URLs to process (default: 200)
 * @param options.removeUtm - Remove UTM parameters (default: true)
 * @param options.normalizeTrailingSlash - Normalize trailing slashes (default: true)
 * @param options.groupByDomain - Group results by domain (default: true)
 * @param options.namespace - Memory namespace for output (default: 'short-term')
 */
export declare function normalizeUrlBundle(inputRefId: string, options?: Partial<UrlBundleConfig>): Promise<WebSkillResult>;
/**
 * url.get_bundle_stats - Get URL bundle statistics
 *
 * Returns statistics about a URL bundle without processing.
 * Useful for preview before normalization.
 *
 * @param inputRefId - Memory refId pointing to URL list
 * @param options.namespace - Memory namespace (default: 'short-term')
 */
export declare function getUrlBundleStats(inputRefId: string, options?: {
    namespace?: MemoryNamespace;
}): Promise<WebSkillResult>;
/**
 * url.batch_skillize - Batch skillize URL bundle
 *
 * Takes a normalized URL bundle (refId), runs skillize on each URL,
 * stores results in memory, returns summary + outputRefId.
 *
 * IMPORTANT: dry-run by default (confirmWrite=false).
 * Use confirmWrite=true only after preview/approval.
 *
 * @param inputRefId - Memory refId pointing to normalized URL bundle
 * @param options.maxUrls - Maximum URLs to process (default: 50)
 * @param options.rateLimitMs - Delay between URLs in ms (default: 1000)
 * @param options.confirmWrite - Write to disk (default: false = dry-run)
 * @param options.template - Force template type (auto-detect if not specified)
 * @param options.namespace - Memory namespace (default: 'long-term')
 * @param options.stopOnError - Stop on first error (default: false)
 */
export declare function batchSkillizeUrlBundle(inputRefId: string, options?: Partial<BatchSkillizeConfig>): Promise<WebSkillResult>;
/**
 * url.batch_skillize_preview - Preview batch skillize
 *
 * Returns preview of what would be processed without running skillize.
 * Use this before batchSkillizeUrlBundle to verify config.
 *
 * @param inputRefId - Memory refId pointing to normalized URL bundle
 * @param options - Configuration to preview
 */
export declare function batchSkillizePreview(inputRefId: string, options?: Partial<BatchSkillizeConfig>): Promise<WebSkillResult>;
/**
 * pipeline.web_skillize_from_tabs - One-command pipeline
 *
 * Runs the full pipeline: list_tabs_urls(CDP) -> normalize URL bundle -> batch skillize
 *
 * Features:
 * - Minimal output: summary + refId only (no URL lists in response)
 * - Dry-run by default: confirmWrite=false
 * - CDP connection check with human-friendly error
 * - inputRefId option: skip tabs collection, use existing URL bundle
 *
 * @param options.inputRefId - Skip tabs collection, use existing URL bundle
 * @param options.includeDomains - Include only these domains
 * @param options.excludeDomains - Exclude these domains
 * @param options.excludeUrlPatterns - Exclude URLs matching these patterns
 * @param options.maxUrls - Maximum URLs to process (default: 200)
 * @param options.perDomainLimit - Per-domain limit (default: 50)
 * @param options.stripTracking - Remove tracking parameters (default: true)
 * @param options.maxFetch - Maximum URLs to skillize (default: 20)
 * @param options.rateLimitMs - Rate limit between URLs (default: 1000)
 * @param options.confirmWrite - Write to disk (default: false = dry-run)
 * @param options.namespace - Memory namespace (default: 'long-term')
 */
export declare function webSkillizeFromTabs(options?: Partial<PipelineTabsSkillizeConfig>): Promise<WebSkillResult>;
