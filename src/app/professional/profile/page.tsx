"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
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

export default function ProfessionalProfilePage() {
  const router = useRouter();

  const supabase = useMemo(() => createClient(), []);

  const [profile, setProfile] = useState<Profile | null>(null);

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

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<
    "success" | "error" | ""
  >("");

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setMessage("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw new Error(
          `Error al comprobar la sesión: ${userError.message}`
        );
      }

      if (!user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
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
        .eq("user_id", user.id)
        .single();

      if (error) {
        throw new Error(
          `Error al cargar tu perfil: ${error.message}`
        );
      }

      if (!data) {
        throw new Error(
          "No encontramos un perfil profesional asociado a esta cuenta."
        );
      }

      const profileData = data as Profile;

      setProfile(profileData);

      setBusinessName(profileData.business_name || "");
      setProfessionalName(profileData.professional_name || "");
      setCategory(profileData.category || "");
      setDescription(profileData.description || "");
      setPhone(profileData.phone || "");
      setWhatsapp(profileData.whatsapp || "");
      setDepartment(profileData.department || "");
      setCity(profileData.city || "");
      setNeighborhood(profileData.neighborhood || "");
      setAddress(profileData.address || "");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Ocurrió un error inesperado.";

      setMessage(errorMessage);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }, [router, supabase]);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (saving) return;

    if (!profile) {
      setMessage("No se encontró tu perfil profesional.");
      setMessageType("error");
      return;
    }

    const cleanBusinessName = businessName.trim();
    const cleanProfessionalName = professionalName.trim();
    const cleanCategory = category.trim();
    const cleanDescription = description.trim();
    const cleanPhone = phone.trim();
    const cleanWhatsapp = whatsapp.trim();
    const cleanDepartment = department.trim();
    const cleanCity = city.trim();
    const cleanNeighborhood = neighborhood.trim();
    const cleanAddress = address.trim();

    if (!cleanBusinessName) {
      setMessage("Ingresá el nombre comercial.");
      setMessageType("error");
      return;
    }

    if (!cleanProfessionalName) {
      setMessage("Ingresá el nombre del profesional.");
      setMessageType("error");
      return;
    }

    if (!cleanCategory) {
      setMessage("Seleccioná una categoría.");
      setMessageType("error");
      return;
    }

    if (!cleanDescription) {
      setMessage("Ingresá una descripción profesional.");
      setMessageType("error");
      return;
    }

    if (!cleanPhone) {
      setMessage("Ingresá un número de teléfono.");
      setMessageType("error");
      return;
    }

    if (!cleanWhatsapp) {
      setMessage("Ingresá un número de WhatsApp.");
      setMessageType("error");
      return;
    }

    if (!cleanDepartment || !cleanCity) {
      setMessage(
        "Completá el departamento y la ciudad donde trabajás."
      );
      setMessageType("error");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw new Error(
          `Error de sesión: ${userError.message}`
        );
      }

      if (!user) {
        router.push("/login");
        return;
      }

      /*
       * IMPORTANTE:
       *
       * Acá NO usamos INSERT.
       *
       * El usuario ya tiene un único perfil profesional.
       * Por eso esta pantalla utiliza UPDATE.
       *
       * Esto evita volver a provocar:
       *
       * duplicate key value violates unique constraint
       */

      const { data, error } = await supabase
        .from("professional_profiles")
        .update({
          business_name: cleanBusinessName,
          professional_name: cleanProfessionalName,
          category: cleanCategory,
          description: cleanDescription,
          phone: cleanPhone,
          whatsapp: cleanWhatsapp,
          department: cleanDepartment,
          city: cleanCity,
          neighborhood: cleanNeighborhood,
          address: cleanAddress,
        })
        .eq("user_id", user.id)
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
        .single();

      if (error) {
        throw new Error(
          `Error al actualizar tu perfil: ${error.message}`
        );
      }

      setProfile(data as Profile);

      setMessage("Perfil actualizado correctamente.");
      setMessageType("success");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Ocurrió un error inesperado.";

      setMessage(errorMessage);
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  }

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
            Cargando tu perfil...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#160A29] text-[#090712]">
      {/* =========================
          FONDO ARBUR
      ========================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-48 -top-48 h-[650px] w-[650px] rounded-full bg-orange-500/30 blur-[150px]" />

        <div className="absolute -right-48 top-[-100px] h-[700px] w-[700px] rounded-full bg-violet-600/30 blur-[160px]" />

        <div className="absolute bottom-[-300px] left-[10%] h-[600px] w-[600px] rounded-full bg-orange-600/20 blur-[160px]" />

        <div className="absolute bottom-[-250px] right-[10%] h-[600px] w-[600px] rounded-full bg-fuchsia-600/20 blur-[160px]" />
      </div>

      {/* =========================
          HEADER
      ========================== */}

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#160A29]/85 backdrop-blur-xl">
        <div className="mx-auto flex min-h-[76px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
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
                Plataforma de servicios a domicilio
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              router.push("/professional/dashboard")
            }
            className="rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:border-orange-400/50 hover:bg-orange-500/10"
          >
            ← Panel
          </button>
        </div>
      </header>

      {/* =========================
          CONTENIDO
      ========================== */}

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
        {/* TITULO */}

        <section className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#FFF3D6] px-3 py-1.5 text-xs font-black uppercase tracking-wider text-[#9A6B00]">
            <span className="h-2 w-2 rounded-full bg-[#D6A62A]" />
            Perfil profesional
          </div>

          <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            Administrá tu perfil
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65 sm:text-base">
            Mantené actualizada la información que utilizará ARBUR
            para mostrar tus servicios a los clientes.
          </p>
        </section>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          {/* =========================
              FORMULARIO
          ========================== */}

          <section className="rounded-[28px] border border-white/20 bg-white p-6 shadow-[0_25px_70px_rgba(0,0,0,0.25)] sm:p-8">
            <div className="mb-7">
              <h3 className="text-2xl font-black text-[#090712]">
                Información profesional
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Estos datos forman parte de tu identidad dentro
                de ARBUR.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* NOMBRE COMERCIAL */}

              <div>
                <label
                  htmlFor="business-name"
                  className="mb-2 block text-sm font-bold text-[#090712]"
                >
                  Nombre comercial
                </label>

                <input
                  id="business-name"
                  value={businessName}
                  onChange={(event) =>
                    setBusinessName(event.target.value)
                  }
                  placeholder="Ej: González Electricidad"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#090712] outline-none transition focus:border-[#D6A62A] focus:bg-white focus:ring-4 focus:ring-[#D6A62A]/10"
                />
              </div>

              {/* PROFESIONAL */}

              <div>
                <label
                  htmlFor="professional-name"
                  className="mb-2 block text-sm font-bold text-[#090712]"
                >
                  Nombre del profesional
                </label>

                <input
                  id="professional-name"
                  value={professionalName}
                  onChange={(event) =>
                    setProfessionalName(event.target.value)
                  }
                  placeholder="Tu nombre completo"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#090712] outline-none transition focus:border-[#D6A62A] focus:bg-white focus:ring-4 focus:ring-[#D6A62A]/10"
                />
              </div>

              {/* CATEGORIA */}

              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-bold text-[#090712]"
                >
                  Categoría profesional
                </label>

                <select
                  id="category"
                  value={category}
                  onChange={(event) =>
                    setCategory(event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#090712] outline-none transition focus:border-[#D6A62A] focus:bg-white focus:ring-4 focus:ring-[#D6A62A]/10"
                >
                  <option value="">
                    Seleccioná una categoría
                  </option>

                  <option value="electricidad">
                    Electricidad
                  </option>

                  <option value="plomeria">
                    Plomería
                  </option>

                  <option value="limpieza">
                    Limpieza
                  </option>

                  <option value="pintura">
                    Pintura
                  </option>

                  <option value="reparaciones">
                    Reparaciones
                  </option>

                  <option value="jardineria">
                    Jardinería
                  </option>

                  <option value="tecnologia">
                    Tecnología
                  </option>

                  <option value="automotriz">
                    Automotriz
                  </option>

                  <option value="belleza">
                    Belleza
                  </option>

                  <option value="otros">
                    Otros
                  </option>
                </select>
              </div>

              {/* DESCRIPCIÓN */}

              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-bold text-[#090712]"
                >
                  Descripción profesional
                </label>

                <textarea
                  id="description"
                  rows={5}
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  placeholder="Contá brevemente qué hacés, qué servicios ofrecés y qué experiencia tenés."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#090712] outline-none transition focus:border-[#D6A62A] focus:bg-white focus:ring-4 focus:ring-[#D6A62A]/10"
                />
              </div>

              {/* CONTACTO */}

              <div className="border-t border-slate-200 pt-6">
                <h3 className="mb-4 text-lg font-black text-[#090712]">
                  Contacto
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-sm font-bold text-[#090712]"
                    >
                      Teléfono
                    </label>

                    <input
                      id="phone"
                      value={phone}
                      onChange={(event) =>
                        setPhone(event.target.value)
                      }
                      placeholder="+595..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#090712] outline-none transition focus:border-[#D6A62A] focus:bg-white focus:ring-4 focus:ring-[#D6A62A]/10"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="whatsapp"
                      className="mb-2 block text-sm font-bold text-[#090712]"
                    >
                      WhatsApp
                    </label>

                    <input
                      id="whatsapp"
                      value={whatsapp}
                      onChange={(event) =>
                        setWhatsapp(event.target.value)
                      }
                      placeholder="+595..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#090712] outline-none transition focus:border-[#D6A62A] focus:bg-white focus:ring-4 focus:ring-[#D6A62A]/10"
                    />
                  </div>
                </div>
              </div>

              {/* UBICACIÓN */}

              <div className="border-t border-slate-200 pt-6">
                <h3 className="mb-4 text-lg font-black text-[#090712]">
                  Zona de trabajo
                </h3>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="department"
                      className="mb-2 block text-sm font-bold text-[#090712]"
                    >
                      Departamento
                    </label>

                    <input
                      id="department"
                      value={department}
                      onChange={(event) =>
                        setDepartment(event.target.value)
                      }
                      placeholder="Ej: Alto Paraná"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#090712] outline-none transition focus:border-[#D6A62A] focus:bg-white focus:ring-4 focus:ring-[#D6A62A]/10"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="city"
                        className="mb-2 block text-sm font-bold text-[#090712]"
                      >
                        Ciudad
                      </label>

                      <input
                        id="city"
                        value={city}
                        onChange={(event) =>
                          setCity(event.target.value)
                        }
                        placeholder="Ej: Santa Rita"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#090712] outline-none transition focus:border-[#D6A62A] focus:bg-white focus:ring-4 focus:ring-[#D6A62A]/10"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="neighborhood"
                        className="mb-2 block text-sm font-bold text-[#090712]"
                      >
                        Barrio / Zona
                      </label>

                      <input
                        id="neighborhood"
                        value={neighborhood}
                        onChange={(event) =>
                          setNeighborhood(event.target.value)
                        }
                        placeholder="Ej: Centro"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#090712] outline-none transition focus:border-[#D6A62A] focus:bg-white focus:ring-4 focus:ring-[#D6A62A]/10"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="address"
                      className="mb-2 block text-sm font-bold text-[#090712]"
                    >
                      Dirección
                    </label>

                    <input
                      id="address"
                      value={address}
                      onChange={(event) =>
                        setAddress(event.target.value)
                      }
                      placeholder="Dirección donde trabajás o recibís clientes"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#090712] outline-none transition focus:border-[#D6A62A] focus:bg-white focus:ring-4 focus:ring-[#D6A62A]/10"
                    />
                  </div>
                </div>
              </div>

              {/* MENSAJE */}

              {message && (
                <div
                  className={`rounded-xl border px-4 py-3 text-sm font-semibold ${
                    messageType === "success"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  {message}
                </div>
              )}

              {/* BOTÓN */}

              <button
                type="submit"
                disabled={saving}
                className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-[#D6A62A] to-[#F08A24] px-5 py-4 text-sm font-black text-white shadow-lg shadow-orange-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="relative z-10">
                  {saving
                    ? "Guardando cambios..."
                    : "Guardar cambios"}
                </span>
              </button>
            </form>
          </section>

          {/* =========================
              VISTA PREVIA
          ========================== */}

          <aside>
            <div className="sticky top-28 rounded-[28px] border border-white/20 bg-white p-6 shadow-[0_25px_70px_rgba(0,0,0,0.25)]">
              <div className="mb-6">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#D6A62A]">
                  Vista previa
                </p>

                <h3 className="mt-1 text-2xl font-black text-[#090712]">
                  Así verá tu perfil
                </h3>
              </div>

              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
                {/* CABECERA */}

                <div className="relative overflow-hidden bg-gradient-to-br from-[#160A29] via-[#4B176B] to-[#F05A24] p-6 text-white">
                  <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-orange-400/30 blur-3xl" />

                  <div className="relative">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-xl font-black text-[#160A29] shadow-xl">
                      A
                    </div>

                    <div className="mt-5">
                      <p className="text-xs font-bold uppercase tracking-wider text-white/60">
                        Profesional ARBUR
                      </p>

                      <h4 className="mt-1 text-2xl font-black">
                        {businessName ||
                          "Nombre comercial"}
                      </h4>

                      <p className="mt-1 text-sm text-white/75">
                        {professionalName ||
                          "Nombre del profesional"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* INFORMACIÓN */}

                <div className="space-y-5 p-5">
                  <div>
                    <span className="inline-flex rounded-full bg-[#FFF3D6] px-3 py-1 text-xs font-black text-[#9A6B00]">
                      {category || "Categoría"}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm leading-6 text-slate-600">
                      {description ||
                        "Tu descripción profesional aparecerá aquí para que los clientes conozcan tu trabajo."}
                    </p>
                  </div>

                  <div className="border-t border-slate-200 pt-4">
                    <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                      Zona de trabajo
                    </p>

                    <p className="mt-2 text-sm font-bold text-[#090712]">
                      {city || "Ciudad"}
                      {department
                        ? `, ${department}`
                        : ""}
                    </p>

                    {neighborhood && (
                      <p className="mt-1 text-xs text-slate-500">
                        {neighborhood}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-slate-100 p-3">
                      <p className="text-xs text-slate-400">
                        Teléfono
                      </p>

                      <p className="mt-1 truncate text-xs font-bold text-[#090712]">
                        {phone || "No registrado"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-emerald-50 p-3">
                      <p className="text-xs text-emerald-600">
                        WhatsApp
                      </p>

                      <p className="mt-1 truncate text-xs font-bold text-emerald-700">
                        {whatsapp || "No registrado"}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl bg-[#160A29] px-4 py-3 text-center text-sm font-black text-white">
                    Próximamente: ver servicios
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}