import { describe, it, expect, beforeEach, vi } from "vitest";

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

	it("maintains closed state on successful call", async () => {
		const result = await mongoCircuitBreaker.call(() => Promise.resolve("ok"));
		expect(result).toBe("ok");
		expect(mongoCircuitBreaker.getState().status).toEqual("CLOSED");
	});

	it("increments failure count on failed calls, but remains open when under threshold", async () => {
		await mongoCircuitBreaker.call(() => Promise.reject(new Error())).catch(() => {});
		expect(mongoCircuitBreaker.getState().failureCount).toEqual(1);

		await mongoCircuitBreaker.call(() => Promise.reject(new Error())).catch(() => {});
		expect(mongoCircuitBreaker.getState().failureCount).toEqual(2);

		expect(mongoCircuitBreaker.getState().status).toEqual("CLOSED");
	});

	it("resets failure count after a successful call", async () => {
		await mongoCircuitBreaker.call(() => Promise.reject(new Error())).catch(() => {});
		await mongoCircuitBreaker.call(() => Promise.resolve("ok"));
		expect(mongoCircuitBreaker.getState().failureCount).toEqual(0);
	});

	it("transitions to open state after failure threshold reached", async () => {
		const failureThreshold = 5;
		for (let i = 0; i < failureThreshold; i++) {
			await mongoCircuitBreaker.call(() => Promise.reject(new Error())).catch(() => {});
		}
		expect(mongoCircuitBreaker.getState().status).toEqual("OPEN");
	});

	it("rejects requests when circuit breaker is open", async () => {
		const failureThreshold = 5;
		for (let i = 0; i < failureThreshold; i++) {
			await mongoCircuitBreaker.call(() => Promise.reject(new Error())).catch(() => {});
		}

		const spy = vi.fn(() => Promise.resolve("ok"));
		await expect(mongoCircuitBreaker.call(spy)).rejects.toThrow(
			"Request rejected, circuit breaker is OPEN."
		);
		expect(spy).not.toHaveBeenCalled();
	});
});
