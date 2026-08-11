import Icon from "./Icon";
import Logo from "./Logo";

/**
 * Panel lateral de color de las pantallas de acceso.
 * Las formas orgánicas se animan lentamente para dar profundidad.
 */
function AuthAside({ title, subtitle, highlights = [] }) {
  return (
    <aside className="auth-aside">
      <div className="auth-aside-shapes" aria-hidden="true">
        <span className="auth-orb orb-violet" />
        <span className="auth-orb orb-coral" />
        <span className="auth-orb orb-teal" />
        <span className="auth-grid" />
      </div>

      <div className="auth-aside-top">
        <Logo size={44} tone="light" caption="Cafetería UPMH" />
      </div>

      <div className="auth-aside-body">
        <h2>{title}</h2>

        <p>{subtitle}</p>

        {highlights.length > 0 && (
          <ul className="auth-highlights">
            {highlights.map((item, index) => (
              <li key={item.label} style={{ "--i": index }}>
                <span>
                  <Icon name={item.icon} size={17} />
                </span>
                {item.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="auth-aside-foot">
        Universidad Politécnica Metropolitana de Hidalgo
      </p>
    </aside>
  );
}

export default AuthAside;
