"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignInForm() {
	const router = useRouter();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleEmailPasswordLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		const res = await signIn("email-password", {
			redirect: false,
			email,
			password,
			callbackUrl: "/",
		});

		setLoading(false);
		if (res?.error) {
			setError("Invalid email or password. Please try again.");
		} else {
			router.push("/dashboard");
		}
	};

	return (
		<div className="flex flex-col items-center justify-center p-6 space-y-8">
			<h1 className="text-3xl font-bold">Sign In</h1>

			{error && <p className="text-red-500">{error}</p>}

			<form
				onSubmit={handleEmailPasswordLogin}
				className="space-y-4 p-6 rounded shadow max-w-xl"
			>
				<h2 className="text-xl font-semibold">Email + Password</h2>

				<input
					type="email"
					value={email}
					placeholder="Email"
					onChange={(e) => setEmail(e.target.value)}
					className="border rounded w-full p-2"
					required
				/>

				<input
					type="password"
					value={password}
					placeholder="Password"
					onChange={(e) => setPassword(e.target.value)}
					className="border rounded w-full p-2"
					required
				/>

				<button
					type="submit"
					disabled={loading}
					className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 flex items-center justify-center transition-opacity duration-150"
				>
					{loading ? (
						<div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
					) : (
						"Sign In"
					)}
				</button>

				<p className="text-md">
					Haven&apos;t created an account yet? Register{" "}
					<a className="text-blue-500" href="/signup">
						here
					</a>
				</p>
			</form>
		</div>
	);
}
