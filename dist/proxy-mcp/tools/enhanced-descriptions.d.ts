/**
 * Enhanced Tool Descriptions
 *
 * Based on Anthropic's SWE-bench best practices:
 * "Tool specifications should emphasize descriptions over input schemas"
 *
 * Each tool description includes:
 * - Purpose and use cases
 * - Requirements and constraints
 * - Common mistakes to avoid
 * - Examples of correct usage
 *
 * @see https://www.anthropic.com/engineering/swe-bench-sonnet
 */
export interface EnhancedToolDescription {
    name: string;
    description: string;
    requirements: string[];
    commonMistakes: string[];
    examples: {
        correct: string[];
        incorrect: string[];
    };
}
/**
 * Enhanced descriptions for core file operations
 */
export declare const FILE_TOOLS: EnhancedToolDescription[];
/**
 * Enhanced descriptions for search operations
 */
export declare const SEARCH_TOOLS: EnhancedToolDescription[];
/**
 * Enhanced descriptions for shell operations
 */
export declare const SHELL_TOOLS: EnhancedToolDescription[];
/**
 * Enhanced descriptions for agent operations
 */
export declare const AGENT_TOOLS: EnhancedToolDescription[];
/**
 * Get enhanced description for a tool
 */
export declare function getEnhancedDescription(toolName: string): EnhancedToolDescription | undefined;
/**
 * Format enhanced description for display
 */
export declare function formatToolDescription(tool: EnhancedToolDescription): string;
/**
 * Export all enhanced descriptions
 */
export declare const ALL_ENHANCED_DESCRIPTIONS: EnhancedToolDescription[];
