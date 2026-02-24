import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
	email: string;
	authProvider: "email" | "password";
	passwordHash: string;
	displayName: string;
}

const UserSchema = new Schema<IUser>(
	{
		email: {
			type: String,
			required: false,
			unique: true,
			sparse: true,
			lowercase: true,
			trim: true,
		},
		authProvider: {
			type: String,
			enum: ["email", "password"],
			default: "email",
			required: true,
		},
		passwordHash: {
			type: String,
			required: true,
		},
		displayName: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true, strict: true }
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
