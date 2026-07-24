interface OverlayLayerProps {
  children: React.ReactNode;
}

export function OverlayLayer({ children }: OverlayLayerProps) {
  return (
    <div
      className="
        fixed
        inset-0

        pointer-events-none

        z-40
      "
    >
      <div
        className="
          pointer-events-auto
        "
      >
        {children}
      </div>
    </div>
  );
}
