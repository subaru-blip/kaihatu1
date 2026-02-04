#!/usr/bin/env node
/**
 * Rollout CLI for Internal MCP Management
 *
 * Usage:
 *   internal-mcp:rollout --overlay <path> --mcp <name> --mode <off|canary|full> [--percent <0-100>]
 *
 * Examples:
 *   # Enable canary at 5%
 *   npm run internal-mcp:rollout -- --overlay /etc/taisun/internal-mcps.prod.json --mcp github --mode canary --percent 5
 *
 *   # Enable full rollout
 *   npm run internal-mcp:rollout -- --overlay /etc/taisun/internal-mcps.prod.json --mcp github --mode full
 *
 *   # Disable MCP
 *   npm run internal-mcp:rollout -- --overlay /etc/taisun/internal-mcps.prod.json --mcp github --mode off
 */
export {};
