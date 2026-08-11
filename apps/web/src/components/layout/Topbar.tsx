interface TopbarProps {
  title: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
}

export function Topbar({ title, badge, actions }: TopbarProps) {
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
      <div
        className="
          flex
          items-center
          gap-3
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

        {badge}
      </div>

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
