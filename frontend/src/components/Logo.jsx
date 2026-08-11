/**
 * Marca de MetroBites: símbolo (tazón + vapor) y logotipo.
 * `tone="light"` se usa sobre fondos oscuros o de color.
 */
function Logo({ size = 42, tone = "dark", withText = true, caption }) {
  return (
    <span className={`mb-logo ${tone === "light" ? "is-light" : ""}`}>
      <span
        className="mb-logo-mark"
        style={{ width: size, height: size, borderRadius: size * 0.31 }}
      >
        <svg viewBox="0 0 24 24" width={size * 0.6} height={size * 0.6} aria-hidden="true">
          <path
            d="M3.6 12.4h16.8a8.4 8.4 0 0 1-16.8 0Z"
            fill="currentColor"
            opacity="0.95"
          />
          <path
            d="M2.6 20.4h18.8"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M9.4 3.4c-1.1 1.2-1.1 2.3 0 3.4 1.1 1.1 1.1 2.2 0 3.3M14.4 4.6c-.9 1-.9 1.8 0 2.7.9.9.9 1.7 0 2.6"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
            opacity="0.85"
          />
        </svg>
      </span>

      {withText && (
        <span className="mb-logo-text">
          <span>
            Metro<b>Bites</b>
          </span>
          {caption && <small>{caption}</small>}
        </span>
      )}
    </span>
  );
}

export default Logo;
