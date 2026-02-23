import { MIN_PASSWORD_SIZE } from "@/utils/auth.const";

export function validatePassword({ newPassword }: { newPassword: string }) {
	if (newPassword.length < MIN_PASSWORD_SIZE)
		return "Password must contain at least 6 characters.";
	if (!/[A-Z]/.test(newPassword)) return "Password must contain at least one uppercase letter.";
	if (!/[0-9]/.test(newPassword)) return "Password must contain at least one numerical value.";

	return null;
}
