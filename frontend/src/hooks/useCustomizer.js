import { useCallback, useMemo, useState } from "react";

/**
 * Lógica de personalización de un producto.
 *
 * Las opciones llegan del backend como una lista plana donde cada
 * opción trae la configuración de su grupo (única o múltiple, mínimo y
 * máximo). Aquí se arman los grupos, se aplica lo obligatorio por
 * defecto y se valida la selección, de modo que la pantalla solo se
 * preocupe por pintar.
 *
 * Es lo que hace que la personalización dependa del tipo de comida: una
 * bebida trae "Tamaño / Temperatura / Endulzante" y una torta trae
 * "Tipo de pan / Salsa / Sin ingredientes", sin código distinto.
 */
export function useCustomizer(personalizaciones = []) {
  const grupos = useMemo(() => {
    const mapa = new Map();

    for (const opcion of personalizaciones) {
      const nombre = opcion.nombre_grupo || "Extras";

      if (!mapa.has(nombre)) {
        const maximo =
          opcion.tipo_grupo === "unica"
            ? 1
            : opcion.max_selecciones === null ||
                opcion.max_selecciones === undefined
              ? null
              : Number(opcion.max_selecciones);

        mapa.set(nombre, {
          nombre,
          tipo: opcion.tipo_grupo || "multiple",
          minimo: Number(opcion.min_selecciones || 0),
          maximo,
          opciones: [],
        });
      }

      mapa.get(nombre).opciones.push(opcion);
    }

    return [...mapa.values()];
  }, [personalizaciones]);

  /*
   Solo se guardan los grupos que el usuario ya tocó. Lo que no está
   aquí usa su valor por defecto, así no hace falta reiniciar el estado
   cuando cambian los grupos (por ejemplo, al cargar otro producto).
  */
  const [tocados, setTocados] = useState({});

  /*
   Los grupos obligatorios de opción única arrancan con su primera
   opción marcada: nadie quiere elegir "Tamaño: chico" a mano cada vez.
  */
  const porDefecto = useCallback(
    (grupo) =>
      grupo.tipo === "unica" && grupo.minimo > 0 && grupo.opciones[0]
        ? [grupo.opciones[0].id]
        : [],
    [],
  );

  const idsDe = useCallback(
    (grupo) => tocados[grupo.nombre] ?? porDefecto(grupo),
    [tocados, porDefecto],
  );

  const alternar = useCallback(
    (grupo, opcion) => {
      setTocados((previa) => {
        const actuales = previa[grupo.nombre] ?? porDefecto(grupo);

        if (grupo.tipo === "unica") {
          // Volver a tocar la opción marcada la deja marcada si es obligatoria.
          if (actuales.includes(opcion.id)) {
            return grupo.minimo > 0
              ? previa
              : { ...previa, [grupo.nombre]: [] };
          }

          return { ...previa, [grupo.nombre]: [opcion.id] };
        }

        if (actuales.includes(opcion.id)) {
          return {
            ...previa,
            [grupo.nombre]: actuales.filter((id) => id !== opcion.id),
          };
        }

        if (grupo.maximo !== null && actuales.length >= grupo.maximo) {
          return previa;
        }

        return { ...previa, [grupo.nombre]: [...actuales, opcion.id] };
      });
    },
    [porDefecto],
  );

  const estaSeleccionada = useCallback(
    (grupo, opcion) => idsDe(grupo).includes(opcion.id),
    [idsDe],
  );

  const grupoLleno = useCallback(
    (grupo) => grupo.maximo !== null && idsDe(grupo).length >= grupo.maximo,
    [idsDe],
  );

  const opcionesElegidas = useMemo(
    () =>
      grupos.flatMap((grupo) => {
        const ids = idsDe(grupo);

        return grupo.opciones.filter((opcion) => ids.includes(opcion.id));
      }),
    [grupos, idsDe],
  );

  const extrasTotal = useMemo(
    () =>
      opcionesElegidas.reduce(
        (total, opcion) => total + Number(opcion.precio_adicional || 0),
        0,
      ),
    [opcionesElegidas],
  );

  /* Primer grupo obligatorio sin cubrir: se usa para avisar al usuario. */
  const grupoPendiente = useMemo(
    () => grupos.find((grupo) => idsDe(grupo).length < grupo.minimo) || null,
    [grupos, idsDe],
  );

  return {
    grupos,
    alternar,
    estaSeleccionada,
    grupoLleno,
    opcionesElegidas,
    extrasTotal,
    grupoPendiente,
    esValida: grupoPendiente === null,
    reiniciar: () => setTocados({}),
  };
}

export default useCustomizer;
