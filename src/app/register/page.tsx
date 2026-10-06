"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const supabase = createClient();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"client" | "professional">("client");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  

    setLoading(true);
    setMessage("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone,
          role,
        },
      },
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    // Si Supabase devuelve una sesión inmediatamente,
    // podemos continuar directamente.
    if (data.session) {
      if (role === "professional") {
        router.push("/professional/setup");
      } else {
        router.push("/");
      }

      return;
    }

    // Si está activada la confirmación por correo,
    // Supabase crea el usuario pero todavía no hay sesión.
    setMessage(
      "Cuenta creada correctamente. Revisá tu correo, confirmá tu cuenta y después iniciá sesión."
    );

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-md">

        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold">ARBUR</h1>

          <p className="mt-3 text-slate-400">
            Creá tu cuenta y empezá a usar ARBUR
          </p>
        </div>

        <form
          onSubmit={handleRegister}
          className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl"
        >

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Nombre completo
            </label>

            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-blue-500"
              placeholder="Tu nombre"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Teléfono
            </label>

            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-blue-500"
              placeholder="+595..."
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Correo electrónico
            </label>

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-blue-500"
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Contraseña
            </label>

            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-blue-500"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div>
            <label className="mb-3 block text-sm text-slate-300">
              ¿Cómo vas a utilizar ARBUR?
            </label>

            <div className="grid grid-cols-2 gap-3">

              <button
                type="button"
                onClick={() => setRole("client")}
                className={`rounded-xl border px-4 py-3 ${
                  role === "client"
                    ? "border-blue-500 bg-blue-500/20"
                    : "border-slate-700 bg-slate-800"
                }`}
              >
                Buscar servicios
              </button>

              <button
                type="button"
                onClick={() => setRole("professional")}
                className={`rounded-xl border px-4 py-3 ${
                  role === "professional"
                    ? "border-blue-500 bg-blue-500/20"
                    : "border-slate-700 bg-slate-800"
                }`}
              >
                Ofrecer servicios
              </button>

            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold transition hover:bg-blue-500 disabled:opacity-50"
          >
            {loading ? "Creando cuenta..." : "Crear mi cuenta"}
          </button>

          {message && (
            <div className="rounded-xl bg-slate-800 p-4 text-center text-sm text-slate-300">
              {message}
            </div>
          )}

          <div className="text-center text-sm text-slate-400">
            ¿Ya tenés una cuenta?{" "}
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="font-semibold text-blue-400 hover:text-blue-300"
            >
              Iniciar sesión
            </button>
          </div>

        </form>
      </div>
    </main>
  );
}