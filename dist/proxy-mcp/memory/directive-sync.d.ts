/**
 * Directive Sync - Memory Enhancement
 *
 * Syncs directives.md, mistakes.md, memory.md to MCP memory
 * for semantic search and session continuity.
 */
/**
 * Sync directive files to memory
 */
export declare function syncDirectivesToMemory(): Promise<{
    synced: number;
    errors: string[];
}>;
/**
 * Search across all directive memory
 */
export declare function searchDirectives(query: string, options?: {
    limit?: number;
    tags?: string[];
}): Promise<Array<{
    source: string;
    summary: string;
    score: number;
    tags: string[];
}>>;
/**
 * Get session briefing (for session start)
 */
export declare function getSessionBriefing(): Promise<string>;
/**
 * Check for related mistakes before starting task
 */
export declare function checkRelatedMistakes(taskDescription: string): Promise<string[]>;
