import { useState } from "react";

import "./Avatar.css";

const API_URL = "http://localhost:3000";

/* Color estable a partir del nombre: la misma persona siempre tiene el
   mismo tono, sin guardar nada extra en la base. */
const TONOS = ["violet", "coral", "green", "blue", "amber"];

const tonoPara = (texto = "") => {
  const suma = [...texto].reduce(
    (total, letra) => total + letra.charCodeAt(0),
    0,
  );

  return TONOS[suma % TONOS.length];
};

const iniciales = (nombre = "") => {
  const partes = nombre.trim().split(/\s+/).filter(Boolean);

  if (partes.length === 0) {
    return "?";
  }

  if (partes.length === 1) {
    return partes[0].charAt(0).toUpperCase();
  }

  return (partes[0].charAt(0) + partes[1].charAt(0)).toUpperCase();
};

/**
 * Foto de perfil del usuario con respaldo a sus iniciales.
 *
 * Se usa en la barra lateral, el menú y el panel, así que la lógica de
 * "si no hay foto, muestra iniciales de colores" vive en un solo lugar.
 * Si la imagen existe pero no carga (archivo borrado), también cae a
 * las iniciales en vez de dejar el ícono roto del navegador.
 */
function Avatar({ nombre = "", urlFoto = null, size = 40, className = "" }) {
  const [falloImagen, setFalloImagen] = useState(false);

  const mostrarFoto = Boolean(urlFoto) && !falloImagen;

  const estilo = {
    width: size,
    height: size,
    fontSize: Math.max(12, Math.round(size * 0.38)),
  };

  return (
    <span
      className={`avatar tone-${tonoPara(nombre)} ${className}`}
      style={estilo}
      title={nombre || undefined}
    >
      {mostrarFoto ? (
        <img
          src={urlFoto.startsWith("http") ? urlFoto : `${API_URL}${urlFoto}`}
          alt={nombre ? `Foto de ${nombre}` : "Foto de perfil"}
          onError={() => setFalloImagen(true)}
        />
      ) : (
        iniciales(nombre)
      )}
    </span>
  );
}

export default Avatar;
