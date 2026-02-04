/**
 * CAPTCHA Detection - Guardrails for browser automation
 *
 * Detects CAPTCHA/anti-bot patterns and returns require_human action
 */
import { WebSkillResult } from './types';
/**
 * Check if content contains CAPTCHA patterns
 */
export declare function detectCaptcha(content: string): {
    detected: boolean;
    pattern?: string;
};
/**
 * Check page content and return require_human if CAPTCHA detected
 */
export declare function guardCaptcha(content: string, url: string): WebSkillResult | null;
/**
 * Check if URL is potentially blocked or requires authentication
 */
export declare function checkBlockedPatterns(url: string): WebSkillResult | null;
