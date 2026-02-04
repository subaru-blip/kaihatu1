/**
 * Skillize - M5
 *
 * Generate skills from URLs using templates
 *
 * Features:
 * - Template-driven: docs, ecommerce, internal-tool
 * - dry-run by default (confirmWrite=true to write)
 * - Minimal output: summary + refId
 * - Full generated skill stored in memory (long-term)
 */
import { SkillizeOptions, SkillizeResult } from './types';
/**
 * Generate a skill from URL
 *
 * @param url - URL to analyze and generate skill from
 * @param options - Skillize options
 * @returns SkillizeResult with summary + refId
 */
export declare function skillize(url: string, options?: SkillizeOptions): Promise<SkillizeResult>;
/**
 * List generated skills
 */
export declare function listGeneratedSkills(): string[];
