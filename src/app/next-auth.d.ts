import "next-auth";

declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			displayName?: string | null;
			email?: string | null;
			image?: string | null;
		};
	}

	interface User {
		id: string;
		displayName?: string | null;
	}

	interface JWT {
		id: string;
		displayName?: string | null;
	}
}
