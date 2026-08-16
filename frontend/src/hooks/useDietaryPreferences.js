import { useQuery } from "@tanstack/react-query";

import profileService from "../services/profileService";

/**
 * Alergias y estilo de vida que el alumno guardó en su perfil.
 *
 * Vive aparte del perfil completo porque lo consulta también el detalle
 * del producto, para avisar cuando un platillo puede contener algo que
 * la persona marcó como alergia.
 */
export function useDietaryPreferences() {
  const consulta = useQuery({
    queryKey: ["perfil"],
    queryFn: profileService.getProfile,
    staleTime: 5 * 60 * 1000,
    retry: 0,
    select: (respuesta) => respuesta.data?.preferencias || [],
  });

  const preferencias = consulta.data || [];

  return {
    preferencias,
    alergias: preferencias.filter((item) => item.tipo === "alergia"),
    estilos: preferencias.filter((item) => item.tipo === "estilo_vida"),
  };
}

export default useDietaryPreferences;
