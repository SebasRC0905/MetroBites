import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

import Icon from "./Icon";
import { SkeletonLine } from "./Skeleton";

import nutritionService from "../services/nutritionService";
import useDietaryPreferences from "../hooks/useDietaryPreferences";
import { queryKeys } from "../lib/queryClient";

import { itemVariants, listaVariants } from "../lib/motion";

import "./NutritionPanel.css";

/*
 Los nombres de alérgeno que devuelve Open Food Facts no siempre son
 iguales a los del catálogo del perfil ("Lácteos" vs "Lactosa"), así que
 se cruzan con esta tabla.
*/
const EQUIVALENCIAS_ALERGIA = {
  Lactosa: ["Lácteos"],
  Gluten: ["Gluten"],
  Huevo: ["Huevo"],
  Cacahuate: ["Cacahuate", "Frutos secos"],
  "Frutos secos": ["Frutos secos", "Cacahuate"],
  Soya: ["Soya"],
  Mariscos: ["Mariscos", "Pescado"],
};

const CAMPOS = [
  { clave: "calorias", etiqueta: "Calorías", unidad: "kcal", icono: "flame" },
  { clave: "proteinas", etiqueta: "Proteína", unidad: "g", icono: "leaf" },
  { clave: "carbohidratos", etiqueta: "Carbohidratos", unidad: "g", icono: "snack" },
  { clave: "grasas", etiqueta: "Grasas", unidad: "g", icono: "utensils" },
  { clave: "azucares", etiqueta: "Azúcares", unidad: "g", icono: "sparkles" },
  { clave: "sodio", etiqueta: "Sodio", unidad: "g", icono: "bottle" },
];

/**
 * Referencia nutrimental del producto (backend → Open Food Facts).
 *
 * No es el análisis del platillo exacto de la cafetería sino el de un
 * producto equivalente en una base de datos abierta, y así se advierte.
 * Si la API externa no responde, el bloque no se muestra.
 */
function NutritionPanel({ productoId }) {
  const { alergias } = useDietaryPreferences();

  const consulta = useQuery({
    queryKey: queryKeys.nutricion(productoId),
    queryFn: () => nutritionService.getByProduct(productoId),
    staleTime: 24 * 60 * 60 * 1000,
    retry: 0,
    enabled: Boolean(productoId),
    select: (respuesta) => respuesta.data,
  });

  if (consulta.isLoading) {
    return (
      <section className="nutrition">
        <SkeletonLine width="42%" height={16} style={{ marginBottom: 14 }} />
        <SkeletonLine height={68} radius={14} />
      </section>
    );
  }

  if (consulta.isError || !consulta.data?.encontrado) {
    return null;
  }

  const datos = consulta.data;

  const valores = CAMPOS.filter(
    (campo) => datos.valoresPor100g[campo.clave] !== null,
  );

  if (valores.length === 0) {
    return null;
  }

  /*
   Cruce entre los alérgenos que reporta la referencia y las alergias
   que el alumno registró en su perfil.
  */
  const alertas = alergias.filter((alergia) =>
    (EQUIVALENCIAS_ALERGIA[alergia.nombre] || [alergia.nombre]).some(
      (equivalente) => datos.alergenos.includes(equivalente),
    ),
  );

  return (
    <section className="nutrition">
      <div className="mb-section-head">
        <h2>Información nutrimental</h2>
        <span>por cada 100 g</span>
      </div>

      {alertas.length > 0 && (
        <motion.div
          className="nutrition-alert"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Icon name="alert" size={18} />

          <div>
            <strong>Ojo con tus alergias</strong>

            <span>
              Marcaste alergia a {alertas.map((item) => item.nombre).join(" y ")}
              , y este tipo de producto suele contenerla.
            </span>
          </div>
        </motion.div>
      )}

      {datos.nutriScore && (
        <div className={`nutrition-score ${datos.nutriScore.tono}`}>
          <span className="nutrition-score-letter">
            {datos.nutriScore.letra}
          </span>

          <div>
            <strong>{datos.nutriScore.etiqueta}</strong>
            <span>Nutri-Score de un producto equivalente</span>
          </div>
        </div>
      )}

      <motion.div
        className="nutrition-grid"
        variants={listaVariants}
        initial="initial"
        animate="animate"
      >
        {valores.map((campo) => (
          <motion.div
            key={campo.clave}
            className="nutrition-cell"
            variants={itemVariants}
          >
            <span className="nutrition-cell-icon">
              <Icon name={campo.icono} size={15} />
            </span>

            <span className="mb-stat-label">{campo.etiqueta}</span>

            <strong>
              {datos.valoresPor100g[campo.clave]}
              <small>{campo.unidad}</small>
            </strong>
          </motion.div>
        ))}
      </motion.div>

      {datos.alergenos.length > 0 && (
        <div className="nutrition-allergens">
          <Icon name="alert" size={15} />

          <span>
            Puede contener: <strong>{datos.alergenos.join(", ")}</strong>
          </span>
        </div>
      )}

      <p className="nutrition-source">
        <Icon name="shield" size={13} />
        {datos.aviso} Fuente: {datos.fuente}
        {datos.referencia ? ` · referencia “${datos.referencia}”` : ""}.
      </p>
    </section>
  );
}

export default NutritionPanel;
