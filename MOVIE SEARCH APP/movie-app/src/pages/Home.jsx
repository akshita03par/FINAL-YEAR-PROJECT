// pages/Home.jsx
import { useState } from "react";
import MovieCard from "../components/MovieCard";
import MovieModal from "../components/MovieModal";

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

function Home({ favorites, toggleFavorite }) {
  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Search for a movie to begin.");

  const fetchMovies = async (e) => {
    e.preventDefault();

    if (!search.trim()) {
      setMessage("Please enter a movie name.");
      setMovies([]);
      return;
    }

    if (!API_KEY) {
      setMessage("Missing OMDB API key. Add VITE_OMDB_API_KEY to your .env file.");
      setMovies([]);
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await fetch(
        `https://www.omdbapi.com/?s=${encodeURIComponent(search)}&apikey=${API_KEY}`
      );

      const data = await res.json();

      if (data.Response === "False") {
        setMovies([]);
        setMessage(data.Error || "No movies found.");
        return;
      }

      setMovies(data.Search || []);
    } catch {
      setMovies([]);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <section className="mb-8 overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br from-red-600 via-slate-900 to-slate-950 p-6 shadow-2xl shadow-black/30">
        <div className="max-w-3xl">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-red-100">
            Discover Movies
          </p>

          <h1 className="mb-4 text-4xl font-black tracking-tight md:text-6xl">
            Find your favorite film
          </h1>

          <form onSubmit={fetchMovies} className="flex flex-col gap-3 sm:flex-row">
            <input
              className="min-h-12 flex-1 rounded-xl border border-white/10 bg-white px-4 text-slate-950 outline-none ring-red-500 transition placeholder:text-slate-500 focus:ring-4"
              placeholder="Search movies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button
              type="submit"
              disabled={loading}
              className="min-h-12 rounded-xl bg-red-500 px-6 font-bold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-red-900"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </form>
        </div>
      </section>

      {message && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center text-slate-300">
          {message}
        </div>
      )}

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {movies.map((movie) => (
          <MovieCard
            key={movie.imdbID}
            movie={movie}
            isFavorite={favorites.some((item) => item.imdbID === movie.imdbID)}
            toggleFavorite={toggleFavorite}
            onClick={() => setSelectedMovie(movie.imdbID)}
          />
        ))}
      </section>

      {selectedMovie && (
        <MovieModal
          imdbID={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </main>
  );
}

export default Home;
