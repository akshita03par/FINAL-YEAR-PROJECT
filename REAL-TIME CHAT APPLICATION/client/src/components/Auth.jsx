import { useState } from "react";
import axios from "axios";
import { MessageCircle } from "lucide-react";

function Auth({ login }) {
  const [mode, setMode] = useState("signup");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const url =
        mode === "signup"
          ? "http://localhost:5000/api/signup"
          : "http://localhost:5000/api/login";

      const payload =
        mode === "signup"
          ? form
          : { email: form.email, password: form.password };

      const res = await axios.post(url, payload);
      login(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-black px-4 py-6 text-white sm:px-6">
      <div className="absolute -top-24 h-72 w-72 rounded-full bg-indigo-600/40 blur-[120px] sm:h-[520px] sm:w-[520px] lg:h-[700px] lg:w-[700px]" />
      <div className="absolute -bottom-20 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-violet-600/30 blur-[110px] sm:left-20 sm:h-[420px] sm:w-[420px] sm:translate-x-0 lg:left-56 lg:h-[500px] lg:w-[500px]" />

      <div className="relative flex w-full max-w-6xl flex-col items-center justify-center gap-8 lg:flex-row lg:justify-between lg:gap-16">
        <div className="flex flex-col items-center text-center lg:flex-1">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-violet-500 shadow-[0_0_60px_rgba(139,92,246,0.9)] sm:h-24 sm:w-24">
            <MessageCircle size={50} fill="white" />
          </div>
          <h1 className="mt-5 text-4xl font-bold sm:text-5xl">TalkNest</h1>
        </div>

        <form
          onSubmit={submit}
          className="w-full max-w-[360px] rounded-lg border border-white/30 bg-white/5 p-5 backdrop-blur-xl sm:p-6"
        >
          <h2 className="mb-6 text-2xl font-semibold">
            {mode === "signup" ? "Sign up" : "Login"}
          </h2>

          {mode === "signup" && (
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mb-4 w-full rounded border border-white/25 bg-transparent px-4 py-3 text-white outline-none placeholder:text-gray-400"
              placeholder="Full Name"
              required
            />
          )}

          <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="mb-4 w-full rounded border border-white/25 bg-transparent px-4 py-3 text-white outline-none placeholder:text-gray-400"
            placeholder="Email Address"
            type="email"
            required
          />

          <input
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="mb-4 w-full rounded border border-white/25 bg-transparent px-4 py-3 text-white outline-none placeholder:text-gray-400"
            placeholder="Password"
            type="password"
            required
          />

          {error && <p className="mb-3 text-sm text-red-300">{error}</p>}

          <button className="w-full rounded bg-linear-to-r from-fuchsia-400 to-violet-600 py-3 font-medium">
            {mode === "signup" ? "Create Account" : "Login Now"}
          </button>

          <p className="mt-6 text-sm text-gray-400">
            {mode === "signup"
              ? "Already have an account? "
              : "Create an account "}
            <button
              type="button"
              onClick={() => setMode(mode === "signup" ? "login" : "signup")}
              className="font-semibold text-violet-400"
            >
              {mode === "signup" ? "Login here" : "Click here"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Auth;
