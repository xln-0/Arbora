import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui";

interface ConfirmDialogProps {
  title: string;

  message: string;

  confirmLabel?: string;

  cancelLabel?: string;

  onConfirm: () => void;

  onCancel: () => void;
}

export default function ConfirmDialog({
  title,
  message,
  confirmLabel = "Supprimer",
  cancelLabel = "Annuler",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <div
      className="
        fixed
        inset-0

        flex
        items-center
        justify-center

        z-50
      "
    >
      {/* Overlay */}

      <div
        className="
          absolute
          inset-0

          bg-black/20
        "
        onClick={onCancel}
      />

      {/* Dialog */}

      <div
        className="
          relative

          w-96

          bg-surface

          border
          border-border

          rounded-2xl

          shadow-xl

          p-6
        "
      >
        <div
          className="
            flex
            gap-3
            items-start
          "
        >
          <div
            className="
              rounded-full
              bg-red-100

              p-2
            "
          >
            <AlertTriangle size={20} className="text-red-600" />
          </div>

          <div>
            <h2
              className="
                text-lg
                font-semibold
              "
            >
              {title}
            </h2>

            <p
              className="
                mt-2
                text-sm
                text-muted
                whitespace-pre-line
              "
            >
              {message}
            </p>
          </div>
        </div>

        <div
          className="
            flex
            justify-end
            gap-3

            mt-6
          "
        >
          <Button variant="ghost" onClick={onCancel}>
            {cancelLabel}
          </Button>

          <Button variant="danger" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
