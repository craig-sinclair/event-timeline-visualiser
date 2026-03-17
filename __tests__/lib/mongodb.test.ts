import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mockConnect = vi.fn().mockResolvedValue("client-instance");
const mockMongoClient = vi.fn().mockImplementation(() => ({ connect: mockConnect }));

vi.mock("mongodb", () => ({
	MongoClient: mockMongoClient,
}));

async function importModule(): Promise<Promise<unknown>> {
	return (await import("@/lib/mongodb")).default;
}

describe("Mongodb client tests", () => {
	beforeEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
		vi.stubEnv("MONGODB_URI", "mongodb://localhost:27017/test");
		delete global._mongoClientPromise;
	});

	afterEach(() => {
		vi.unstubAllEnvs();
		delete global._mongoClientPromise;
	});

	it("throws when MONGODB_URI is not set", async () => {
		vi.stubEnv("MONGODB_URI", "");
		await expect(importModule()).rejects.toThrow("Please add your Mongo URI to .env");
	});

	it("creates a new MongoClient with the uri in production", async () => {
		vi.stubEnv("NODE_ENV", "production");
		await importModule();
		expect(mockMongoClient).toHaveBeenCalledWith("mongodb://localhost:27017/test", {});
	});

	it("calls connect on the client in production", async () => {
		vi.stubEnv("NODE_ENV", "production");
		await importModule();
		expect(mockConnect).toHaveBeenCalledOnce();
	});

	it("creates a new MongoClient with the uri in development", async () => {
		vi.stubEnv("NODE_ENV", "development");
		await importModule();
		expect(mockMongoClient).toHaveBeenCalledWith("mongodb://localhost:27017/test", {});
	});

	it("calls connect on the client in development", async () => {
		vi.stubEnv("NODE_ENV", "development");
		await importModule();
		expect(mockConnect).toHaveBeenCalledOnce();
	});

	it("reuses the cached client promise on subsequent imports in development", async () => {
		vi.stubEnv("NODE_ENV", "development");
		await importModule();
		vi.resetModules();
		await importModule();
		expect(mockMongoClient).toHaveBeenCalledOnce();
	});

	it("does not cache the client promise in production", async () => {
		vi.stubEnv("NODE_ENV", "production");
		await importModule();
		vi.resetModules();
		await importModule();
		expect(mockMongoClient).toHaveBeenCalledTimes(2);
	});
});
