import { describe, it, expect, beforeEach } from "vitest";

import { mongoCircuitBreaker } from "@/lib/circuitBreaker";
import { CircuitBreakerInternalState } from "@/models/circuitBreaker.types";

describe("Circuit breaker tests", () => {
	beforeEach(() => {
		mongoCircuitBreaker.reset();
	});

	it("correctly initialises with default state", () => {
		const breakerState: CircuitBreakerInternalState = mongoCircuitBreaker.getState();
		expect(breakerState.failureCount).toEqual(0);
		expect(breakerState.status).toEqual("CLOSED");
		expect(breakerState.successCount).toEqual(0);
		expect(breakerState.lastFailureTime).toBe(undefined);
	});
});
