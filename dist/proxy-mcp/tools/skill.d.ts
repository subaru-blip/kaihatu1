/**
 * Skill Tools - Search and run skills from .claude/skills
 *
 * M2 Update: Added routing support for internal MCP selection
 * M4 Update: Added web skills (read_url, extract_links, capture_dom_map)
 * M5 Update: Added skillize (URL→Skill generation)
 * M6 Update: Added supervisor (LangGraph-based with human approval)
 */
import { ToolResult } from '../types';
export type SkillRunMode = 'preview' | 'route' | 'execute';
/**
 * Search for skills matching a query
 */
export declare function skillSearch(query: string): ToolResult;
/**
 * Run a skill by name
 *
 * @param skillName - Name of the skill to run (or web.read_url, web.extract_links, web.capture_dom_map)
 * @param params - Optional parameters
 * @param params.mode - 'preview' (default), 'route', or 'execute'
 * @param params.input - Input for routing (used when mode='route')
 * @param params.url - URL for web skills
 * @param params.namespace - Memory namespace for web skills
 */
export declare function skillRun(skillName: string, params?: Record<string, unknown>): ToolResult;
/**
 * Run a web skill asynchronously (M4)
 *
 * This is the actual async execution of web skills.
 * Returns summary + refId following minimal output principle.
 */
export declare function skillRunAsync(skillName: string, params?: Record<string, unknown>): Promise<ToolResult>;
/**
 * Route an input to find the best internal MCP
 */
export declare function skillRoute(input: string | undefined): ToolResult;
