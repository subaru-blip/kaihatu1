/**
 * Observability Service - P5
 *
 * Event tracking, metrics collection, and monitoring
 */
import { ObservabilityEvent, EventType, EventStatus, MetricsSummary, EventFilter } from './types';
/**
 * Record an event
 */
export declare function recordEvent(type: EventType, runId: string, status: EventStatus, options?: Partial<Omit<ObservabilityEvent, 'timestamp' | 'type' | 'runId' | 'status'>>): ObservabilityEvent;
/**
 * Create event recorder with timing
 */
export declare function startTimer(type: EventType, runId: string, options?: Partial<Omit<ObservabilityEvent, 'timestamp' | 'type' | 'runId' | 'status' | 'durationMs'>>): (status?: EventStatus, errorInfo?: {
    errorType?: string;
    errorMessage?: string;
}) => ObservabilityEvent;
/**
 * Get events matching filter
 */
export declare function getEvents(filter?: EventFilter): ObservabilityEvent[];
/**
 * Get metrics summary
 */
export declare function getMetricsSummary(since?: string): MetricsSummary;
/**
 * Clear event buffer (for testing)
 */
export declare function clearEvents(): void;
/**
 * Get recent events summary (for system_health)
 */
export declare function getRecentEventsSummary(_limit?: number): {
    total: number;
    last24h: MetricsSummary;
    topErrors: Array<{
        type: string;
        count: number;
    }>;
};
