import React, { useState } from "react";

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple auth: admin / admin123
    if (username === "admin" && password === "admin123") {
      setError("");
      onLogin();
    } else {
      setError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#7b2ff2] via-[#f357a8] to-[#f2b5d4] relative">
      <div className="absolute inset-0 bg-gradient-to-br from-[#7b2ff2]/80 via-[#f357a8]/80 to-[#f2b5d4]/80 blur-2xl z-0" />
      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-white/90 rounded-3xl shadow-2xl px-8 py-10 w-full max-w-sm flex flex-col gap-7 border border-pink-100 backdrop-blur-lg"
        style={{ boxShadow: '0 8px 32px 0 rgba(123, 47, 242, 0.18)' }}
      >
        <div className="flex flex-col items-center mb-2">
          <div className="w-16 h-16 flex items-center justify-center mb-2">
            {/* Ícono de mariposa estilizada SVG */}
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 10C25.5 15 32 18 38 18C36 13 30 10 24 10Z" fill="#fff" fillOpacity="0.8"/>
              <path d="M24 10C22.5 15 16 18 10 18C12 13 18 10 24 10Z" fill="#fff" fillOpacity="0.8"/>
              <ellipse cx="24" cy="22" rx="4" ry="7" fill="#fff" fillOpacity="0.7"/>
              <circle cx="24" cy="28" r="2" fill="#fff" fillOpacity="0.7"/>
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-[#7b2ff2] mb-1 tracking-tight">Bienvenido</h2>
          <span className="text-[#f357a8] text-base font-medium">Inicia sesión para continuar</span>
        </div>
        <div className="flex flex-col gap-4">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7b2ff2]">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-8 0v2"/><circle cx="12" cy="7" r="4"/></svg>
            </span>
            <input
              type="text"
              placeholder="Usuario"
              className="pl-10 border border-pink-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#f357a8] text-lg bg-[#f8eafd] placeholder-pink-400 shadow-sm w-full"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#f357a8]">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 17a2 2 0 0 0 2-2V9a2 2 0 1 0-4 0v6a2 2 0 0 0 2 2z"/><rect x="6" y="17" width="12" height="2" rx="1"/></svg>
            </span>
            <input
              type="password"
              placeholder="Contraseña"
              className="pl-10 border border-pink-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#f357a8] text-lg bg-[#f8eafd] placeholder-pink-400 shadow-sm w-full"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
        </div>
        {error && <div className="text-red-500 text-sm text-center font-semibold -mt-2">{error}</div>}
        <button
          type="submit"
          className="bg-white text-[#7b2ff2] font-bold rounded-full py-3 text-lg shadow-lg transition-all duration-200 mt-2 border-2 border-[#f357a8] hover:bg-[#f357a8] hover:text-white hover:border-[#7b2ff2]"
        >
          Iniciar sesión
        </button>
        <div className="text-center text-xs text-[#f357a8] mt-2 select-none">
          © {new Date().getFullYear()} Blueback. Todos los derechos reservados.
        </div>
      </form>
    </div>
  );
};

export default Login;
