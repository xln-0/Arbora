import { useState } from "react";
import { useAuth } from "@/modules/auth/useAuth";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    await login(email, password);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="
        w-full
        max-w-sm
        bg-white
        rounded-xl
        shadow
        p-8
        space-y-5
      "
    >
      <div>
        <h1 className="text-2xl font-semibold">Connexion</h1>
      </div>

      <div>
        <label className="block text-sm mb-1">Email</label>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="
            w-full
            border
            rounded-md
            px-3
            py-2
          "
          required
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Mot de passe</label>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="
            w-full
            border
            rounded-md
            px-3
            py-2
          "
          required
        />
      </div>

      <button
        type="submit"
        className="
          w-full
          bg-black
          text-white
          rounded-md
          py-2
          hover:opacity-90
        "
      >
        Se connecter
      </button>
    </form>
  );
}
