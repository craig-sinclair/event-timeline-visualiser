vi.mock("@/lib/mongoose", () => ({
	dbConnect: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/services/authService", () => ({
	findUserByEmailOrPhone: vi.fn(),
}));

vi.mock("@/services/passwordService", () => ({
	comparePassword: vi.fn(),
}));

vi.mock("next-auth/next", () => ({
	default: vi.fn((config) => config),
}));

vi.mock("next-auth/providers/credentials", () => ({
	default: vi.fn((config) => config),
}));

import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { dbConnect } from "@/lib/mongoose";
import { findUserByEmailOrPhone } from "@/services/authService";
import { comparePassword } from "@/services/passwordService";

import "@/app/api/auth/[...nextauth]/route";

type NextAuthConfig = {
	session: { strategy: string };
	pages: { signIn: string };
	callbacks: {
		jwt: (params: {
			token: Record<string, unknown>;
			user?: Record<string, unknown>;
		}) => Promise<Record<string, unknown>>;
		session: (params: {
			session: { user: Record<string, unknown> };
			token: Record<string, unknown>;
		}) => Promise<{ user: Record<string, unknown> }>;
	};
};

type ProviderConfig = {
	id: string;
	authorize: (credentials: Record<string, string>) => Promise<unknown>;
};

const config = (NextAuth as unknown as ReturnType<typeof vi.fn>).mock.calls[0][0] as NextAuthConfig;
const providerConfig = (CredentialsProvider as unknown as ReturnType<typeof vi.fn>).mock
	.calls[0][0] as ProviderConfig;

describe("Next auth API tests", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("configures jwt session strategy", () => {
		expect(config.session.strategy).toBe("jwt");
	});

	it("sets the signIn page to /signin", () => {
		expect(config.pages.signIn).toBe("/signin");
	});

	it("registers a single credentials provider with id email-password", () => {
		expect(providerConfig.id).toBe("email-password");
	});

	it("calls dbConnect during authorization", async () => {
		vi.mocked(findUserByEmailOrPhone).mockResolvedValue(null);

		await providerConfig.authorize({ email: "user@example.com", password: "password123" });

		expect(dbConnect).toHaveBeenCalledOnce();
	});

	it("looks up the user by email during authorization", async () => {
		vi.mocked(findUserByEmailOrPhone).mockResolvedValue(null);

		await providerConfig.authorize({ email: "user@example.com", password: "password123" });

		expect(findUserByEmailOrPhone).toHaveBeenCalledWith("user@example.com");
	});

	it("returns null when no user is found", async () => {
		vi.mocked(findUserByEmailOrPhone).mockResolvedValue(null);

		const result = await providerConfig.authorize({
			email: "user@example.com",
			password: "password123",
		});

		expect(result).toBeNull();
	});

	it("does not check password when no user is found", async () => {
		vi.mocked(findUserByEmailOrPhone).mockResolvedValue(null);

		await providerConfig.authorize({ email: "user@example.com", password: "password123" });

		expect(comparePassword).not.toHaveBeenCalled();
	});

	it("returns null when the password is invalid", async () => {
		vi.mocked(findUserByEmailOrPhone).mockResolvedValue({
			_id: { toString: () => "abc123" },
			email: "user@example.com",
			displayName: "Test User",
			passwordHash: "hashed",
		});
		vi.mocked(comparePassword).mockResolvedValue(false);

		const result = await providerConfig.authorize({
			email: "user@example.com",
			password: "wrongpassword",
		});

		expect(result).toBeNull();
	});

	it("compares the provided password against the stored hash", async () => {
		vi.mocked(findUserByEmailOrPhone).mockResolvedValue({
			_id: { toString: () => "abc123" },
			email: "user@example.com",
			displayName: "Test User",
			passwordHash: "hashed",
		});
		vi.mocked(comparePassword).mockResolvedValue(false);

		await providerConfig.authorize({ email: "user@example.com", password: "password123" });

		expect(comparePassword).toHaveBeenCalledWith("password123", "hashed");
	});

	it("returns the user object when credentials are valid", async () => {
		vi.mocked(findUserByEmailOrPhone).mockResolvedValue({
			_id: { toString: () => "abc123" },
			email: "user@example.com",
			displayName: "Test User",
			passwordHash: "hashed",
		});
		vi.mocked(comparePassword).mockResolvedValue(true);

		const result = await providerConfig.authorize({
			email: "user@example.com",
			password: "correctpassword",
		});

		expect(result).toEqual({
			id: "abc123",
			email: "user@example.com",
			displayName: "Test User",
		});
	});

	it("adds id and displayName to the token when user is present", async () => {
		const token = await config.callbacks.jwt({
			token: {},
			user: { id: "abc123", displayName: "Test User" },
		});

		expect(token.id).toBe("abc123");
		expect(token.displayName).toBe("Test User");
	});

	it("does not modify the token when no user is provided", async () => {
		const token = await config.callbacks.jwt({ token: { id: "existing" } });

		expect(token.id).toBe("existing");
	});

	it("adds id and displayName to the session user from the token", async () => {
		const result = await config.callbacks.session({
			session: { user: {} },
			token: { id: "abc123", displayName: "Test User" },
		});

		expect(result.user.id).toBe("abc123");
		expect(result.user.displayName).toBe("Test User");
	});

	it("does not modify the session when token has no id", async () => {
		const result = await config.callbacks.session({
			session: { user: { id: "original" } },
			token: {},
		});

		expect(result.user.id).toBe("original");
	});
});
