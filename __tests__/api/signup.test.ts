import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/mongoose", () => ({
	dbConnect: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/lib/circuitBreaker", () => ({
	mongoCircuitBreaker: {
		call: vi.fn((fn: () => unknown) => fn()),
	},
}));

vi.mock("@/lib/validateSignUpFields", () => ({
	validateEmail: vi.fn(),
	validatePassword: vi.fn(),
	validateDisplayName: vi.fn(),
}));

vi.mock("@/models/user", () => ({
	default: {
		findOne: vi.fn(),
		create: vi.fn(),
	},
}));

vi.mock("@/services/passwordService", () => ({
	hashPassword: vi.fn().mockResolvedValue("hashed_password"),
}));

import { POST } from "@/app/api/signup/route";
import { mongoCircuitBreaker } from "@/lib/circuitBreaker";
import { dbConnect } from "@/lib/mongoose";
import { validateEmail, validatePassword, validateDisplayName } from "@/lib/validateSignUpFields";
import User from "@/models/user";
import { hashPassword } from "@/services/passwordService";

function makeRequest(body: object): Request {
	return new Request("http://localhost/api/signup", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	});
}

const VALID_BODY = {
	email: "user@example.com",
	password: "P@ssw0rd!",
	displayName: "Test User",
};

describe("Signup API tests", () => {
	beforeEach(() => {
		vi.clearAllMocks();

		vi.mocked(validateEmail).mockReturnValue(true);
		vi.mocked(validatePassword).mockReturnValue(null);
		vi.mocked(validateDisplayName).mockReturnValue(null);

		vi.mocked(User.findOne).mockResolvedValue(null);
		vi.mocked(User.create).mockResolvedValue({} as never);
	});

	it("returns 500 when email is invalid", async () => {
		vi.mocked(validateEmail).mockReturnValue(false);

		const res = await POST(makeRequest(VALID_BODY));
		const body = await res.json();

		expect(res.status).toBe(500);
		expect(body.message).toBe("Please provide a valid e-mail address.");
	});

	it("does not call dbConnect when email is invalid", async () => {
		vi.mocked(validateEmail).mockReturnValue(false);

		await POST(makeRequest(VALID_BODY));

		expect(dbConnect).not.toHaveBeenCalled();
	});

	it("returns 500 with the validator's error message when password is invalid", async () => {
		vi.mocked(validatePassword).mockReturnValue("Password too weak.");

		const res = await POST(makeRequest(VALID_BODY));
		const body = await res.json();

		expect(res.status).toBe(500);
		expect(body.message).toBe("Password too weak.");
	});

	it("does not call dbConnect when password is invalid", async () => {
		vi.mocked(validatePassword).mockReturnValue("Password too weak.");

		await POST(makeRequest(VALID_BODY));

		expect(dbConnect).not.toHaveBeenCalled();
	});

	it("returns 500 with the validator's error message when displayName is invalid", async () => {
		vi.mocked(validateDisplayName).mockReturnValue("Display name too short.");

		const res = await POST(makeRequest(VALID_BODY));
		const body = await res.json();

		expect(res.status).toBe(500);
		expect(body.message).toBe("Display name too short.");
	});

	it("does not call dbConnect when displayName is invalid", async () => {
		vi.mocked(validateDisplayName).mockReturnValue("Display name too short.");

		await POST(makeRequest(VALID_BODY));

		expect(dbConnect).not.toHaveBeenCalled();
	});

	it("returns 400 when the email is already registered", async () => {
		vi.mocked(User.findOne).mockResolvedValue({ email: VALID_BODY.email });

		const res = await POST(makeRequest(VALID_BODY));
		const body = await res.json();

		expect(res.status).toBe(400);
		expect(body.message).toBe("User already exists");
	});

	it("does not create a user when one already exists", async () => {
		vi.mocked(User.findOne).mockResolvedValue({ email: VALID_BODY.email });

		await POST(makeRequest(VALID_BODY));

		expect(User.create).not.toHaveBeenCalled();
	});

	it("queries the DB with the provided email", async () => {
		await POST(makeRequest(VALID_BODY));

		expect(User.findOne).toHaveBeenCalledWith({ email: VALID_BODY.email });
	});

	it("returns 201 with a success message", async () => {
		const res = await POST(makeRequest(VALID_BODY));
		const body = await res.json();

		expect(res.status).toBe(201);
		expect(body.message).toBe("User created");
	});

	it("hashes the password before storing it", async () => {
		await POST(makeRequest(VALID_BODY));

		expect(hashPassword).toHaveBeenCalledWith(VALID_BODY.password);
	});

	it("creates the user with correct fields", async () => {
		await POST(makeRequest(VALID_BODY));

		expect(User.create).toHaveBeenCalledWith({
			email: VALID_BODY.email,
			passwordHash: "hashed_password",
			authProvider: "password",
			displayName: VALID_BODY.displayName,
		});
	});

	it("calls dbConnect before touching the database", async () => {
		await POST(makeRequest(VALID_BODY));

		expect(dbConnect).toHaveBeenCalledOnce();
	});

	it("runs the DB query through the circuit breaker", async () => {
		await POST(makeRequest(VALID_BODY));

		expect(mongoCircuitBreaker.call).toHaveBeenCalled();
	});

	it("returns 500 when dbConnect throws", async () => {
		vi.mocked(dbConnect).mockRejectedValueOnce(new Error("Mongo down"));

		const res = await POST(makeRequest(VALID_BODY));
		const body = await res.json();

		expect(res.status).toBe(500);
		expect(body.message).toBe("Internal server error");
	});

	it("returns 500 when User.create throws", async () => {
		vi.mocked(User.create).mockRejectedValueOnce(new Error("Write failed"));

		const res = await POST(makeRequest(VALID_BODY));
		const body = await res.json();

		expect(res.status).toBe(500);
		expect(body.message).toBe("Internal server error");
	});

	it("returns 500 when hashPassword throws", async () => {
		vi.mocked(hashPassword).mockRejectedValueOnce(new Error("Bcrypt error"));

		const res = await POST(makeRequest(VALID_BODY));
		const body = await res.json();

		expect(res.status).toBe(500);
		expect(body.message).toBe("Internal server error");
	});

	it("returns 500 when the circuit breaker throws", async () => {
		vi.mocked(mongoCircuitBreaker.call).mockRejectedValueOnce(new Error("Circuit open"));

		const res = await POST(makeRequest(VALID_BODY));
		const body = await res.json();

		expect(res.status).toBe(500);
		expect(body.message).toBe("Internal server error");
	});
});
