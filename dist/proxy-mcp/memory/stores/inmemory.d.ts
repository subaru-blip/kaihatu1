/**
 * In-Memory Store - Fast, non-persistent memory storage
 */
import { MemoryStore, MemoryEntry, MemorySearchResult, MemorySearchOptions, MemoryNamespace } from '../types';
/**
 * In-memory implementation of MemoryStore
 */
export declare class InMemoryStore implements MemoryStore {
    private entries;
    add(entry: MemoryEntry): Promise<void>;
    get(id: string): Promise<MemoryEntry | null>;
    search(tokens: string[], options?: MemorySearchOptions): Promise<MemorySearchResult[]>;
    delete(id: string): Promise<boolean>;
    clear(namespace?: MemoryNamespace): Promise<number>;
    list(namespace?: MemoryNamespace): Promise<MemoryEntry[]>;
    count(namespace?: MemoryNamespace): Promise<number>;
    /**
     * Calculate search score for an entry
     */
    private calculateScore;
}
