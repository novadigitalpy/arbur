"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ProfessionalSetupPage() {
  const supabase = createClient();

  const [businessName, setBusinessName] = useState("");
  const [professionalName, setProfessionalName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [department, setDepartment] = useState("");
  const [city, setCity] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [address, setAddress] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    const {
  data: { session },
  error: sessionError,
} = await supabase.auth.getSession();

if (sessionError) {
  setMessage(`Error de sesión: ${sessionError.message}`);
  setLoading(false);
  return;
}

if (!session?.user) {
  setMessage(
    "No hay una sesión iniciada. Cerrá esta página e iniciá sesión nuevamente."
  );
  setLoading(false);
  return;
}

const user = session.user;

    const { error } = await supabase
      .from("professional_profiles")
      .insert({
        user_id: user.id,
        business_name: businessName,
        professional_name: professionalName,
        category,
        description,
        phone,
        whatsapp,
        department,
        city,
        neighborhood,
        address,
        is_available: true,
      });

    if (error) {
      setMessage(`Error al guardar: ${error.message}`);
      setLoading(false);
      return;
    }

    setMessage("Perfil profesional guardado correctamente ✅");
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold">ARBUR</h1>

          <h2 className="mt-4 text-2xl font-bold">
            Configurá tu perfil profesional
          </h2>

          <p className="mt-2 text-slate-400">
            Completá tus datos para que los clientes puedan conocerte y
            encontrarte.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl"
        >
          <div>
            <h3 className="text-lg font-semibold">Información profesional</h3>
            <p className="mt-1 text-sm text-slate-400">
              Estos datos formarán parte de tu perfil público.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm">Nombre comercial</label>
            <input
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Ej: González Electricidad"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm">
              Nombre del profesional
            </label>
            <input
              required
              value={professionalName}
              onChange={(e) => setProfessionalName(e.target.value)}
              placeholder="Tu nombre"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm">Categoría</label>
            <select
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-blue-500"
            >
              <option value="">Seleccioná una categoría</option>
              <option value="electricidad">Electricidad</option>
              <option value="plomeria">Plomería</option>
              <option value="limpieza">Limpieza</option>
              <option value="pintura">Pintura</option>
              <option value="reparaciones">Reparaciones</option>
              <option value="jardineria">Jardinería</option>
              <option value="tecnologia">Tecnología</option>
              <option value="automotriz">Automotriz</option>
              <option value="belleza">Belleza</option>
              <option value="otros">Otros</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm">
              Descripción de tus servicios
            </label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Contá brevemente qué servicios ofrecés y qué experiencia tenés."
              rows={4}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div className="border-t border-slate-800 pt-6">
            <h3 className="mb-4 text-lg font-semibold">Contacto</h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm">Teléfono</label>
                <input
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+595..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm">WhatsApp</label>
                <input
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+595..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-6">
            <h3 className="mb-4 text-lg font-semibold">Zona de trabajo</h3>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm">Departamento</label>
                <input
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Ej: Alto Paraná"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm">Ciudad</label>
                  <input
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ej: Santa Rita"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm">Barrio / Zona</label>
                  <input
                    required
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    placeholder="Ej: Centro"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm">Dirección</label>
                <input
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Dirección donde trabajás o recibís clientes"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold hover:bg-blue-500 disabled:opacity-50"
          >
            {loading
              ? "Guardando perfil..."
              : "Guardar mi perfil profesional"}
          </button>

          {message && (
            <div className="rounded-xl bg-slate-800 p-4 text-sm text-slate-300">
              {message}
            </div>
          )}
        </form>
      </div>
    </main>
  );
}