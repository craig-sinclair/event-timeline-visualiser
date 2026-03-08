export type CircuitStatus = "CLOSED" | "OPEN" | "HALF_OPEN";

export interface CircuitBreakerParams {
	failureThreshold?: number; // number of failures before opening breaker
	successThreshold?: number; // number of successes to close from half-open
	retryTimeoutMs?: number;
	callTimeoutMs?: number;
}

export interface CircuitBreakerInternalState {
	status: CircuitStatus;
	failureCount: number;
	successCount: number;
	lastFailureTime?: number;
}
