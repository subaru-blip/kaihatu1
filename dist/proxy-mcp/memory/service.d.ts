/**
 * Memory Service - Main API for memory operations
 *
 * Handles short/long term memory management with minimal output principle.
 */
import { MemoryStore, MemoryNamespace, MemoryAddOptions, MemorySearchOptions, MemoryOutput } from './types';
/**
 * Memory Service - Singleton
 */
export declare class MemoryService {
    private config;
    private store;
    private constructor();
    /**
     * Get singleton instance
     */
    static getInstance(): MemoryService;
    /**
     * Reset instance (for testing)
     */
    static resetInstance(): void;
    /**
     * Create instance with custom store (for testing)
     */
    static createWithStore(store: MemoryStore): MemoryService;
    /**
     * Add content to memory
     */
    add(content: string, options?: MemoryAddOptions): Promise<{
        id: string;
        summary: string;
    }>;
    /**
     * Get entry by ID
     */
    get(id: string, includeContent?: boolean): Promise<MemoryOutput | null>;
    /**
     * Get full content by ID (bypasses preview truncation)
     *
     * Use for large content like URL bundles that need full data.
     */
    getContent(id: string): Promise<string | null>;
    /**
     * Search memory
     */
    search(query: string, options?: MemorySearchOptions): Promise<MemoryOutput[]>;
    /**
     * Delete entry by ID
     */
    delete(id: string): Promise<boolean>;
    /**
     * Clear memory
     */
    clear(namespace?: MemoryNamespace): Promise<number>;
    /**
     * Get memory statistics
     */
    stats(): Promise<{
        total: number;
        shortTerm: number;
        longTerm: number;
    }>;
    /**
     * Clean up expired entries
     */
    cleanup(): Promise<number>;
    /**
     * Generate summary from content
     */
    private generateSummary;
    /**
     * Tokenize text for search
     */
    private tokenize;
    /**
     * Format entry for output (minimal by default)
     */
    private formatOutput;
}
export declare function getMemoryService(): MemoryService;
