#!/usr/bin/env node
/**
 * Chrome Debug Mode CLI
 *
 * Starts Chrome in debug mode with CDP enabled for Playwright connection.
 * Uses a dedicated profile to avoid interfering with daily-use Chrome.
 *
 * Environment variables:
 * - CHROME_PATH: Path to Chrome executable
 * - CHROME_DEBUG_PORT: Debug port (default: 9222)
 * - CHROME_PROFILE_DIR: Profile directory (default: ~/.chrome-debug-profile)
 */
export {};
