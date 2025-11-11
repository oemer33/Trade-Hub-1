"use client";

import axios from "axios";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");
    const formData = new FormData(e.currentTarget);
    try {
      await axios.post("/api/auth/register", {
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password")
      });
      setSuccess("Registrierung erfolgreich. Bitte E-Mail zur Verifizierung prüfen.");
      setTimeout(() => router.push("/auth/login"), 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || "Fehler bei der Registrierung.");
    }
  }

  return (
    <div className="max-w-sm mx-auto bg-white border border-slate-200 rounded-2xl p-5 mt-6 space-y-4">
      <h1 className="text-xl font-semibold">Konto erstellen</h1>
      {error && <div className="text-xs text-red-500">{error}</div>}
      {success && <div className="text-xs text-green-600">{success}</div>}
      <form onSubmit={handleSubmit} className="space-y-3 text-xs">
        <input name="name" placeholder="Name" required className="w-full border px-3 py-2 rounded-md" />
        <input name="email" type="email" placeholder="E-Mail" required className="w-full border px-3 py-2 rounded-md" />
        <input name="password" type="password" placeholder="Passwort" required className="w-full border px-3 py-2 rounded-md" />
        <button className="btn-primary w-full">Registrieren</button>
      </form>
    </div>
  );
}
