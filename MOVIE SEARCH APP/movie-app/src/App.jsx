// App.jsx
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";

function App() {
  const [page, setPage] = useState("home");
  const [favorites, setFavorites] = useState(() => {
    return JSON.parse(localStorage.getItem("favorites")) || [];
  });

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (movie) => {
    setFavorites((prev) => {
      const exists = prev.some((item) => item.imdbID === movie.imdbID);
      return exists
        ? prev.filter((item) => item.imdbID !== movie.imdbID)
        : [...prev, movie];
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar page={page} setPage={setPage} favoritesCount={favorites.length} />

      {page === "home" ? (
        <Home favorites={favorites} toggleFavorite={toggleFavorite} />
      ) : (
        <Favorites
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          setPage={setPage}
        />
      )}
    </div>
  );
}

export default App;
