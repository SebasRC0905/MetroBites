import { useQuery } from "@tanstack/react-query";

import productService from "../services/productService";
import categoryService from "../services/categoryService";

import { queryKeys } from "../lib/queryClient";

/** Menú completo (solo productos disponibles). */
export function useProductos() {
  return useQuery({
    queryKey: queryKeys.productos,
    queryFn: productService.getProducts,
    select: (respuesta) => respuesta.data,
  });
}

/**
 * Detalle de un producto con sus grupos de personalización.
 * `enabled` permite pedirlo solo cuando se abre el modal.
 */
export function useProducto(id, { enabled = true } = {}) {
  return useQuery({
    queryKey: queryKeys.producto(id),
    queryFn: () => productService.getProductDetail(id),
    enabled: Boolean(id) && enabled,
    select: (respuesta) => respuesta.data,
  });
}

export function useCategorias() {
  return useQuery({
    queryKey: queryKeys.categorias,
    queryFn: categoryService.getCategories,
    staleTime: 30 * 60 * 1000,
    select: (respuesta) => respuesta.data,
  });
}
