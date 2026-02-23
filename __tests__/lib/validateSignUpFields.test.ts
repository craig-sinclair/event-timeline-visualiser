import { describe, it, expect } from "vitest";

import { validatePassword } from "@/lib/validateSignUpFields";
import { MIN_PASSWORD_SIZE } from "@/utils/auth.const";

describe("Validate password function tests", () => {
	it("Correctly handles input smaller than min password size", () => {
		const incorrectPassword = "a".repeat(MIN_PASSWORD_SIZE - 1);
		const result = validatePassword({ newPassword: incorrectPassword });
		expect(result).toEqual("Password must contain at least 6 characters.");
	});

	it("Correctly handles missing uppercase letter", () => {
		const incorrectPassword = "test123123123";
		const result = validatePassword({ newPassword: incorrectPassword });
		expect(result).toEqual("Password must contain at least one uppercase letter.");
	});

	it("Correctly handles missing numerical character", () => {
		const incorrectPassword = "TESTTESTTESTTEST";
		const result = validatePassword({ newPassword: incorrectPassword });
		expect(result).toEqual("Password must contain at least one numerical value.");
	});

	it("Correctly handles valid password", () => {
		const correctPassword = "Test123Test123";
		const result = validatePassword({ newPassword: correctPassword });
		expect(result).toEqual(null);
	});
});
