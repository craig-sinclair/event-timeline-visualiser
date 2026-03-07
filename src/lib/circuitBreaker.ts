import {
	CircuitStatus,
	CircuitBreakerParams,
	CircuitBreakerInternalState,
} from "@/models/circuitBreaker.types";

class CircuitBreaker {
	private status: CircuitStatus = "CLOSED";
	private failureCount = 0;
	private successCount = 0;
	private lastFailureTime?: number;

	constructor(private readonly _params: CircuitBreakerParams = {}) {}

	getState(): CircuitBreakerInternalState {
		return {
			status: this.status,
			failureCount: this.failureCount,
			successCount: this.successCount,
			lastFailureTime: this.lastFailureTime,
		};
	}

	reset() {
		this.status = "CLOSED";
		this.failureCount = 0;
		this.successCount = 0;
		this.lastFailureTime = undefined;
	}
}

export const mongoCircuitBreaker = new CircuitBreaker({
	failureThreshold: 5,
	successThreshold: 3,
	retryTimeoutMs: 30_000,
	callTimeoutMs: 8_000,
});
