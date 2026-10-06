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

type Category = {
  id: string;
  name: string;
  slug: string;
};

/**
 * IMPORTANTE:
 *
 * Esta interfaz representa una fila de professional_services.
 *
 * La tabla professional_services utiliza:
 * - service_id
 * - professional_id
 *
 * NO usamos "id" acá porque las operaciones de editar/eliminar
 * trabajan directamente con professional_services.service_id.
 */
type Service = {
  service_id: string;
  professional_id: string;
  name: string;
  description: string | null;
  price: number | null;
  category: string | null;
  is_available: boolean;
  created_at?: string;
  updated_at?: string;
};

export default function ProfessionalServicesPage() {
  /**
   * Creamos el cliente una sola vez.
   *
   * Esto evita crear una nueva instancia de Supabase
   * en cada render del componente.
   */
  const supabase = useMemo(() => createClient(), []);

  const router = useRouter();

  // =========================================================
  // ESTADOS
  // =========================================================

  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  const [userId, setUserId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // =========================================================
  // CARGAR DATOS
  // =========================================================

  const loadData = useCallback(async () => {
    setLoading(true);
    setMessage("");

    try {
      // -------------------------------------------------------
      // 1. Obtener usuario autenticado
      // -------------------------------------------------------

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
        setUserId(null);
        setCategories([]);
        setServices([]);

        throw new Error("No hay una sesión iniciada.");
      }

      setUserId(user.id);

      // -------------------------------------------------------
      // 2. Cargar categorías
      // -------------------------------------------------------

      const {
        data: categoriesData,
        error: categoriesError,
      } = await supabase
        .from("categories")
        .select("id, name, slug")
        .order("name", { ascending: true });

      if (categoriesError) {
        throw new Error(
          `Error al cargar categorías: ${categoriesError.message}`
        );
      }

      setCategories(categoriesData ?? []);

      // -------------------------------------------------------
      // 3. Cargar servicios del profesional
      // -------------------------------------------------------
      //
      // IMPORTANTE:
      // Acá estamos leyendo professional_services.
      // Por eso los registros tienen service_id.
      //

      const {
  data: servicesData,
  error: servicesError,
} = await supabase
  .from("professional_services")
  .select(
    `
      service_id,
      professional_id,
      name,
      description,
      price,
      category,
      is_available,
      created_at
    `
  )
  .eq("professional_id", user.id)
  .order("created_at", { ascending: false });

      if (servicesError) {
        throw new Error(
          `Error al cargar servicios: ${servicesError.message}`
        );
      }

      setServices((servicesData ?? []) as Service[]);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Ocurrió un error inesperado.";

      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  // =========================================================
  // CARGA INICIAL
  // =========================================================

  useEffect(() => {
    void loadData();
  }, [loadData]);

  // =========================================================
  // CREAR SERVICIO
  // =========================================================

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (saving) return;

    setMessage("");

    // -------------------------------------------------------
    // Validaciones básicas
    // -------------------------------------------------------

    if (!userId) {
      setMessage(
        "No hay una sesión iniciada. Iniciá sesión nuevamente."
      );
      return;
    }

    const cleanName = name.trim();
    const cleanDescription = description.trim();

    if (!cleanName) {
      setMessage("Ingresá el nombre del servicio.");
      return;
    }

    if (!categoryId) {
      setMessage("Seleccioná una categoría.");
      return;
    }

    if (!cleanDescription) {
      setMessage("Ingresá una descripción del servicio.");
      return;
    }

    // -------------------------------------------------------
    // Validar precio
    // -------------------------------------------------------

    let numericPrice: number | null = null;

    if (price.trim() !== "") {
      const parsedPrice = Number(price);

      if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
        setMessage("Ingresá un precio válido.");
        return;
      }

      numericPrice = parsedPrice;
    }

    setSaving(true);

    try {
      // -----------------------------------------------------
      // 1. Buscar categoría
      // -----------------------------------------------------

      const selectedCategory = categories.find(
        (category) => category.id === categoryId
      );

      if (!selectedCategory) {
        throw new Error(
          "La categoría seleccionada no existe."
        );
      }

      // -----------------------------------------------------
      // 2. Crear slug
      // -----------------------------------------------------

      const slug =
        cleanName
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "") +
        "-" +
        Date.now();

      // -----------------------------------------------------
      // 3. Crear servicio base
      // -----------------------------------------------------

      const {
        data: serviceData,
        error: serviceError,
      } = await supabase
        .from("services")
        .insert({
          category_id: selectedCategory.id,
          name: cleanName,
          slug,
          description: cleanDescription,
        })
        .select("id")
        .single();

      if (serviceError) {
        throw new Error(
          `Error al crear el servicio base: ${serviceError.message}`
        );
      }

      if (!serviceData?.id) {
        throw new Error(
          "El servicio fue creado, pero no se recibió su identificador."
        );
      }

      // -----------------------------------------------------
      // 4. Crear relación profesional → servicio
      // -----------------------------------------------------
      //
      // IMPORTANTE:
      //
      // Acá guardamos:
      // service_id: serviceData.id
      //
      // Luego, para editar/eliminar, utilizaremos
      // exactamente ese mismo service_id.
      //

      const {
        error: professionalServiceError,
      } = await supabase
        .from("professional_services")
        .insert({
          professional_id: userId,
          service_id: serviceData.id,
          name: cleanName,
          description: cleanDescription,
          price: numericPrice,
          category: selectedCategory.slug,
          is_available: true,
        });

      if (professionalServiceError) {
        throw new Error(
          `Error al guardar el servicio profesional: ${professionalServiceError.message}`
        );
      }

      // -----------------------------------------------------
      // 5. Limpiar formulario
      // -----------------------------------------------------

      setName("");
      setDescription("");
      setPrice("");
      setCategoryId("");

      setMessage("Servicio agregado correctamente ✅");

      // -----------------------------------------------------
      // 6. Recargar servicios
      // -----------------------------------------------------

      await loadData();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Ocurrió un error inesperado.";

      setMessage(errorMessage);
    } finally {
      setSaving(false);
    }
  }

  // =========================================================
  // ACTIVAR / DESACTIVAR SERVICIO
  // =========================================================

  async function handleToggleAvailability(service: Service) {
    if (!userId) {
      setMessage("No hay una sesión iniciada.");
      return;
    }

    if (!service.service_id) {
      setMessage(
        "No se pudo identificar el servicio. Recargá la página."
      );
      return;
    }

    setMessage("");

    const { error } = await supabase
      .from("professional_services")
      .update({
        is_available: !service.is_available,
      })
      .eq("service_id", service.service_id)
      .eq("professional_id", userId);

    if (error) {
      setMessage(
        `Error al cambiar disponibilidad: ${error.message}`
      );
      return;
    }

    setMessage(
      service.is_available
        ? "Servicio desactivado correctamente."
        : "Servicio activado correctamente."
    );

    await loadData();
  }

  // =========================================================
  // ELIMINAR SERVICIO
  // =========================================================

  async function handleDeleteService(serviceId: string) {
    if (!userId) {
      setMessage("No hay una sesión iniciada.");
      return;
    }

    if (!serviceId) {
      setMessage(
        "No se pudo identificar el servicio que querés eliminar."
      );
      return;
    }

    const confirmed = window.confirm(
      "¿Seguro que querés eliminar este servicio?"
    );

    if (!confirmed) return;

    setMessage("");

    const { error } = await supabase
      .from("professional_services")
      .delete()
      .eq("service_id", serviceId)
      .eq("professional_id", userId);

    if (error) {
      setMessage(
        `Error al eliminar servicio: ${error.message}`
      );
      return;
    }

    setMessage("Servicio eliminado correctamente ✅");

    await loadData();
  }

  // =========================================================
  // INTERFAZ
  // =========================================================

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">

        {/* =====================================================
            ENCABEZADO
        ====================================================== */}

        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              Mis servicios
            </h1>

            <p className="mt-2 text-slate-400">
              Agregá los servicios que ofrecés a tus clientes.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/professional/dashboard")}
            className="rounded-xl border border-slate-700 px-4 py-2 text-sm transition hover:bg-slate-800"
          >
            ← Panel
          </button>
        </div>

        {/* =====================================================
            CONTENIDO
        ====================================================== */}

        <div className="grid gap-8 lg:grid-cols-2">

          {/* ===================================================
              FORMULARIO
          ==================================================== */}

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">

            <h2 className="text-xl font-semibold">
              Agregar nuevo servicio
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Publicá los servicios que ofrecés a tus clientes.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-5"
            >

              {/* NOMBRE */}

              <div>
                <label
                  htmlFor="service-name"
                  className="mb-2 block text-sm text-slate-300"
                >
                  Nombre del servicio
                </label>

                <input
                  id="service-name"
                  required
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="Ej: Detailing automotriz"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 outline-none transition focus:border-blue-500"
                />
              </div>

              {/* CATEGORÍA */}

              <div>
                <label
                  htmlFor="service-category"
                  className="mb-2 block text-sm text-slate-300"
                >
                  Categoría
                </label>

                <select
                  id="service-category"
                  required
                  value={categoryId}
                  onChange={(event) =>
                    setCategoryId(event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 outline-none transition focus:border-blue-500"
                >
                  <option value="">
                    Seleccioná una categoría
                  </option>

                  {categories.map((category) => (
                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* DESCRIPCIÓN */}

              <div>
                <label
                  htmlFor="service-description"
                  className="mb-2 block text-sm text-slate-300"
                >
                  Descripción
                </label>

                <textarea
                  id="service-description"
                  required
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  placeholder="Describí brevemente el servicio..."
                  rows={4}
                  className="w-full resize-none rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 outline-none transition focus:border-blue-500"
                />
              </div>

              {/* PRECIO */}

              <div>
                <label
                  htmlFor="service-price"
                  className="mb-2 block text-sm text-slate-300"
                >
                  Precio
                </label>

                <input
                  id="service-price"
                  type="number"
                  min="0"
                  step="1"
                  value={price}
                  onChange={(event) =>
                    setPrice(event.target.value)
                  }
                  placeholder="Ej: 150000"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 outline-none transition focus:border-blue-500"
                />

                <p className="mt-1 text-xs text-slate-500">
                  Podés dejarlo vacío si el precio depende
                  del trabajo.
                </p>
              </div>

              {/* BOTÓN */}

              <button
                type="submit"
                disabled={saving || loading}
                className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Guardando..."
                  : "Agregar servicio"}
              </button>

              {/* MENSAJE */}

              {message && (
                <div className="rounded-xl border border-slate-800 bg-slate-800 p-4 text-sm text-slate-300">
                  {message}
                </div>
              )}

            </form>
          </section>

          {/* ===================================================
              SERVICIOS PUBLICADOS
          ==================================================== */}

          <section>

            <h2 className="mb-4 text-xl font-semibold">
              Servicios publicados
            </h2>

            {loading ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-slate-400">
                Cargando servicios...
              </div>
            ) : services.length === 0 ? (

              <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900 p-8 text-center">

                <div className="text-4xl">
                  🛠️
                </div>

                <h3 className="mt-4 font-semibold">
                  Todavía no tenés servicios
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                  Agregá tu primer servicio usando el
                  formulario.
                </p>

              </div>

            ) : (

              <div className="space-y-4">

                {services.map((service) => (

                  <div
                    key={service.service_id}
                    className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg"
                  >

                    <div className="flex items-start justify-between gap-4">

                      <div>

                        <h3 className="text-lg font-semibold">
                          {service.name}
                        </h3>

                        {service.category && (
                          <span className="mt-2 inline-block rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-400">
                            {service.category}
                          </span>
                        )}

                      </div>

                      <span
                        className={
                          service.is_available
                            ? "text-sm text-green-400"
                            : "text-sm text-slate-500"
                        }
                      >
                        {service.is_available
                          ? "Disponible"
                          : "No disponible"}
                      </span>

                    </div>

                    {service.description && (
                      <p className="mt-3 text-sm leading-6 text-slate-400">
                        {service.description}
                      </p>
                    )}

                    {service.price !== null && (
                      <p className="mt-4 text-lg font-bold">
                        Gs.{" "}
                        {Number(service.price).toLocaleString(
                          "es-PY"
                        )}
                      </p>
                    )}

                    <div className="mt-5 flex flex-wrap gap-3">

                      {/* ACTIVAR / DESACTIVAR */}

                      <button
                        type="button"
                        onClick={() =>
                          handleToggleAvailability(service)
                        }
                        className="rounded-xl border border-slate-700 px-4 py-2 text-sm transition hover:bg-slate-800"
                      >
                        {service.is_available
                          ? "Desactivar"
                          : "Activar"}
                      </button>

                      {/* ELIMINAR */}

                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteService(
                            service.service_id
                          )
                        }
                        className="rounded-xl border border-red-500/40 px-4 py-2 text-sm text-red-400 transition hover:bg-red-500/10"
                      >
                        Eliminar
                      </button>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </section>

        </div>
      </div>
    </main>
  );
}