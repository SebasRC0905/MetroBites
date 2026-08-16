import { Component } from "react";

import Icon from "./Icon";

/**
 * Red de seguridad de la aplicación.
 *
 * Si un componente lanza un error durante el render, React desmonta
 * todo el árbol y el usuario se queda con una pantalla en blanco. Este
 * límite atrapa ese caso y muestra una salida digna con opción de
 * reintentar. Tiene que ser una clase: los hooks todavía no pueden
 * capturar errores de render.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);

    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("Error no controlado:", error, info);
  }

  reintentar = () => {
    this.setState({ error: null });
  };

  render() {
    const { error } = this.state;
    const { children } = this.props;

    if (!error) {
      return children;
    }

    return (
      <div className="mb-empty" style={{ margin: "auto", maxWidth: 460 }}>
        <span className="mb-empty-icon">
          <Icon name="alert" size={30} />
        </span>

        <h2>Algo se nos quemó en la cocina</h2>

        <p>
          Ocurrió un error inesperado en esta pantalla. Puedes reintentar o
          volver al menú principal.
        </p>

        <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
          <button
            type="button"
            className="mb-btn mb-btn-soft"
            onClick={this.reintentar}
          >
            <Icon name="refresh" size={17} />
            Reintentar
          </button>

          <a className="mb-btn mb-btn-primary" href="/home">
            Ir al menú
            <Icon name="arrowRight" size={17} />
          </a>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
