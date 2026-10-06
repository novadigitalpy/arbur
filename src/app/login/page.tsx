"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    if (!data.user) {
      setMessage("No se pudo iniciar sesión.");
      setLoading(false);
      return;
    }

    const role = data.user.user_metadata?.role;

    if (role === "professional") {
      router.push("/professional/setup");
    } else {
      router.push("/");
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-md">

        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold">
            ARBUR
          </h1>

          <p className="mt-3 text-slate-400">
            Iniciá sesión para continuar
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl"
        >

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Correo electrónico
            </label>

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Contraseña
            </label>

            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tu contraseña"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold transition hover:bg-blue-500 disabled:opacity-50"
          >
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>

          {message && (
            <div className="rounded-xl bg-slate-800 p-4 text-center text-sm text-slate-300">
              {message}
            </div>
          )}

          <div className="text-center text-sm text-slate-400">
            ¿Todavía no tenés una cuenta?{" "}
            <button
              type="button"
              onClick={() => router.push("/register")}
              className="font-semibold text-blue-400 hover:text-blue-300"
            >
              Crear cuenta
            </button>
          </div>

        </form>
      </div>
    </main>
  );
}