import { NextResponse } from "next/server";

import { dbConnect } from "@/lib/mongoose";
import User, { IUser } from "@/models/user";

export async function POST(req: Request) {
	try {
		const { id, name, nickname, phone, onboardingStep } = await req.json();
		if (!id) {
			return NextResponse.json({ message: "User ID is required" }, { status: 400 });
		}

		await dbConnect();

		const update: Partial<IUser> = {};
		if (name !== undefined) update.name = name;
		if (nickname !== undefined) update.nickname = nickname;
		if (phone !== undefined) update.phone = phone;
		if (onboardingStep !== undefined) update.onboardingStep = onboardingStep;
		update.updatedAt = new Date();

		const user = await User.findByIdAndUpdate(id, update, { new: true });
		if (!user) {
			return NextResponse.json({ message: "User not found" }, { status: 404 });
		}

		return NextResponse.json(
			{ message: "Profile updated successfully", user },
			{ status: 200 }
		);
	} catch (err) {
		const error = err instanceof Error ? err : new Error("Unknown error");
		return NextResponse.json(
			{ message: error.message || "Internal Server Error" },
			{ status: 500 }
		);
	}
}
