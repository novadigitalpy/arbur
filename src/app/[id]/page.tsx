"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Profile = {
  id: string;
  user_id: string;
  business_name: string | null;
  professional_name: string | null;
  category: string | null;
  description: string | null;
  phone: string | null;
  whatsapp: string | null;
  country: string | null;
  department: string | null;
  city: string | null;
  neighborhood: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  profile_image_url: string | null;
  is_available: boolean | null;
};

type Service = {
  service_id: string;
  professional_id: string;
  name: string;
  description: string | null;
  price: number | null;
  category: string | null;
  is_available: boolean;
  created_at?: string;
};

export default function PublicProfessionalProfilePage() {
  const supabase = createClient();

  const params = useParams();
  const router = useRouter();

  const professionalId =
    typeof params?.id === "string" ? params.id : "";

  const [profile, setProfile] = useState<Profile | null>(null);
  const [services, setServices] = useState<Service[]>([]);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadPublicProfile() {
      if (!professionalId) {
        setErrorMessage("No se identificó el profesional.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setErrorMessage("");

      try {
        // =====================================================
        // 1. CARGAR PERFIL PROFESIONAL
        // =====================================================

        const {
          data: profileData,
          error: profileError,
        } = await supabase
          .from("professional_profiles")
          .select(`
            id,
            user_id,
            business_name,
            professional_name,
            category,
            description,
            phone,
            whatsapp,
            country,
            department,
            city,
            neighborhood,
            address,
            latitude,
            longitude,
            profile_image_url,
            is_available
          `)
          .eq("user_id", professionalId)
          .single();

        if (profileError) {
          throw new Error(
            `Error al cargar el perfil: ${profileError.message}`
          );
        }

        if (!profileData) {
          throw new Error(
            "No encontramos el perfil profesional."
          );
        }

        const loadedProfile = profileData as Profile;

        setProfile(loadedProfile);

        // =====================================================
        // 2. CARGAR SOLAMENTE SERVICIOS ACTIVOS
        // =====================================================

        const {
          data: servicesData,
          error: servicesError,
        } = await supabase
          .from("professional_services")
          .select(`
            service_id,
            professional_id,
            name,
            description,
            price,
            category,
            is_available,
            created_at
          `)
          .eq("professional_id", professionalId)
          .eq("is_available", true)
          .order("created_at", {
            ascending: false,
          });

        if (servicesError) {
          throw new Error(
            `Error al cargar los servicios: ${servicesError.message}`
          );
        }

        setServices((servicesData ?? []) as Service[]);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Ocurrió un error inesperado.";

        setErrorMessage(message);
      } finally {
        setLoading(false);
      }
    }

    void loadPublicProfile();
  }, [professionalId]);

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#160A29] text-white">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-orange-500/30 blur-[120px]" />

        <div className="absolute -right-40 top-20 h-96 w-96 rounded-full bg-violet-600/30 blur-[120px]" />

        <div className="relative z-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-2xl font-black text-[#160A29] shadow-2xl">
            A
          </div>

          <div className="mx-auto mt-6 h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-orange-400" />

          <p className="mt-5 text-sm text-white/70">
            Cargando perfil...
          </p>
        </div>
      </main>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (errorMessage || !profile) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#160A29] px-4 text-white">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-orange-500/20 blur-[120px]" />

        <div className="absolute -right-40 top-20 h-96 w-96 rounded-full bg-violet-600/20 blur-[120px]" />

        <div className="relative z-10 w-full max-w-lg rounded-[28px] border border-white/10 bg-white p-8 text-center shadow-2xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-2xl">
            ⚠️
          </div>

          <h1 className="mt-5 text-2xl font-black text-[#090712]">
            Perfil no disponible
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            {errorMessage ||
              "No pudimos encontrar este profesional."}
          </p>

          <button
            type="button"
            onClick={() => router.back()}
            className="mt-6 rounded-xl bg-[#160A29] px-6 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#241040]"
          >
            ← Volver
          </button>
        </div>
      </main>
    );
  }

  // =========================================================
  // DATOS PARA MOSTRAR
  // =========================================================

  const location = [
    profile.city,
    profile.department,
  ]
    .filter(Boolean)
    .join(", ");

  const whatsappNumber =
    profile.whatsapp?.replace(/\D/g, "") || "";

  // =========================================================
  // INTERFAZ PÚBLICA
  // =========================================================

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#160A29] text-[#090712]">
      {/* =====================================================
          FONDO
      ====================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-48 -top-48 h-[650px] w-[650px] rounded-full bg-orange-500/25 blur-[150px]" />

        <div className="absolute -right-48 top-[-100px] h-[700px] w-[700px] rounded-full bg-violet-600/25 blur-[160px]" />

        <div className="absolute bottom-[-300px] left-[10%] h-[600px] w-[600px] rounded-full bg-orange-600/15 blur-[160px]" />

        <div className="absolute bottom-[-250px] right-[10%] h-[600px] w-[600px] rounded-full bg-fuchsia-600/15 blur-[160px]" />
      </div>

      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#160A29]/85 backdrop-blur-xl">
        <div className="mx-auto flex min-h-[76px] max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-xl">
              <span className="text-xl font-black text-[#160A29]">
                A
              </span>
            </div>

            <div>
              <h1 className="text-xl font-black text-white">
                ARBUR
              </h1>

              <p className="text-xs text-white/50">
                Profesionales a domicilio
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:border-orange-400/50 hover:bg-orange-500/10"
          >
            ← Volver
          </button>
        </div>
      </header>

      {/* =====================================================
          CONTENIDO
      ====================================================== */}

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        {/* ===================================================
            HERO DEL PROFESIONAL
        ==================================================== */}

        <section className="overflow-hidden rounded-[32px] border border-white/15 bg-white shadow-[0_30px_100px_rgba(0,0,0,0.35)]">
          <div className="relative overflow-hidden bg-gradient-to-br from-[#160A29] via-[#4B176B] to-[#F05A24] px-6 py-10 sm:px-10 sm:py-14">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-orange-400/30 blur-[90px]" />

            <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-violet-500/30 blur-[90px]" />

            <div className="relative flex flex-col gap-8 sm:flex-row sm:items-center">
              {/* FOTO */}

              <div className="flex shrink-0 justify-center sm:justify-start">
                {profile.profile_image_url ? (
                  <img
                    src={profile.profile_image_url}
                    alt={
                      profile.professional_name ||
                      "Profesional ARBUR"
                    }
                    className="h-28 w-28 rounded-[28px] object-cover shadow-2xl ring-4 ring-white/20 sm:h-36 sm:w-36"
                  />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-[28px] bg-white text-4xl font-black text-[#160A29] shadow-2xl ring-4 ring-white/20 sm:h-36 sm:w-36 sm:text-5xl">
                    {(
                      profile.business_name ||
                      profile.professional_name ||
                      "A"
                    )
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                )}
              </div>

              {/* INFORMACIÓN */}

              <div className="min-w-0 flex-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <span className="rounded-full bg-[#FFF3D6] px-3 py-1 text-xs font-black uppercase tracking-wider text-[#9A6B00]">
                    {profile.category || "Profesional"}
                  </span>

                  {profile.is_available !== false && (
                    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-100">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      Disponible
                    </span>
                  )}
                </div>

                <p className="mt-4 text-xs font-black uppercase tracking-[0.18em] text-white/50">
                  Profesional ARBUR
                </p>

                <h2 className="mt-1 text-3xl font-black tracking-tight text-white sm:text-5xl">
                  {profile.business_name ||
                    profile.professional_name ||
                    "Profesional"}
                </h2>

                {profile.business_name &&
                  profile.professional_name && (
                    <p className="mt-2 text-sm font-medium text-white/75 sm:text-base">
                      {profile.professional_name}
                    </p>
                  )}

                {location && (
                  <div className="mt-5 flex items-center justify-center gap-2 text-sm text-white/80 sm:justify-start">
                    <span>📍</span>
                    <span>{location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* =================================================
              INFORMACIÓN + CONTACTO
          ================================================== */}

          <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#D6A62A]">
                Sobre el profesional
              </p>

              <h3 className="mt-2 text-2xl font-black">
                Conocé su trabajo
              </h3>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
                {profile.description ||
                  "Este profesional todavía no agregó una descripción."}
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {location && (
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Zona de trabajo
                    </p>

                    <p className="mt-2 text-sm font-bold text-[#090712]">
                      📍 {location}
                    </p>

                    {profile.neighborhood && (
                      <p className="mt-1 text-xs text-slate-500">
                        {profile.neighborhood}
                      </p>
                    )}
                  </div>
                )}

                {profile.phone && (
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Teléfono
                    </p>

                    <p className="mt-2 text-sm font-bold text-[#090712]">
                      {profile.phone}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* CONTACTO */}

            <div className="flex min-w-[230px] flex-col justify-center gap-3">
              {profile.whatsapp && (
                <a
                  href={
                    whatsappNumber
                      ? `https://wa.me/${whatsappNumber}`
                      : "#"
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-2xl bg-emerald-500 px-6 py-4 text-center text-sm font-black text-white shadow-lg shadow-emerald-500/20 transition hover:-translate-y-1 hover:bg-emerald-400 hover:shadow-xl"
                >
                  💬 Contactar por WhatsApp
                </a>
              )}

              {profile.phone && (
                <a
                  href={`tel:${profile.phone}`}
                  className="rounded-2xl border border-slate-200 bg-white px-6 py-4 text-center text-sm font-black text-[#160A29] transition hover:-translate-y-1 hover:bg-slate-50"
                >
                  📞 Llamar
                </a>
              )}
            </div>
          </div>
        </section>

        {/* ===================================================
            SERVICIOS
        ==================================================== */}

        <section className="mt-10">
          <div className="mb-6">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#D6A62A]">
              Servicios
            </p>

            <h3 className="mt-1 text-3xl font-black text-white">
              Lo que ofrece
            </h3>

            <p className="mt-2 text-sm text-white/60">
              Servicios actualmente disponibles para clientes.
            </p>
          </div>

          {services.length === 0 ? (
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-10 text-center backdrop-blur-xl">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-2xl">
                🛠️
              </div>

              <h4 className="mt-5 text-xl font-black text-white">
                Todavía no hay servicios publicados
              </h4>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/50">
                Este profesional todavía no tiene servicios
                disponibles para mostrar.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <article
                  key={service.service_id}
                  className="group rounded-[26px] border border-white/10 bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.20)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_30px_80px_rgba(0,0,0,0.30)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFF3D6] to-orange-100 text-xl shadow-sm">
                      🛠️
                    </div>

                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-black text-emerald-600">
                      Disponible
                    </span>
                  </div>

                  <h4 className="mt-5 text-xl font-black text-[#090712]">
                    {service.name}
                  </h4>

                  {service.category && (
                    <span className="mt-2 inline-block rounded-full bg-[#FFF3D6] px-3 py-1 text-xs font-black text-[#9A6B00]">
                      {service.category}
                    </span>
                  )}

                  {service.description && (
                    <p className="mt-4 text-sm leading-6 text-slate-500">
                      {service.description}
                    </p>
                  )}

                  <div className="mt-6 border-t border-slate-100 pt-5">
                    {service.price !== null ? (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Precio desde
                        </p>

                        <p className="mt-1 text-2xl font-black text-[#160A29]">
                          Gs.{" "}
                          {Number(service.price).toLocaleString(
                            "es-PY"
                          )}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm font-bold text-slate-500">
                        Precio a consultar
                      </p>
                    )}
                  </div>

                  {profile.whatsapp && (
                    <a
                      href={
                        whatsappNumber
                          ? `https://wa.me/${whatsappNumber}`
                          : "#"
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="mt-5 block rounded-xl bg-[#160A29] px-4 py-3 text-center text-sm font-black text-white transition hover:bg-[#281044]"
                    >
                      Consultar servicio
                    </a>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>

        {/* ===================================================
            FOOTER
        ==================================================== */}

        <footer className="py-10 text-center">
          <p className="text-xs text-white/35">
            Perfil profesional publicado en ARBUR
          </p>
        </footer>
      </div>
    </main>
  );
}