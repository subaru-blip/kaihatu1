/**
 * Post Report to GitHub Issue
 *
 * Posts observability reports to a configured GitHub Issue
 * P20 Update: i18n support for Japanese default
 */
import { ReportData } from './report';
interface PostResult {
    success: boolean;
    issueUrl?: string;
    commentId?: number;
    error?: string;
}
/**
 * Post report to GitHub Issue as a comment
 */
export declare function postReportToIssue(data: ReportData, markdown: string): Promise<PostResult>;
/**
 * Create initial report issue (run once to set up)
 */
export declare function createReportIssue(owner: string, repo: string): Promise<PostResult>;
export {};
