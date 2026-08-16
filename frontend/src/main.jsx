import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { QueryClientProvider } from "@tanstack/react-query";

import "./index.css";

import App from "./App.jsx";

import ErrorBoundary from "./components/ErrorBoundary.jsx";

import { queryClient } from "./lib/queryClient";

import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext";
import { FavoritesProvider } from "./context/FavoritesContext.jsx";
import { CurrencyProvider } from "./context/CurrencyContext.jsx";

/*
 Orden de los proveedores:
 React Query envuelve todo porque los contextos de sesión, favoritos y
 moneda consultan la API a través de él. ErrorBoundary queda por dentro
 para poder reintentar sin perder la caché de datos.
*/
ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <FavoritesProvider>
        <CartProvider>
          <CurrencyProvider>
            <ErrorBoundary>
              <App />
            </ErrorBoundary>

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
          </CurrencyProvider>
        </CartProvider>
      </FavoritesProvider>
    </AuthProvider>
  </QueryClientProvider>,
);
