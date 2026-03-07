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

	constructor(private readonly params: CircuitBreakerParams = {}) {}

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

	async call<T>(fn: () => Promise<T>): Promise<T> {
		if (this.status == "OPEN") {
			const elapsedTimeSinceFailure = Date.now() - (this.lastFailureTime ?? 0);
			if (elapsedTimeSinceFailure < (this.params.retryTimeoutMs ?? 30_000)) {
				throw new Error("Request rejected, circuit breaker is OPEN.");
			}
			this.status = "HALF_OPEN";
		}

		try {
			const result = await this.withTimeout(fn);
			this.onSuccess();
			return result;
		} catch (err) {
			this.onFailure();
			throw err;
		}
	}

	private withTimeout<T>(fn: () => Promise<T>): Promise<T> {
		const msTimeout = this.params.callTimeoutMs ?? 8_000;
		return Promise.race([
			fn(),
			new Promise<never>((_, reject) =>
				setTimeout(() => reject(new Error(`Timeout after ${msTimeout}ms`)), msTimeout)
			),
		]);
	}

	private onSuccess() {
		this.failureCount = 0;
		if (this.status == "HALF_OPEN") {
			this.successCount++;
			if (this.successCount >= (this.params.successThreshold ?? 3)) {
				this.status = "CLOSED";
				this.successCount = 0;
			}
		}
	}

	private onFailure() {
		this.failureCount++;
		this.lastFailureTime = Date.now();
		if (this.failureCount >= (this.params.failureThreshold ?? 5)) {
			this.status = "OPEN";
		}
	}
}

export const mongoCircuitBreaker = new CircuitBreaker({
	failureThreshold: 5,
	successThreshold: 3,
	retryTimeoutMs: 30_000,
	callTimeoutMs: 8_000,
});
