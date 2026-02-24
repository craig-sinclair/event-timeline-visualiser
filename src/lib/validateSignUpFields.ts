import { MIN_PASSWORD_SIZE, MAX_DISPLAY_NAME_LENGTH } from "@/utils/auth.const";

export function validatePassword({ newPassword }: { newPassword: string }) {
	if (newPassword.length < MIN_PASSWORD_SIZE)
		return `Password must contain at least ${MIN_PASSWORD_SIZE} characters.`;
	if (!/[A-Z]/.test(newPassword)) return "Password must contain at least one uppercase letter.";
	if (!/[0-9]/.test(newPassword)) return "Password must contain at least one numerical value.";

	return null;
}

export function validateEmail({ newEmail }: { newEmail: string }): boolean {
	/*
    Ensures there is:
    - One or more characters preceding @ symbol
    - One or more characters after @ symbol
    - A dot character present 
    - One or more characters after dot
    */
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail);
}

export function validateDisplayName({ newDisplayName }: { newDisplayName: string }) {
	if (newDisplayName.length > MAX_DISPLAY_NAME_LENGTH)
		return `Display name has max. length of ${MAX_DISPLAY_NAME_LENGTH} characters.`;
	if (newDisplayName.length == 0) return "Display name field empty.";

	return null;
}
