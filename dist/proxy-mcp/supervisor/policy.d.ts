/**
 * Supervisor Policy - M6
 *
 * Policy checks for dangerous operations
 */
import { RouteDecision, ExecutionPlan, PlanStep } from './types';
/**
 * Check if input contains dangerous patterns
 */
export declare function checkDangerousPatterns(input: string): string[];
/**
 * Determine if approval is required based on input and route
 */
export declare function requiresApproval(input: string, route?: RouteDecision): boolean;
/**
 * Analyze execution plan for risk level
 */
export declare function analyzePlanRisk(plan: ExecutionPlan): 'low' | 'medium' | 'high' | 'critical';
/**
 * Determine risk level for a single action
 */
export declare function determineStepRisk(action: string, target?: string): 'low' | 'medium' | 'high' | 'critical';
/**
 * Create a plan step with risk assessment
 */
export declare function createPlanStep(id: string, action: string, target?: string, params?: Record<string, unknown>): PlanStep;
/**
 * Validate that a plan can be executed safely
 */
export declare function validatePlan(plan: ExecutionPlan, approved: boolean): {
    valid: boolean;
    reason?: string;
};
