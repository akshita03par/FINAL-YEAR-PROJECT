// components/Navbar.jsx
function Navbar({ page, setPage, favoritesCount }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <button
          onClick={() => setPage("home")}
          className="text-left text-2xl font-black tracking-tight"
        >
          MovieFlix
        </button>

        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1">
          <button
            onClick={() => setPage("home")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              page === "home"
                ? "bg-red-500 text-white"
                : "text-slate-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            Home
          </button>

          <button
            onClick={() => setPage("favorites")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              page === "favorites"
                ? "bg-red-500 text-white"
                : "text-slate-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            Favorites
            <span className="ml-2 rounded-full bg-white/15 px-2 py-0.5 text-xs">
              {favoritesCount}
            </span>
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
