import { createContext, useContext, useEffect, useState } from "react";

import favoriteService from "../services/favoriteService";
import { useAuth } from "./AuthContext";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const { user } = useAuth();

  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const syncFavorites = async () => {
      if (!user) {
        setFavoriteIds(new Set());
        setFavorites([]);

        return;
      }

      try {
        setLoading(true);

        const response = await favoriteService.getFavorites();

        setFavorites(response.data);
        setFavoriteIds(new Set(response.data.map((item) => item.id)));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    syncFavorites();
  }, [user]);

  const isFavorite = (productoId) => favoriteIds.has(productoId);

  const toggleFavorite = async (product) => {
    const alreadyFavorite = favoriteIds.has(product.id);

    setFavoriteIds((prev) => {
      const next = new Set(prev);

      if (alreadyFavorite) {
        next.delete(product.id);
      } else {
        next.add(product.id);
      }

      return next;
    });

    setFavorites((prev) =>
      alreadyFavorite
        ? prev.filter((item) => item.id !== product.id)
        : [...prev, product],
    );

    try {
      if (alreadyFavorite) {
        await favoriteService.removeFavorite(product.id);
      } else {
        await favoriteService.addFavorite(product.id);
      }
    } catch (error) {
      console.error(error);

      // Revierte el cambio optimista si el servidor lo rechaza.
      setFavoriteIds((prev) => {
        const next = new Set(prev);

        if (alreadyFavorite) {
          next.add(product.id);
        } else {
          next.delete(product.id);
        }

        return next;
      });

      setFavorites((prev) =>
        alreadyFavorite
          ? [...prev, product]
          : prev.filter((item) => item.id !== product.id),
      );

      throw error;
    }
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, favoriteIds, loading, isFavorite, toggleFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
