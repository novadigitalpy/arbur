"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function Home() {
  const [status, setStatus] = useState("Comprobando conexión...");

  useEffect(() => {
    async function checkSupabase() {
      const supabase = createClient();

      const { error } = await supabase.auth.getSession();

      if (error) {
        setStatus(`Error de conexión: ${error.message}`);
        return;
      }

      setStatus("Supabase conectado correctamente ✅");
    }

    checkSupabase();
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center shadow-xl">
        <h1 className="mb-4 text-4xl font-bold text-white">
          ARBUR
        </h1>

        <p className="text-lg text-slate-300">
          Plataforma de servicios a domicilio
        </p>

        <div className="mt-8 rounded-xl bg-slate-800 px-6 py-4">
          <p className="text-green-400">
            {status}
          </p>
        </div>
      </div>
    </main>
  );
}