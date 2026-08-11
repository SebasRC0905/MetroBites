/**
 * Set de iconos de línea propio de MetroBites.
 * Se dibujan con `currentColor` para heredar el color del contenedor y
 * sustituyen por completo a los emojis de la versión anterior.
 */

const paths = {
  home: (
    <>
      <path d="M3.5 10.6 12 3.6l8.5 7" />
      <path d="M5.8 9.4V19a1.4 1.4 0 0 0 1.4 1.4h2.7v-5.2h4.2v5.2h2.7A1.4 1.4 0 0 0 18.2 19V9.4" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8.2" r="3.7" />
      <path d="M4.8 20.2a7.2 7.2 0 0 1 14.4 0" />
    </>
  ),
  users: (
    <>
      <circle cx="9.6" cy="8.4" r="3.4" />
      <path d="M3.5 20a6.1 6.1 0 0 1 12.2 0" />
      <path d="M16 5.4a3.4 3.4 0 0 1 0 6.5" />
      <path d="M17.6 14.6a6.1 6.1 0 0 1 2.9 5.4" />
    </>
  ),
  receipt: (
    <>
      <path d="M6 3.6h12v17l-2.4-1.5-2.4 1.5-2.4-1.5-2.4 1.5z" />
      <path d="M9.4 8.6h5.2M9.4 12.4h5.2" />
    </>
  ),
  card: (
    <>
      <rect x="3" y="5.8" width="18" height="12.4" rx="3" />
      <path d="M3 10h18M6.6 14.6h3.2" />
    </>
  ),
  cart: (
    <>
      <path d="M3 4.4h2.1l2.2 10.4h9.8" />
      <path d="M6.4 7.6h13.8l-1.6 6.2" />
      <circle cx="9.4" cy="19" r="1.4" />
      <circle cx="16.8" cy="19" r="1.4" />
    </>
  ),
  search: (
    <>
      <circle cx="10.8" cy="10.8" r="6.4" />
      <path d="m15.6 15.6 4.4 4.4" />
    </>
  ),
  bell: (
    <>
      <path d="M18 16.4V11a6 6 0 0 0-12 0v5.4L4.6 18.4h14.8z" />
      <path d="M10 21.2a2.3 2.3 0 0 0 4 0" />
    </>
  ),
  plus: <path d="M12 5.4v13.2M5.4 12h13.2" />,
  minus: <path d="M5.4 12h13.2" />,
  close: <path d="m6.4 6.4 11.2 11.2M17.6 6.4 6.4 17.6" />,
  trash: (
    <>
      <path d="M4.6 6.8h14.8" />
      <path d="M9.6 6.8V4.6h4.8v2.2" />
      <path d="m6.8 6.8 1 12.6h8.4l1-12.6" />
      <path d="M10.6 10.4v5.6M13.4 10.4v5.6" />
    </>
  ),
  coffee: (
    <>
      <path d="M4.4 8.4h11.2v5.2a5.2 5.2 0 0 1-5.2 5.2H9.6a5.2 5.2 0 0 1-5.2-5.2z" />
      <path d="M15.6 9.8h1.6a2.6 2.6 0 0 1 0 5.2h-1.6" />
      <path d="M7.4 3.2v2M11 3.2v2" />
      <path d="M3.6 21.2h13" />
    </>
  ),
  utensils: (
    <>
      <path d="M6.4 3.2v6.2a2.2 2.2 0 0 0 4.4 0V3.2" />
      <path d="M8.6 11.6v9.2" />
      <path d="M17.4 3.2c-1.6 1.2-2.6 3.2-2.6 5.6s1 3.6 2.6 3.6v8.4" />
    </>
  ),
  bottle: (
    <>
      <path d="M10.2 3.4h3.6v2.8l1.5 2.3c.4.6.6 1.4.6 2.1v8a2 2 0 0 1-2 2h-3.8a2 2 0 0 1-2-2v-8c0-.7.2-1.5.6-2.1l1.5-2.3z" />
      <path d="M8.4 12.4h7.2" />
    </>
  ),
  snack: (
    <>
      <path d="M12 4.2a7.8 7.8 0 1 0 7.8 7.8 3.9 3.9 0 0 1-3.9-3.9A3.9 3.9 0 0 1 12 4.2Z" />
      <path d="M9.4 10.4h.01M13.4 13.6h.01M9.8 15.2h.01" strokeWidth="2.6" />
    </>
  ),
  flame: (
    <>
      <path d="M12 3.2c2.9 3.4 5.8 5.6 5.8 9.1a5.8 5.8 0 0 1-11.6 0c0-2 .9-3.6 2.3-5 .4 1.4 1 2.3 1.7 2.6-.1-2.4.6-4.6 1.8-6.7Z" />
    </>
  ),
  sparkles: (
    <>
      <path d="m11.4 4 1.5 3.9 3.9 1.5-3.9 1.5-1.5 3.9-1.5-3.9L6 9.4l3.9-1.5z" />
      <path d="m17.6 14.6.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z" />
    </>
  ),
  check: <path d="m5.2 12.6 4.6 4.6 9-9.4" />,
  checkCircle: (
    <>
      <circle cx="12" cy="12" r="8.6" />
      <path d="m8.2 12.2 2.6 2.6 5-5.2" />
    </>
  ),
  chevronDown: <path d="m6.4 9.6 5.6 5.6 5.6-5.6" />,
  chevronRight: <path d="m9.6 6.4 5.6 5.6-5.6 5.6" />,
  arrowLeft: <path d="M19 12H5.4M11 6.4 5 12l6 5.6" />,
  arrowRight: <path d="M5 12h13.6M13 6.4 19 12l-6 5.6" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="8.6" />
      <path d="M12 7.2V12l3.2 2" />
    </>
  ),
  cash: (
    <>
      <rect x="2.8" y="6.4" width="18.4" height="11.2" rx="2.4" />
      <circle cx="12" cy="12" r="2.6" />
      <path d="M6 10.4v3.2M18 10.4v3.2" strokeWidth="2.2" />
    </>
  ),
  logout: (
    <>
      <path d="M14.6 7.6V6a2 2 0 0 0-2-2H6.6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1.6" />
      <path d="M10.4 12h9.2M16.6 8.8 19.8 12l-3.2 3.2" />
    </>
  ),
  package: (
    <>
      <path d="m12 3.4 8 4.4v8.4l-8 4.4-8-4.4V7.8z" />
      <path d="m4 7.8 8 4.4 8-4.4M12 12.2v8.4" />
    </>
  ),
  chart: (
    <>
      <path d="M4.4 20.4h15.2" />
      <path d="M6.8 20V13M12 20V5.4M17.2 20v-4.6" />
    </>
  ),
  layout: (
    <>
      <rect x="3.4" y="3.4" width="7.2" height="7.8" rx="2" />
      <rect x="13.4" y="3.4" width="7.2" height="4.8" rx="2" />
      <rect x="13.4" y="11.2" width="7.2" height="9.4" rx="2" />
      <rect x="3.4" y="14.2" width="7.2" height="6.4" rx="2" />
    </>
  ),
  tag: (
    <>
      <path d="M11.6 3.6H20v8.4l-8.5 8.5a1.7 1.7 0 0 1-2.4 0l-6-6a1.7 1.7 0 0 1 0-2.4z" />
      <circle cx="15.8" cy="8" r="1.4" />
    </>
  ),
  edit: (
    <>
      <path d="M4 20.2h4.2L20 8.4a2.1 2.1 0 0 0 0-3l-1.2-1.2a2.1 2.1 0 0 0-3 0L4 16z" />
      <path d="m14.4 6 3.6 3.6" />
    </>
  ),
  power: (
    <>
      <path d="M12 3.6v8" />
      <path d="M7.4 6.8a7.4 7.4 0 1 0 9.2 0" />
    </>
  ),
  image: (
    <>
      <rect x="3.4" y="4.6" width="17.2" height="14.8" rx="3" />
      <circle cx="9" cy="10" r="1.6" />
      <path d="m4.6 17.4 4.8-4.6 4 3.6 2.8-2.4 3.2 3" />
    </>
  ),
  alert: (
    <>
      <path d="M12 4.4 21 19.6H3z" />
      <path d="M12 10.2v3.8M12 17h.01" strokeWidth="2.2" />
    </>
  ),
  star: <path d="m12 4 2.5 5.2 5.5.8-4 3.9 1 5.6-5-2.7-5 2.7 1-5.6-4-3.9 5.5-.8z" />,
  qr: (
    <>
      <rect x="4" y="4" width="6.2" height="6.2" rx="1.6" />
      <rect x="13.8" y="4" width="6.2" height="6.2" rx="1.6" />
      <rect x="4" y="13.8" width="6.2" height="6.2" rx="1.6" />
      <path d="M13.8 13.8h2.8v2.8h-2.8zM20 13.8v2M17.2 20h2.8M13.8 20h.8" />
    </>
  ),
  shield: (
    <>
      <path d="m12 3.4 7.2 3v5.2c0 4.3-2.9 7.9-7.2 9.2-4.3-1.3-7.2-4.9-7.2-9.2V6.4z" />
      <path d="m9.2 12 2 2 3.6-3.8" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5.4" width="18" height="13.2" rx="3" />
      <path d="m3.8 7.4 8.2 5.4 8.2-5.4" />
    </>
  ),
  idCard: (
    <>
      <rect x="2.8" y="5" width="18.4" height="14" rx="3" />
      <circle cx="8.6" cy="10.8" r="2.2" />
      <path d="M5.2 16.4a3.6 3.6 0 0 1 6.8 0M14.6 10h4M14.6 13.6h3" />
    </>
  ),
  leaf: (
    <>
      <path d="M20 4.2c.9 8.6-4 14.6-11 14.6-1.7 0-3.4-.5-3.4-.5S6.8 7.6 20 4.2Z" />
      <path d="M4 20.4c1.4-4.6 4.4-8.4 8.6-10.6" />
    </>
  ),
  refresh: (
    <>
      <path d="M20 12a8 8 0 1 1-2.6-5.9" />
      <path d="M20.2 4v4.4h-4.4" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.4" y="5" width="17.2" height="15.4" rx="3" />
      <path d="M8 3.2v3.6M16 3.2v3.6M3.4 10h17.2" />
    </>
  ),
  store: (
    <>
      <path d="M4.6 10.2V20h14.8v-9.8" />
      <path d="M3 9.6 5 4h14l2 5.6a2.9 2.9 0 0 1-5.7.4 2.9 2.9 0 0 1-5.6 0 2.9 2.9 0 0 1-5.7-.4Z" />
      <path d="M10 20v-5.2h4V20" />
    </>
  ),
  trendingUp: (
    <>
      <path d="m4 16.4 5.2-5.2 3.4 3.4L20 7.4" />
      <path d="M14.6 7.4H20v5.4" />
    </>
  ),
  wallet: (
    <>
      <path d="M3.4 8.2a2.6 2.6 0 0 1 2.6-2.6h10.4a2 2 0 0 1 2 2v1.4" />
      <rect x="3.4" y="8.2" width="17.2" height="11.6" rx="2.8" />
      <circle cx="16.4" cy="14" r="1.4" />
    </>
  ),
  filter: <path d="M4 6h16l-6.2 7.2v5.4l-3.6 1.8v-7.2z" />,
  menu: <path d="M4.4 7.2h15.2M4.4 12h15.2M4.4 16.8h15.2" />,
  eye: (
    <>
      <path d="M2.6 12S6 5.8 12 5.8 21.4 12 21.4 12 18 18.2 12 18.2 2.6 12 2.6 12Z" />
      <circle cx="12" cy="12" r="2.8" />
    </>
  ),
  lock: (
    <>
      <rect x="4.6" y="10.2" width="14.8" height="10.2" rx="3" />
      <path d="M8.2 10.2V7.8a3.8 3.8 0 0 1 7.6 0v2.4" />
    </>
  ),
  heart: (
    <path d="M12 20.2s-7.6-4.6-9.8-9.4C.6 7 2.4 3.6 6 3.2c2-.2 3.8.8 6 3 2.2-2.2 4-3.2 6-3 3.6.4 5.4 3.8 3.8 7.6-2.2 4.8-9.8 9.4-9.8 9.4Z" />
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4.4" />
      <path d="M12 2.6v2.6M12 18.8v2.6M4.6 12H2M22 12h-2.6M5.4 5.4l1.9 1.9M16.7 16.7l1.9 1.9M18.6 5.4l-1.9 1.9M7.3 16.7l-1.9 1.9" />
    </>
  ),
  cloudSun: (
    <>
      <path d="M7 8.4a4 4 0 0 1 7.6-1.7" strokeDasharray="0.1 3.4" />
      <circle cx="7.4" cy="7.4" r="2.6" />
      <path d="M4.6 18.4a3.6 3.6 0 0 1 .6-7.15 4.6 4.6 0 0 1 8.9-1.25 4 4 0 0 1 4.5 3.9 3.5 3.5 0 0 1-.6 4.5" />
      <path d="M6.6 18.4h11" />
    </>
  ),
  cloud: (
    <path d="M6.4 18.2a4 4 0 0 1 .3-8 5.2 5.2 0 0 1 10-1.4 4.4 4.4 0 0 1-.7 9.4z" />
  ),
  rain: (
    <>
      <path d="M6.4 14.2a4 4 0 0 1 .3-8 5.2 5.2 0 0 1 10-1.4 4.4 4.4 0 0 1-.7 9.4z" />
      <path d="M8.4 18v2.4M12 18v2.4M15.6 18v2.4" />
    </>
  ),
  storm: (
    <>
      <path d="M6.4 12.6a4 4 0 0 1 .3-8 5.2 5.2 0 0 1 10-1.4 4.4 4.4 0 0 1-.7 9.4z" />
      <path d="m13 13.4-3 4.4h2.6l-2 4.6" />
    </>
  ),
  snow: (
    <>
      <path d="M6.4 12.6a4 4 0 0 1 .3-8 5.2 5.2 0 0 1 10-1.4 4.4 4.4 0 0 1-.7 9.4z" />
      <path d="M8.4 17v4M6.4 18l4 2M10.4 18l-4 2M15.6 17v4M13.6 18l4 2M17.6 18l-4 2" />
    </>
  ),
};

function Icon({ name, size = 20, strokeWidth = 1.7, className = "", ...rest }) {
  const shape = paths[name];

  if (!shape) {
    return null;
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {shape}
    </svg>
  );
}

export default Icon;
