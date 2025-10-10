"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

const errorMessages: Record<string, string> = {
  CredentialsSignin: "Invalid email or password. Please try again.",
  EmailSignin: "Email sign-in failed. Please check your inbox or try again.",
  OAuthSignin: "OAuth sign-in failed. Please try a different provider.",
  OAuthCallback: "OAuth callback error. Please try again.",
  AccessDenied: "Access denied. You do not have permission to sign in.",
  Configuration: "Authentication configuration error. Contact support.",
  Verification: "Email verification failed. Please request a new link.",
};

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const errorCode = searchParams.get("error");
    if (errorCode && errorMessages[errorCode]) {
      setError(errorMessages[errorCode]);
    }
  }, [searchParams]);

  const handleEmailPasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("email-password", {
      redirect: false,
      email,
      password,
      gdprConsent: true,
      callbackUrl: "/profile",
    });

    setLoading(false);

    if (res?.error) {
      setError(errorMessages[res.error] || "Invalid email or password");
    } 
    else {
      router.push("/profile");
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
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 cursor-pointer"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p className="text-md">Haven&apos;t created an account yet? Register <a className="text-blue-500" href="/signup">here</a></p>
      </form>
    </div>
  );
}
