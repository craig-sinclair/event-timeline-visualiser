import { NextResponse } from "next/server";

import { dbConnect } from "@/lib/mongoose";
import User from "@/models/user";
import { hashPassword } from "@/services/passwordService";

export async function POST(req: Request) {
	try {
		const { email, password } = await req.json();
		await dbConnect();

		const existing = await User.findOne({ email });
		if (existing) {
			return NextResponse.json({ message: "User already exists" }, { status: 400 });
		}

		const hashed = await hashPassword(password);
		const user = await User.create({
			email,
			passwordHash: hashed,
			authProvider: "password",
			gdprConsent: true,
			profileCompleted: false,
		});

		return NextResponse.json({ message: "User created", user });
	} catch (error) {
		console.error("Signup error:", error);
		return NextResponse.json({ message: "Internal server error" }, { status: 500 });
	}
}
