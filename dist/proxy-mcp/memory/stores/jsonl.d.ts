/**
 * JSONL Store - File-based persistent memory storage
 *
 * Uses append-only JSONL format with periodic compaction.
 */
import { MemoryStore, MemoryEntry, MemorySearchResult, MemorySearchOptions, MemoryNamespace } from '../types';
/**
 * JSONL file-based implementation of MemoryStore
 */
export declare class JsonlStore implements MemoryStore {
    private directory;
    private entries;
    private logFile;
    private initialized;
    constructor(directory: string);
    private ensureInitialized;
    private applyLogEntry;
    private appendLog;
    add(entry: MemoryEntry): Promise<void>;
    get(id: string): Promise<MemoryEntry | null>;
    search(tokens: string[], options?: MemorySearchOptions): Promise<MemorySearchResult[]>;
    delete(id: string): Promise<boolean>;
    clear(namespace?: MemoryNamespace): Promise<number>;
    list(namespace?: MemoryNamespace): Promise<MemoryEntry[]>;
    count(namespace?: MemoryNamespace): Promise<number>;
    /**
     * Compact the log file by rewriting only current entries
     */
    compact(): Promise<void>;
    /**
     * Calculate search score for an entry
     */
    private calculateScore;
}
