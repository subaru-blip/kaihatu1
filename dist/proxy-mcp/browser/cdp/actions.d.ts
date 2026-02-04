/**
 * CDP Browser Actions
 *
 * High-level browser actions using Playwright CDP connection.
 * Results use minimal output with refId for large data.
 */
import { CDPConfig, CDPActionResult, PageContent, ExtractedLinks, DOMMap, TabsList } from './types';
/**
 * Read URL content via CDP
 */
export declare function readUrlViaCDP(url: string, config?: Partial<CDPConfig>): Promise<CDPActionResult<PageContent>>;
/**
 * Extract links from URL via CDP
 */
export declare function extractLinksViaCDP(url: string, config?: Partial<CDPConfig>): Promise<CDPActionResult<ExtractedLinks>>;
/**
 * Capture DOM map via CDP
 */
export declare function captureDOMMapViaCDP(url: string, config?: Partial<CDPConfig>): Promise<CDPActionResult<DOMMap>>;
/**
 * List all tabs (pages) via CDP
 *
 * Returns all open tab URLs and titles from the browser.
 * Does not navigate to any URL - just reads existing tabs.
 */
export declare function listTabsViaCDP(config?: Partial<CDPConfig>): Promise<CDPActionResult<TabsList>>;
