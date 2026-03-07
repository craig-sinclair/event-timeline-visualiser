import { describe, it, expect, beforeEach, vi } from "vitest";

import { mongoCircuitBreaker } from "@/lib/circuitBreaker";
import { CircuitBreakerInternalState } from "@/models/circuitBreaker.types";

const FAILURE_THRESHOLD = 5;
const RETRY_TIMEOUT_MS = 30_000;
const SUCCESS_THRESHOLD = 3;
const CALL_TIMEOUT_MS = 8_000;

describe("Circuit breaker tests", () => {
	beforeEach(() => {
		mongoCircuitBreaker.reset();
		vi.useRealTimers();
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
		for (let i = 0; i < FAILURE_THRESHOLD; i++) {
			await mongoCircuitBreaker.call(() => Promise.reject(new Error())).catch(() => {});
		}
		expect(mongoCircuitBreaker.getState().status).toEqual("OPEN");
	});

	it("rejects requests when circuit breaker is open", async () => {
		for (let i = 0; i < FAILURE_THRESHOLD; i++) {
			await mongoCircuitBreaker.call(() => Promise.reject(new Error())).catch(() => {});
		}

		const spy = vi.fn(() => Promise.resolve("ok"));
		await expect(mongoCircuitBreaker.call(spy)).rejects.toThrow(
			"Request rejected, circuit breaker is OPEN."
		);
		expect(spy).not.toHaveBeenCalled();
	});

	it("transitions to half open state after timeout period exceeded", async () => {
		vi.useFakeTimers();

		for (let i = 0; i < FAILURE_THRESHOLD; i++) {
			await mongoCircuitBreaker.call(() => Promise.reject(new Error())).catch(() => {});
		}

		vi.advanceTimersByTime(RETRY_TIMEOUT_MS + 1);
		await mongoCircuitBreaker.call(() => Promise.resolve("ok")).catch(() => {});
		expect(mongoCircuitBreaker.getState().status).toEqual("HALF_OPEN");
	});

	it("transitions to closed state after three successful calls in half open state", async () => {
		vi.useFakeTimers();

		for (let i = 0; i < FAILURE_THRESHOLD; i++) {
			await mongoCircuitBreaker.call(() => Promise.reject(new Error())).catch(() => {});
		}

		vi.advanceTimersByTime(RETRY_TIMEOUT_MS + 1);
		for (let i = 0; i < SUCCESS_THRESHOLD; i++) {
			await mongoCircuitBreaker.call(() => Promise.resolve("ok"));
		}

		expect(mongoCircuitBreaker.getState().status).toEqual("CLOSED");
		expect(mongoCircuitBreaker.getState().failureCount).toEqual(0);
	});

	it("transitions to open on failure when in half open state", async () => {
		vi.useFakeTimers();

		for (let i = 0; i < FAILURE_THRESHOLD; i++) {
			await mongoCircuitBreaker.call(() => Promise.reject(new Error())).catch(() => {});
		}

		vi.advanceTimersByTime(RETRY_TIMEOUT_MS + 1);
		await mongoCircuitBreaker.call(() => Promise.resolve("ok"));

		await mongoCircuitBreaker.call(() => Promise.reject(new Error())).catch(() => {});
		expect(mongoCircuitBreaker.getState().status).toEqual("OPEN");
	});

	it("rejects with timeout error if call exceeds threshold", async () => {
		vi.useFakeTimers();

		const slowRequest = () => new Promise<never>((_, reject) => setTimeout(reject, 10_000));
		const resultPromise = mongoCircuitBreaker.call(slowRequest);
		vi.advanceTimersByTime(CALL_TIMEOUT_MS + 1);

		await expect(resultPromise).rejects.toThrow(`Timeout after ${CALL_TIMEOUT_MS}ms`);
		expect(mongoCircuitBreaker.getState().failureCount).toEqual(1);
	});
});
