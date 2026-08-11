import { useEffect, useState } from "react";

import Icon from "./Icon";
import { SkeletonLine } from "./Skeleton";

import weatherService from "../services/weatherService";

import "./WeatherWidget.css";

/**
 * Consume el endpoint propio /clima/actual (backend → Open-Meteo) y
 * traduce el clima del campus en una sugerencia de categoría del menú.
 * Si la API externa falla, el widget simplemente desaparece: el clima
 * es un plus, nunca debe bloquear el uso normal del menú.
 */
function WeatherWidget({ onSuggest }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadWeather = async () => {
      try {
        const response = await weatherService.getCurrentWeather();

        if (mounted) {
          setWeather(response.data);
        }
      } catch (error) {
        console.error(error);

        if (mounted) {
          setFailed(true);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadWeather();

    return () => {
      mounted = false;
    };
  }, []);

  if (failed) {
    return null;
  }

  if (loading) {
    return (
      <div className="weather-widget is-loading">
        <SkeletonLine width={44} height={44} radius={14} />

        <div style={{ flex: 1 }}>
          <SkeletonLine width="70%" height={13} style={{ marginBottom: 8 }} />
          <SkeletonLine width="45%" height={11} />
        </div>
      </div>
    );
  }

  if (!weather) {
    return null;
  }

  return (
    <div className="weather-widget mb-reveal">
      <span className="weather-icon">
        <Icon name={weather.condicion.icono} size={24} />
      </span>

      <div className="weather-body">
        <div className="weather-temp-row">
          <strong>{weather.temperatura}°C</strong>
          <span>{weather.condicion.etiqueta}</span>
        </div>

        <p>{weather.sugerencia.mensaje}</p>
      </div>

      {onSuggest && (
        <button
          type="button"
          className="mb-btn mb-btn-soft mb-btn-sm weather-cta"
          onClick={() => onSuggest(weather.sugerencia.categoria)}
        >
          Ver sugerencia
          <Icon name="chevronRight" size={15} />
        </button>
      )}
    </div>
  );
}

export default WeatherWidget;
