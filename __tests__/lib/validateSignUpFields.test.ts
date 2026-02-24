import { describe, it, expect } from "vitest";

import { validatePassword, validateEmail, validateDisplayName } from "@/lib/validateSignUpFields";
import { MIN_PASSWORD_SIZE, MAX_DISPLAY_NAME_LENGTH } from "@/utils/auth.const";

describe("Validate password function tests", () => {
	it("Correctly handles input smaller than min password size", () => {
		const incorrectPassword = "a".repeat(MIN_PASSWORD_SIZE - 1);
		const result = validatePassword({ newPassword: incorrectPassword });
		expect(result).toEqual(`Password must contain at least ${MIN_PASSWORD_SIZE} characters.`);
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

describe("Validate email function tests", () => {
	it("Correctly handles empty email string", () => {
		const result = validateEmail({ newEmail: "" });
		expect(result).toEqual(false);
	});

	it("Correctly handles missing @ symbol in email", () => {
		const result = validateEmail({ newEmail: "john.com" });
		expect(result).toEqual(false);
	});

	it("Correctly handles missing . symbol in email", () => {
		const result = validateEmail({ newEmail: "john@gmailcom" });
		expect(result).toEqual(false);
	});

	it("Correctly handles missing characters before @ symbol in email", () => {
		const result = validateEmail({ newEmail: "@gmail.com" });
		expect(result).toEqual(false);
	});

	it("Correctly handles missing characters after . symbol in email", () => {
		const result = validateEmail({ newEmail: "john@gmail." });
		expect(result).toEqual(false);
	});

	it("Correctly handles missing character after @ symbol in email", () => {
		const result = validateEmail({ newEmail: "john@" });
		expect(result).toEqual(false);
	});

	it("Correctly handles invalid email structure despite valid characters", () => {
		const result = validateEmail({ newEmail: "@gmailjohn." });
		expect(result).toEqual(false);
	});

	it("Correctly handles valid email address", () => {
		const result = validateEmail({ newEmail: "john@gmail.com" });
		expect(result).toEqual(true);
	});
});

describe("Validate display name tests", () => {
	it("Correctly handles empty display name", () => {
		const result = validateDisplayName({ newDisplayName: "" });
		expect(result).toEqual("Display name field empty.");
	});

	it("Correctly handles display names beyond max size", () => {
		const incorrectDisplayName = "a".repeat(MAX_DISPLAY_NAME_LENGTH + 1);
		const result = validateDisplayName({ newDisplayName: incorrectDisplayName });
		expect(result).toEqual(
			`Display name has max. length of ${MAX_DISPLAY_NAME_LENGTH} characters.`
		);
	});

	it("Correctly handles valid display names", () => {
		const result = validateDisplayName({ newDisplayName: "test" });
		expect(result).toEqual(null);
	});
});
