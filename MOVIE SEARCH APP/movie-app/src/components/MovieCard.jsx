// components/MovieCard.jsx
const posterFallback =
  "https://placehold.co/400x600/111827/ffffff?text=No+Poster";

function MovieCard({ movie, isFavorite, toggleFavorite, onClick }) {
  return (
    <article
      onClick={onClick}
      className="group cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:bg-white/10"
    >
      <div className="relative aspect-2/3 overflow-hidden bg-slate-900">
        <img
          src={movie.Poster !== "N/A" ? movie.Poster : posterFallback}
          alt={movie.Title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(movie);
          }}
          className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-bold shadow-lg transition ${
            isFavorite
              ? "bg-red-500 text-white"
              : "bg-slate-950/80 text-white hover:bg-red-500"
          }`}
        >
          {isFavorite ? "Saved" : "Save"}
        </button>
      </div>

      <div className="p-4">
        <h2 className="line-clamp-2 min-h-10 text-sm font-bold leading-5">
          {movie.Title}
        </h2>

        <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
          <span>{movie.Year}</span>
          <span className="rounded-full bg-white/10 px-2 py-1">{movie.Type}</span>
        </div>
      </div>
    </article>
  );
}

export default MovieCard;
