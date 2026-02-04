/**
 * Path Validator - Enforces absolute paths for file operations
 *
 * Based on Anthropic's SWE-bench best practices:
 * "Edit Tool requires absolute paths to prevent relative path mishandling"
 *
 * @see https://www.anthropic.com/engineering/swe-bench-sonnet
 */
export interface PathValidationResult {
    valid: boolean;
    normalizedPath: string;
    error?: string;
    suggestion?: string;
}
export interface PathValidatorConfig {
    allowRelative: boolean;
    allowedPrefixes: string[];
    blockedPrefixes: string[];
    maxDepth: number;
}
export declare const DEFAULT_PATH_CONFIG: PathValidatorConfig;
/**
 * Validate and normalize a file path
 * Enforces absolute paths by default (SWE-bench best practice)
 */
export declare function validatePath(path: string, config?: PathValidatorConfig): PathValidationResult;
/**
 * Normalize a path by resolving . and .. and removing duplicate slashes
 */
export declare function normalizePath(path: string): string;
/**
 * Enforce absolute path - throws error if relative
 * Use this for strict enforcement in critical operations
 */
export declare function enforceAbsolutePath(path: string, context?: string): string;
/**
 * Convert relative path to absolute using base directory
 */
export declare function toAbsolutePath(path: string, baseDir: string): string;
/**
 * Check if path is within allowed directory (sandbox check)
 */
export declare function isPathWithinDirectory(path: string, allowedDir: string): boolean;
/**
 * Extract file extension from path
 */
export declare function getFileExtension(path: string): string;
/**
 * Validate multiple paths at once
 */
export declare function validatePaths(paths: string[], config?: PathValidatorConfig): {
    valid: PathValidationResult[];
    invalid: PathValidationResult[];
};
