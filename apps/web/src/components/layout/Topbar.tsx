import TreeSelector from "@/modules/trees/TreeSelector";

interface TopbarProps {
  title: string;
}

export function Topbar({ title }: TopbarProps) {
  return (
    <header
      className="
        h-16
        flex

        border-b
        border-border

        items-center
        justify-between
        px-6
      "
    >
      <h1
        className="
          text-xl
          font-semibold
        "
      >
        {title}
      </h1>

      <TreeSelector />
    </header>
  );
}
