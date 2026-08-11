import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui";
import { useState } from "react";
import { t } from "@/i18n";

interface ConfirmDialogProps {
  title: string;

  message: string;

  confirmLabel?: string;

  cancelLabel?: string;

  confirmationText?: string;

  onConfirm: () => void;

  onCancel: () => void;
}

export default function ConfirmDialog({
  title,
  message,
  confirmLabel = t(`actions.delete`),
  cancelLabel = t(`actions.cancel`),
  confirmationText,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [validationText, setValidationText] = useState("");

  const canConfirm = !confirmationText || validationText === confirmationText;

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

            {confirmationText && (
              <div
                className="
              mt-4
              space-y-2
            "
              >
                <p
                  className="
                text-sm
                text-muted
              "
                >
                  {t(`confirm.typeToConfirm`)}
                  {":"}
                  <strong className="ml-1">{confirmationText}</strong>
                </p>

                <input
                  className="
                w-full

                border
                border-border

                rounded-lg

                px-3
                py-2

                text-sm
              "
                  value={validationText}
                  onChange={(event) => setValidationText(event.target.value)}
                />
              </div>
            )}
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

          <Button variant="danger" disabled={!canConfirm} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
