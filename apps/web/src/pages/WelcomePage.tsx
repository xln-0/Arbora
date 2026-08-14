import CreateTreeForm from "@/modules/trees/components/CreateTreeForm";

export default function WelcomePage() {
  return (
    <div
      className="
        h-full

        flex
        items-center
        justify-center

        p-4
        sm:p-6
      "
    >
      <div
        className="
          max-w-xl

          text-center

          space-y-6
        "
      >
        <div
          className="
            text-6xl
          "
        >
          🌳
        </div>

        <h1
          className="
            text-2xl
            sm:text-3xl
            font-bold
          "
        >
          Bienvenue dans Arbora
        </h1>

        <p
          className="
            text-muted

            text-lg
          "
        >
          Créez votre premier arbre généalogique et commencez à construire votre
          histoire familiale.
        </p>

        <CreateTreeForm />
      </div>
    </div>
  );
}
