"use client";

import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      redirect: false,
      email: formData.get("email"),
      password: formData.get("password")
    });
    if (res?.error) {
      setError("Login fehlgeschlagen. Bitte prüfen.");
    } else {
      router.push("/");
    }
  }

  return (
    <div className="max-w-sm mx-auto bg-white border border-slate-200 rounded-2xl p-5 mt-6 space-y-4">
      <h1 className="text-xl font-semibold">Login bei TradeHub</h1>
      {error && <div className="text-xs text-red-500">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-3 text-xs">
        <input name="email" type="email" placeholder="E-Mail" required className="w-full border px-3 py-2 rounded-md" />
        <input name="password" type="password" placeholder="Passwort" required className="w-full border px-3 py-2 rounded-md" />
        <button className="btn-primary w-full">Einloggen</button>
      </form>
    </div>
  );
}
