/**
 * Memory Store - Base interface and factory
 */
import { MemoryStore, MemoryConfig } from './types';
/**
 * Create a memory store based on configuration
 */
export declare function createStore(config: MemoryConfig): MemoryStore;
/**
 * Re-export store implementations for direct use
 */
export { InMemoryStore } from './stores/inmemory';
export { JsonlStore } from './stores/jsonl';
