import User, { IUser } from "@/models/user";

export async function findUserByEmailOrPhone(email?: string, phone?: string) {
	if (!email && !phone) return null;
	return User.findOne({
		$or: [...(email ? [{ email }] : []), ...(phone ? [{ phone }] : [])],
	}).exec();
}

export async function createUser(user: Partial<IUser>) {
	const newUser = new User(user);
	return newUser.save();
}
