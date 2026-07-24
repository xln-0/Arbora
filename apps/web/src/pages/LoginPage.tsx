import LoginForm from "@/modules/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Partie présentation */}
      <section
        className="
        flex
        flex-col
        justify-center
        px-10
        md:px-20
        bg-neutral-900
        text-white
      "
      >
        <h1
          className="
          text-5xl
          font-bold
          tracking-tight
        "
        >
          Arbora
        </h1>

        <h2
          className="
          mt-8
          text-3xl
          font-semibold
        "
        >
          Construisez votre histoire familiale.
        </h2>

        <p
          className="
          mt-6
          text-lg
          text-neutral-300
          max-w-lg
        "
        >
          Arbora vous permet de créer, explorer et préserver votre arbre
          généalogique. Visualisez les liens entre les générations et racontez
          l'histoire de votre famille.
        </p>

        <div
          className="
          mt-10
          space-y-3
          text-neutral-400
        "
        >
          <p>🌳 Organisez vos familles</p>

          <p>🔗 Reliez les générations</p>

          <p>📖 Conservez votre mémoire familiale</p>
        </div>
      </section>

      {/* Partie connexion */}
      <section
        className="
        flex
        items-center
        justify-center
        bg-neutral-100
        px-6
      "
      >
        <LoginForm />
      </section>
    </main>
  );
}
