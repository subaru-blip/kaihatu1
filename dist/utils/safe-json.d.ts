/**
 * Safe JSON Parser Utility
 *
 * Provides protection against prototype pollution attacks when parsing JSON.
 * CWE-1321: Improperly Controlled Modification of Object Prototype Attributes
 *
 * Usage:
 *   import { safeJSONParse, sanitizeObject } from '../utils/safe-json';
 *   const data = safeJSONParse<MyType>(jsonString);
 */
/**
 * Recursively remove dangerous properties from an object
 */
export declare function sanitizeObject<T>(obj: unknown): T;
/**
 * Safely parse JSON with prototype pollution protection
 *
 * @param jsonString - The JSON string to parse
 * @param reviver - Optional reviver function (same as JSON.parse)
 * @returns Parsed and sanitized object, or null if parsing fails
 */
export declare function safeJSONParse<T = unknown>(jsonString: string, reviver?: (key: string, value: unknown) => unknown): T | null;
/**
 * Safely parse JSON with strict validation
 * Throws an error instead of returning null
 *
 * @param jsonString - The JSON string to parse
 * @param context - Context string for error messages
 * @returns Parsed and sanitized object
 * @throws Error if parsing fails
 */
export declare function safeJSONParseStrict<T = unknown>(jsonString: string, context?: string): T;
/**
 * Check if an object contains dangerous prototype pollution keys
 */
export declare function hasDangerousKeys(obj: unknown): boolean;
/**
 * Type guard for validating parsed JSON against a schema
 *
 * Usage:
 *   const data = safeJSONParse<Config>(json);
 *   if (data && isValidConfig(data)) {
 *     // data is now typed as Config
 *   }
 */
export type TypeGuard<T> = (value: unknown) => value is T;
/**
 * Safely parse JSON with type validation
 *
 * @param jsonString - The JSON string to parse
 * @param validator - Type guard function to validate the parsed object
 * @returns Validated and typed object, or null if validation fails
 */
export declare function safeJSONParseWithValidation<T>(jsonString: string, validator: TypeGuard<T>): T | null;
