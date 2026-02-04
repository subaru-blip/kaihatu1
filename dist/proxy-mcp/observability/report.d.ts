/**
 * Observability Report Generator
 *
 * Generates daily/weekly reports from event logs
 */
export interface ReportPeriod {
    start: Date;
    end: Date;
    label: string;
}
export interface McpMetrics {
    name: string;
    callCount: number;
    failureCount: number;
    failureRate: number;
    avgDurationMs: number;
    p95DurationMs: number;
    circuitOpenCount: number;
}
export interface ReportData {
    period: ReportPeriod;
    totalEvents: number;
    successRate: number;
    failureCount: number;
    mcpMetrics: McpMetrics[];
    topErrors: Array<{
        type: string;
        count: number;
    }>;
    topSkills: Array<{
        name: string;
        count: number;
    }>;
    topTools: Array<{
        name: string;
        count: number;
    }>;
    circuitSummary: {
        total: number;
        closed: number;
        open: number;
        halfOpen: number;
    };
    recommendations: string[];
}
/**
 * Generate report for a time period
 */
export declare function generateReport(period: ReportPeriod): ReportData;
/**
 * Format report as Markdown
 */
export declare function formatReportMarkdown(data: ReportData): string;
/**
 * Get report period for 24 hours
 */
export declare function getLast24hPeriod(): ReportPeriod;
/**
 * Get report period for 7 days
 */
export declare function getLast7dPeriod(): ReportPeriod;
