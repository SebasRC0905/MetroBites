import { useNavigate } from "react-router-dom";

import ProductCard from "../../components/ProductCard";
import Icon from "../../components/Icon";
import EmptyState from "../../components/EmptyState";
import { SkeletonGrid } from "../../components/Skeleton";

import { useFavorites } from "../../context/FavoritesContext";

import "./Favorites.css";

function Favorites() {
  const navigate = useNavigate();

  const { favorites, loading } = useFavorites();

  return (
    <div className="favorites">
      <header className="mb-page-head">
        <div>
          <span className="mb-eyebrow accent">
            <Icon name="heart" size={13} />
            Guardados
          </span>

          <h1>Tus favoritos</h1>

          <p>Los platillos que marcaste con corazón, listos para volver a pedir.</p>
        </div>
      </header>

      {loading ? (
        <SkeletonGrid count={4} className="favorites-grid" />
      ) : favorites.length === 0 ? (
        <EmptyState
          icon="heart"
          title="Aún no tienes favoritos"
          description="Toca el corazón de cualquier producto del menú para guardarlo aquí."
          action={
            <button
              type="button"
              className="mb-btn mb-btn-accent mb-btn-lg"
              onClick={() => navigate("/home")}
            >
              Explorar el menú
              <Icon name="arrowRight" size={18} />
            </button>
          }
        />
      ) : (
        <div className="favorites-grid">
          {favorites.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;
