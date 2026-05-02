// components/MovieModal.jsx
import { useEffect, useState } from "react";

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const posterFallback =
  "https://placehold.co/400x600/111827/ffffff?text=No+Poster";

function MovieModal({ imdbID, onClose }) {
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch(
          `https://www.omdbapi.com/?i=${imdbID}&apikey=${API_KEY}`
        );

        const data = await res.json();

        if (data.Response === "False") {
          setError(data.Error || "Movie details not found.");
          return;
        }

        setMovie(data);
      } catch {
        setError("Unable to load movie details.");
      }
    };

    fetchDetails();
  }, [imdbID]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-white/10 bg-slate-950 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-white/10 px-3 py-2 font-bold text-white transition hover:bg-red-500"
        >
          Close
        </button>

        {!movie && !error && (
          <div className="p-10 text-center text-slate-300">Loading details...</div>
        )}

        {error && <div className="p-10 text-center text-red-300">{error}</div>}

        {movie && (
          <div className="grid gap-6 p-5 md:grid-cols-[280px_1fr] md:p-6">
            <img
              src={movie.Poster !== "N/A" ? movie.Poster : posterFallback}
              alt={movie.Title}
              className="w-full rounded-xl object-cover"
            />

            <div className="pr-0 md:pr-12">
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-red-400">
                {movie.Type}
              </p>

              <h2 className="mb-3 text-3xl font-black tracking-tight">
                {movie.Title}
              </h2>

              <div className="mb-5 flex flex-wrap gap-2 text-sm text-slate-300">
                <span className="rounded-full bg-white/10 px-3 py-1">
                  {movie.Year}
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1">
                  {movie.Runtime}
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1">
                  IMDb {movie.imdbRating}
                </span>
              </div>

              <p className="mb-5 leading-7 text-slate-200">{movie.Plot}</p>

              <div className="space-y-3 text-sm text-slate-300">
                <p>
                  <span className="font-bold text-white">Genre:</span> {movie.Genre}
                </p>
                <p>
                  <span className="font-bold text-white">Director:</span>{" "}
                  {movie.Director}
                </p>
                <p>
                  <span className="font-bold text-white">Actors:</span>{" "}
                  {movie.Actors}
                </p>
                <p>
                  <span className="font-bold text-white">Language:</span>{" "}
                  {movie.Language}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MovieModal;
