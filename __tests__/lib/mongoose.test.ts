import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mockMongooseInstance = { conn: null, promise: null };
const mockConnect = vi.fn().mockResolvedValue(mockMongooseInstance);

vi.mock("mongoose", () => ({
	default: {
		connect: mockConnect,
	},
}));

async function importModule() {
	return import("@/lib/mongoose");
}

describe("Mongoose client (dbConnect) unit tests", () => {
	beforeEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
		vi.stubEnv("MONGODB_URI", "mongodb://localhost:27017/test");
		delete global.mongoose;
	});

	afterEach(() => {
		vi.unstubAllEnvs();
		delete global.mongoose;
	});

	it("throws when MONGODB_URI is not set", async () => {
		vi.stubEnv("MONGODB_URI", "");
		await expect(importModule()).rejects.toThrow(
			"Please define the MONGODB_URI environment variable"
		);
	});

	it("calls mongoose.connect with the correct uri", async () => {
		const { dbConnect } = await importModule();
		await dbConnect();
		expect(mockConnect).toHaveBeenCalledWith("mongodb://localhost:27017/test");
	});

	it("returns the mongoose instance after connecting", async () => {
		const { dbConnect } = await importModule();
		const result = await dbConnect();
		expect(result).toBe(mockMongooseInstance);
	});

	it("only calls mongoose.connect once on multiple calls", async () => {
		const { dbConnect } = await importModule();
		await dbConnect();
		await dbConnect();
		expect(mockConnect).toHaveBeenCalledOnce();
	});

	it("returns the cached connection on subsequent calls", async () => {
		const { dbConnect } = await importModule();
		const first = await dbConnect();
		const second = await dbConnect();
		expect(first).toBe(second);
	});

	it("reuses an existing global mongoose cache", async () => {
		const existingConn = { existing: true } as unknown as import("mongoose").Mongoose;
		global.mongoose = { conn: existingConn, promise: null };
		const { dbConnect } = await importModule();
		const result = await dbConnect();
		expect(result).toBe(existingConn);
		expect(mockConnect).not.toHaveBeenCalled();
	});

	it("sets the connection on the global cache after connecting", async () => {
		const { dbConnect } = await importModule();
		await dbConnect();
		expect(global.mongoose?.conn).toBe(mockMongooseInstance);
	});

	it("stores the promise on the cache before the connection resolves", async () => {
		let resolveConnect!: (value: unknown) => void;
		mockConnect.mockReturnValueOnce(
			new Promise((res) => {
				resolveConnect = res;
			})
		);

		const { dbConnect } = await importModule();
		const connectCall = dbConnect();

		expect(global.mongoose?.promise).toBeInstanceOf(Promise);

		resolveConnect(mockMongooseInstance);
		await connectCall;
	});
});
