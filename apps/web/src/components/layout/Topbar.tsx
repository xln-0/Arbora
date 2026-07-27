interface TopbarProps {
  title: string;
  actions?: React.ReactNode;
}

export function Topbar({ title, actions }: TopbarProps) {
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
      <div
        className="
          flex
          items-center
          gap-2
        "
      >
        {actions}
      </div>
    </header>
  );
}
