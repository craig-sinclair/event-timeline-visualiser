
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      // Call your API route to create the user
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to sign up");
      }

      // Automatically sign in the user after signup
      await signIn("credentials", { email, password, redirect: false });
      router.push("/profile-setup"); // redirect to profile setup
    } 
    catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
      else {
        setError("Sorry, an unknown error occurred during signup, please try again!")
      }
    } 
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-8">
      <h1 className="text-3xl font-bold">Sign Up</h1>

      {error && <p className="text-red-500">{error}</p>}

      <form
        onSubmit={handleSubmit}
        className="space-y-4 p-6 rounded shadow max-w-xl"
      >

        <h2 className="text-xl font-semibold">Email + Password</h2>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="border rounded w-full p-2"
          required
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="border rounded w-full p-2"
          required
        />

        <input
          type="password"
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
          placeholder="Confirm password"
          className="border rounded w-full p-2"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 cursor-pointer"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        <p className="text-md">Already have an account? Login <a className="text-blue-500" href="/signin">here</a></p>
      </form>
    </div>
  );
}
