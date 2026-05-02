// pages/Favorites.jsx
import { useState } from "react";
import MovieCard from "../components/MovieCard";
import MovieModal from "../components/MovieModal";

function Favorites({ favorites, toggleFavorite, setPage }) {
  const [selectedMovie, setSelectedMovie] = useState(null);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-red-400">
            Your Collection
          </p>
          <h1 className="text-4xl font-black tracking-tight">Favorites</h1>
        </div>

        <button
          onClick={() => setPage("home")}
          className="rounded-xl bg-red-500 px-5 py-3 font-bold text-white transition hover:bg-red-600"
        >
          Find Movies
        </button>
      </div>

      {favorites.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-white/5 p-10 text-center">
          <h2 className="mb-2 text-xl font-bold">No favorites yet</h2>
          <p className="text-slate-400">
            Save movies from the home page and they will appear here.
          </p>
        </div>
      ) : (
        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {favorites.map((movie) => (
            <MovieCard
              key={movie.imdbID}
              movie={movie}
              isFavorite={true}
              toggleFavorite={toggleFavorite}
              onClick={() => setSelectedMovie(movie.imdbID)}
            />
          ))}
        </section>
      )}

      {selectedMovie && (
        <MovieModal
          imdbID={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </main>
  );
}

export default Favorites;
