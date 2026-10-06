"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type ProfileData = {
  professional_name: string | null;
  business_name: string | null;
  is_available: boolean | null;
};

export default function ProfessionalDashboard() {
  const router = useRouter();

  // Cliente Supabase creado una sola vez.
  const [supabase] = useState(() => createClient());

  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [serviceCount, setServiceCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadDashboard() {
      try {
        setLoading(true);

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push("/login");
          return;
        }

        // ==================================================
        // 1. CARGAR PERFIL PROFESIONAL
        // ==================================================

        const {
          data: profile,
          error: profileError,
        } = await supabase
          .from("professional_profiles")
          .select(
            "professional_name, business_name, is_available"
          )
          .eq("user_id", user.id)
          .single();

        if (profileError) {
          console.error(
            "Error cargando perfil profesional:",
            profileError
          );
        }

        // ==================================================
        // 2. CONTAR SERVICIOS
        // ==================================================

        const {
          count,
          error: servicesError,
        } = await supabase
          .from("professional_services")
          .select("service_id", {
            count: "exact",
            head: true,
          })
          .eq("professional_id", user.id);

        if (servicesError) {
          console.error(
            "Error contando servicios:",
            servicesError
          );
        }

        if (!mounted) return;

        if (profile) {
          const profileData = profile as ProfileData;

          setName(profileData.professional_name || "");
          setBusinessName(profileData.business_name || "");

          setIsAvailable(
            profileData.is_available !== false
          );
        }

        setServiceCount(count ?? 0);
      } catch (error) {
        console.error(
          "Error cargando dashboard:",
          error
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, [supabase, router]);

  // ==================================================
  // CERRAR SESIÓN
  // ==================================================

  async function handleLogout() {
    try {
      setLoggingOut(true);

      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error(
          "Error cerrando sesión:",
          error
        );

        setLoggingOut(false);
        return;
      }

      router.push("/login");
    } catch (error) {
      console.error(
        "Error inesperado al cerrar sesión:",
        error
      );

      setLoggingOut(false);
    }
  }

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#160A29] text-white">

        <div className="pointer-events-none absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-orange-500/30 blur-[130px]" />

        <div className="pointer-events-none absolute -right-40 top-20 h-[500px] w-[500px] rounded-full bg-violet-600/30 blur-[150px]" />

        <div className="relative z-10 flex flex-col items-center">

          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-2xl font-black text-[#171022] shadow-2xl">
            A
          </div>

          <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-orange-400" />

          <p className="mt-5 text-sm font-medium text-white/70">
            Preparando tu espacio ARBUR...
          </p>

        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#160A29] text-[#090712]">

      {/* ==================================================
          FONDO ARBUR
      ================================================== */}

      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">

        <div className="absolute -left-48 -top-48 h-[650px] w-[650px] rounded-full bg-orange-500/35 blur-[150px]" />

        <div className="absolute -right-48 top-[-100px] h-[700px] w-[700px] rounded-full bg-violet-600/35 blur-[160px]" />

        <div className="absolute bottom-[-300px] left-[15%] h-[600px] w-[600px] rounded-full bg-orange-600/25 blur-[160px]" />

        <div className="absolute bottom-[-250px] right-[10%] h-[600px] w-[600px] rounded-full bg-fuchsia-600/20 blur-[160px]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,138,0,0.12),transparent_35%)]" />

        <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:40px_40px]" />

      </div>

      {/* ==================================================
          HEADER
      ================================================== */}

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#160A29]/85 backdrop-blur-xl">

        <div className="mx-auto flex min-h-[76px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* LOGO */}

          <div className="flex items-center gap-3">

            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-[0_8px_30px_rgba(0,0,0,0.25)]">

              <div className="absolute inset-1 rounded-xl bg-gradient-to-br from-orange-400 to-violet-600 opacity-20" />

              <span className="relative text-xl font-black text-[#160A29]">
                A
              </span>

            </div>

            <div>

              <h1 className="text-lg font-black tracking-tight text-white sm:text-xl">
                ARBUR
              </h1>

              <p className="text-[10px] font-medium tracking-wide text-white/55 sm:text-xs">
                Plataforma de servicios a domicilio
              </p>

            </div>

          </div>

          {/* CERRAR SESIÓN */}

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="group inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-400/50 hover:bg-orange-500/10 hover:text-orange-300 disabled:cursor-not-allowed disabled:opacity-50 sm:px-5 sm:text-sm"
          >

            <span>
              {loggingOut
                ? "Saliendo..."
                : "Cerrar sesión"}
            </span>

            {!loggingOut && (
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            )}

          </button>

        </div>

      </header>

      {/* ==================================================
          CONTENIDO
      ================================================== */}

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14">

        {/* ==================================================
            HERO
        ================================================== */}

        <section className="relative mb-8 overflow-hidden rounded-[28px] border border-white/20 bg-white shadow-[0_25px_70px_rgba(0,0,0,0.22)] sm:mb-10">

          <div className="absolute right-[-100px] top-[-150px] h-[350px] w-[350px] rounded-full bg-orange-300/30 blur-[100px]" />

          <div className="absolute bottom-[-180px] right-[20%] h-[300px] w-[300px] rounded-full bg-violet-300/25 blur-[100px]" />

          <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:p-10">

            <div>

              <div className="mb-5 flex flex-wrap items-center gap-2">

                <span className="inline-flex items-center gap-2 rounded-full bg-[#FFF3D6] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-[#9A6B00] sm:text-xs">

                  <span className="h-2 w-2 rounded-full bg-[#D6A62A]" />

                  Panel profesional

                </span>

                <span
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold sm:text-xs ${
                    isAvailable
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >

                  <span
                    className={`h-2 w-2 rounded-full ${
                      isAvailable
                        ? "bg-emerald-500"
                        : "bg-slate-400"
                    }`}
                  />

                  {isAvailable
                    ? "Disponible"
                    : "No disponible"}

                </span>

              </div>

              <p className="text-sm font-semibold text-slate-500">
                Bienvenido nuevamente
              </p>

              <h2 className="mt-1 max-w-3xl text-3xl font-black leading-tight tracking-tight text-[#090712] sm:text-4xl lg:text-5xl">
                {name || "Profesional"}
              </h2>

              {businessName && (
                <p className="mt-3 text-lg font-bold text-[#9A6B00]">
                  {businessName}
                </p>
              )}

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                Administrá tu perfil, tus servicios y prepará
                tu negocio para recibir solicitudes de clientes
                a través de ARBUR.
              </p>

            </div>

            {/* ICONO */}

            <div className="hidden items-center justify-center lg:flex">

              <div className="relative flex h-32 w-32 items-center justify-center rounded-[30px] bg-gradient-to-br from-[#FFF5DD] via-white to-[#F3E8FF] shadow-inner">

                <div className="absolute inset-3 rounded-[24px] border border-[#D6A62A]/30" />

                <div className="text-5xl">
                  ✦
                </div>

                <div className="absolute -right-2 -top-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#FF5A1F] text-lg text-white shadow-lg">
                  A
                </div>

              </div>

            </div>

          </div>

        </section>

        {/* ==================================================
            RESUMEN
        ================================================== */}

        <section className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {/* SERVICIOS */}

          <div className="group relative overflow-hidden rounded-[24px] border border-white/80 bg-white p-5 shadow-[0_15px_40px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_25px_55px_rgba(0,0,0,0.25)] sm:p-6">

            <div className="absolute right-[-60px] top-[-60px] h-40 w-40 rounded-full bg-blue-200/30 blur-3xl transition-transform duration-500 group-hover:scale-150" />

            <div className="relative">

              <div className="mb-5 flex items-center justify-between">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-2xl shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  🔧
                </div>

                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Servicios
                </span>

              </div>

              <p className="text-4xl font-black tracking-tight text-[#090712]">
                {serviceCount}
              </p>

              <h3 className="mt-1 text-sm font-bold text-[#090712]">
                Servicios publicados
              </h3>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                Servicios que actualmente ofrecés a tus clientes.
              </p>

            </div>

          </div>

          {/* ESTADO */}

          <div className="group relative overflow-hidden rounded-[24px] border border-white/80 bg-white p-5 shadow-[0_15px_40px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_25px_55px_rgba(0,0,0,0.25)] sm:p-6">

            <div className="absolute right-[-60px] top-[-60px] h-40 w-40 rounded-full bg-emerald-200/40 blur-3xl transition-transform duration-500 group-hover:scale-150" />

            <div className="relative">

              <div className="mb-5 flex items-center justify-between">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 shadow-sm transition-transform duration-300 group-hover:scale-110">

                  <span className="h-5 w-5 rounded-full bg-emerald-500 shadow-[0_0_18px_rgba(16,185,129,0.7)]" />

                </div>

                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Estado
                </span>

              </div>

              <p
                className={`text-2xl font-black ${
                  isAvailable
                    ? "text-emerald-600"
                    : "text-slate-500"
                }`}
              >
                {isAvailable
                  ? "Disponible"
                  : "No disponible"}
              </p>

              <h3 className="mt-1 text-sm font-bold text-[#090712]">
                Visibilidad profesional
              </h3>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                Estado actual de tu perfil dentro de ARBUR.
              </p>

            </div>

          </div>

          {/* REPUTACIÓN */}

          <div className="group relative overflow-hidden rounded-[24px] border border-white/80 bg-white p-5 shadow-[0_15px_40px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_25px_55px_rgba(0,0,0,0.25)] sm:p-6">

            <div className="absolute right-[-60px] top-[-60px] h-40 w-40 rounded-full bg-amber-200/40 blur-3xl transition-transform duration-500 group-hover:scale-150" />

            <div className="relative">

              <div className="mb-5 flex items-center justify-between">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF3D6] text-2xl shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                  ⭐
                </div>

                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Reputación
                </span>

              </div>

              <p className="text-2xl font-black text-[#090712]">
                Próximamente
              </p>

              <h3 className="mt-1 text-sm font-bold text-[#090712]">
                Calificaciones
              </h3>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                Aquí aparecerán las valoraciones de tus clientes.
              </p>

            </div>

          </div>

        </section>

        {/* ==================================================
            CENTRO PROFESIONAL
        ================================================== */}

        <section>

          <div className="mb-5">

            <p className="mb-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#D6A62A]">
              Tu espacio de trabajo
            </p>

            <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
              Centro profesional
            </h2>

            <p className="mt-1 text-sm text-white/60">
              Administrá las partes principales de tu negocio.
            </p>

          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {/* ==================================================
                MI PERFIL
            ================================================== */}

            <button
              type="button"
              onClick={() =>
                router.push("/professional/profile")
              }
              className="group relative w-full overflow-hidden rounded-[26px] border border-white/20 bg-white p-6 text-left shadow-[0_18px_45px_rgba(0,0,0,0.22)] transition-all duration-300 hover:-translate-y-3 hover:border-blue-300 hover:shadow-[0_30px_65px_rgba(0,0,0,0.32)]"
            >

              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-300/20 blur-3xl transition-transform duration-500 group-hover:scale-150" />

              <div className="relative">

                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-2xl shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3">
                  👤
                </div>

                <h3 className="text-lg font-black text-[#090712]">
                  Mi perfil
                </h3>

                <p className="mt-2 min-h-[60px] text-sm leading-6 text-slate-500">
                  Administrá tu información profesional y los
                  datos que verán tus clientes.
                </p>

                <div className="mt-5 inline-flex items-center gap-2 text-sm font-black text-blue-600">

                  Administrar

                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>

                </div>

              </div>

            </button>

            {/* ==================================================
                MIS SERVICIOS
            ================================================== */}

            <button
              type="button"
              onClick={() =>
                router.push("/professional/services")
              }
              className="group relative overflow-hidden rounded-[26px] border-2 border-[#D6A62A]/60 bg-gradient-to-br from-white via-white to-[#FFF8E9] p-6 text-left shadow-[0_18px_45px_rgba(0,0,0,0.22)] transition-all duration-300 hover:-translate-y-3 hover:border-[#D6A62A] hover:shadow-[0_30px_70px_rgba(214,166,42,0.25)]"
            >

              <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-orange-300/25 blur-3xl transition-transform duration-500 group-hover:scale-150" />

              <div className="relative">

                <div className="mb-6 flex items-center justify-between">

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF1CF] text-2xl shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                    🔧
                  </div>

                  <span className="rounded-full bg-[#F8E7B4] px-2.5 py-1 text-[10px] font-black text-[#9A6B00]">
                    {serviceCount}
                  </span>

                </div>

                <h3 className="text-lg font-black text-[#090712]">
                  Mis servicios
                </h3>

                <p className="mt-2 min-h-[60px] text-sm leading-6 text-slate-600">
                  Agregá, administrá, activá o eliminá los
                  servicios que ofrecés.
                </p>

                <div className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#B27A00]">

                  Administrar

                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>

                </div>

              </div>

            </button>

            {/* ==================================================
                SOLICITUDES
            ================================================== */}

            <article className="group relative overflow-hidden rounded-[26px] border border-white/20 bg-white p-6 shadow-[0_18px_45px_rgba(0,0,0,0.22)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_30px_65px_rgba(0,0,0,0.32)]">

              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-red-300/25 blur-3xl transition-transform duration-500 group-hover:scale-150" />

              <div className="relative">

                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-2xl shadow-sm transition-all duration-300 group-hover:scale-110">
                  📩
                </div>

                <h3 className="text-lg font-black text-[#090712]">
                  Solicitudes
                </h3>

                <p className="mt-2 min-h-[60px] text-sm leading-6 text-slate-500">
                  Próximamente recibirás aquí las solicitudes
                  de clientes interesados en tus servicios.
                </p>

                <span className="mt-5 inline-flex rounded-full bg-red-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-red-600">
                  Próximamente
                </span>

              </div>

            </article>

            {/* ==================================================
                CONFIGURACIÓN
            ================================================== */}

            <article className="group relative overflow-hidden rounded-[26px] border border-white/20 bg-white p-6 shadow-[0_18px_45px_rgba(0,0,0,0.22)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_30px_65px_rgba(0,0,0,0.32)]">

              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-violet-300/25 blur-3xl transition-transform duration-500 group-hover:scale-150" />

              <div className="relative">

                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                  ⚙️
                </div>

                <h3 className="text-lg font-black text-[#090712]">
                  Configuración
                </h3>

                <p className="mt-2 min-h-[60px] text-sm leading-6 text-slate-500">
                  Próximamente podrás administrar preferencias
                  y opciones de tu cuenta.
                </p>

                <span className="mt-5 inline-flex rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-slate-500">
                  Próximamente
                </span>

              </div>

            </article>

          </div>

        </section>

        {/* ==================================================
            FOOTER
        ================================================== */}

        <footer className="pb-4 pt-12 text-center">

          <p className="text-xs font-medium text-white/45">
            ARBUR · Plataforma de servicios a domicilio
          </p>

          <div className="mx-auto mt-3 h-px w-20 bg-gradient-to-r from-transparent via-orange-400/60 to-transparent" />

        </footer>

      </div>

    </main>
  );
}