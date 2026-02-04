/**
 * Proxy MCP Server
 *
 * Single entry point for Claude Code. Bundles multiple internal MCPs
 * behind a minimal public interface to reduce context pressure.
 *
 * Public Tools (exposed to Claude):
 * - system.health: Check if proxy is alive
 * - skill.search: Find skills from .claude/skills
 * - skill.run: Execute a skill
 * - memory.add: Store large content, return reference ID
 * - memory.search: Retrieve content by ID or keyword
 */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { systemHealth } from './tools/system';
import { skillSearch, skillRun } from './tools/skill';
import { memoryAdd, memorySearch, memoryStats } from './tools/memory';
declare const server: Server<{
    method: string;
    params?: {
        [x: string]: unknown;
        _meta?: {
            [x: string]: unknown;
            progressToken?: string | number | undefined;
            "io.modelcontextprotocol/related-task"?: {
                taskId: string;
            } | undefined;
        } | undefined;
    } | undefined;
}, {
    method: string;
    params?: {
        [x: string]: unknown;
        _meta?: {
            [x: string]: unknown;
            progressToken?: string | number | undefined;
            "io.modelcontextprotocol/related-task"?: {
                taskId: string;
            } | undefined;
        } | undefined;
    } | undefined;
}, {
    [x: string]: unknown;
    _meta?: {
        [x: string]: unknown;
        progressToken?: string | number | undefined;
        "io.modelcontextprotocol/related-task"?: {
            taskId: string;
        } | undefined;
    } | undefined;
}>;
declare const TOOLS: ({
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            name?: undefined;
            params?: undefined;
            content?: undefined;
            content_path?: undefined;
            type?: undefined;
            metadata?: undefined;
            query?: undefined;
        };
        required: never[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            name: {
                type: string;
                description: string;
            };
            params: {
                type: string;
                description: string;
            };
            content?: undefined;
            content_path?: undefined;
            type?: undefined;
            metadata?: undefined;
            query?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            content: {
                type: string;
                description: string;
            };
            content_path: {
                type: string;
                description: string;
            };
            type: {
                type: string;
                enum: string[];
                description: string;
            };
            metadata: {
                type: string;
                description: string;
            };
            name?: undefined;
            params?: undefined;
            query?: undefined;
        };
        required: never[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            query: {
                type: string;
                description: string;
            };
            name?: undefined;
            params?: undefined;
            content?: undefined;
            content_path?: undefined;
            type?: undefined;
            metadata?: undefined;
        };
        required: string[];
    };
})[];
export { server, TOOLS, systemHealth, skillSearch, skillRun, memoryAdd, memorySearch, memoryStats };
