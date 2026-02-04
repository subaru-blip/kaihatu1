/**
 * Skill Templates - M5
 *
 * Template definitions for docs, ecommerce, and internal-tool
 */
import { SkillTemplate, UrlAnalysis } from './types';
/**
 * Documentation template
 *
 * For API docs, library docs, technical documentation
 */
export declare const docsTemplate: SkillTemplate;
/**
 * E-commerce template
 *
 * For product pages, shopping sites, marketplaces
 */
export declare const ecommerceTemplate: SkillTemplate;
/**
 * Internal tool template
 *
 * For internal tools, dashboards, admin panels
 */
export declare const internalToolTemplate: SkillTemplate;
/**
 * All available templates
 */
export declare const templates: SkillTemplate[];
/**
 * Get template by type
 */
export declare function getTemplate(type: string): SkillTemplate | undefined;
/**
 * Detect best template for URL analysis
 */
export declare function detectTemplate(analysis: UrlAnalysis): SkillTemplate;
