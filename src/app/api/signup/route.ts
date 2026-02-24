import { NextResponse } from "next/server";

import { dbConnect } from "@/lib/mongoose";
import { validateEmail, validatePassword, validateDisplayName } from "@/lib/validateSignUpFields";
import User from "@/models/user";
import { hashPassword } from "@/services/passwordService";

export async function POST(req: Request) {
	const { email, password, displayName } = await req.json();

	const validEmail = validateEmail({ newEmail: email });
	if (!validEmail) {
		return NextResponse.json(
			{ message: "Please provide a valid e-mail address." },
			{ status: 500 }
		);
	}

	const passwordError = validatePassword({ newPassword: password });
	if (passwordError) {
		return NextResponse.json({ message: passwordError }, { status: 500 });
	}

	const displayNameError = validateDisplayName({ newDisplayName: displayName });
	if (displayNameError) {
		return NextResponse.json({ message: passwordError }, { status: 500 });
	}

	try {
		await dbConnect();

		const existing = await User.findOne({ email });
		if (existing) {
			return NextResponse.json({ message: "User already exists" }, { status: 400 });
		}

		const hashed = await hashPassword(password);
		await User.create({
			email,
			passwordHash: hashed,
			authProvider: "password",
			displayName: displayName,
		});

		return NextResponse.json({ message: "User created" }, { status: 201 });
	} catch (error) {
		console.error("Signup error:", error);
		return NextResponse.json({ message: "Internal server error" }, { status: 500 });
	}
}
