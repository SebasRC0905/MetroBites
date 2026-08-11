import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";

import "./index.css";

import App from "./App.jsx";

import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext";
import { FavoritesProvider } from "./context/FavoritesContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <FavoritesProvider>
      <CartProvider>
        <App />

        <Toaster
          position="top-right"
          gutter={12}
          toastOptions={{
            duration: 3200,
            style: {
              padding: "13px 16px",
              color: "#14121f",
              background: "#ffffff",
              border: "1px solid rgba(20, 18, 31, 0.08)",
              borderRadius: "14px",
              boxShadow: "0 14px 38px rgba(35, 18, 74, 0.14)",
              fontSize: "14px",
              fontWeight: 600,
              maxWidth: "380px",
            },
            success: {
              iconTheme: {
                primary: "#0e9f6e",
                secondary: "#ffffff",
              },
            },
            error: {
              iconTheme: {
                primary: "#e11d48",
                secondary: "#ffffff",
              },
            },
          }}
        />
      </CartProvider>
    </FavoritesProvider>
  </AuthProvider>,
);
