"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/app/components/button";
import ErrorAlert from "@/app/components/error-alert";
import { UsersService } from "@/api/userApi";
import { clientAuthProvider } from "@/lib/authProvider";
import { UserEntity } from "@/types/user";
import { parseErrorMessage } from "@/types/errors";

interface DeleteAdministratorDialogProps {
  readonly administrator: UserEntity;
  readonly onSuccess: () => void;
  readonly onCancel: () => void;
}

export default function DeleteAdministratorDialog({
  administrator,
  onSuccess,
  onCancel,
}: DeleteAdministratorDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const service = new UsersService(clientAuthProvider);

  // Open as a native modal — built-in focus trap, backdrop and accessibility
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    dialog.showModal();

    return () => {
      if (dialog.open) dialog.close();
    };
  }, []);

  // Intercept the native Escape cancel event to block closing while a delete is in progress
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    function handleCancel(event: Event) {
      event.preventDefault();
      if (!isDeleting) onCancel();
    }

    dialog.addEventListener("cancel", handleCancel);
    return () => dialog.removeEventListener("cancel", handleCancel);
  }, [isDeleting, onCancel]);

  async function handleDelete() {
    setIsDeleting(true);
    setErrorMessage(null);

    try {
      await service.deleteUser(administrator.username);
      onSuccess();
    } catch (e) {
      setErrorMessage(parseErrorMessage(e));
      setIsDeleting(false);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-busy={isDeleting}
      className="m-auto w-full max-w-md border border-border bg-card px-6 py-6 shadow-lg backdrop:bg-black/50 sm:px-8 sm:py-8"
    >
      <h2
        id={titleId}
        className="text-lg font-semibold tracking-[-0.03em] text-foreground"
      >
        Delete administrator
      </h2>

      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Are you sure you want to delete{" "}
        <span className="font-semibold text-foreground">
          {administrator.username}
        </span>
        {administrator.email && (
          <>
            {" "}
            (<span className="text-foreground">{administrator.email}</span>)
          </>
        )}
        ? This action cannot be undone.
      </p>

      {errorMessage && (
        <div className="mt-4">
          <ErrorAlert message={errorMessage} />
        </div>
      )}

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {/* autoFocus ensures initial focus lands on the safe action (Cancel) when the dialog opens */}
        <Button
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          type="button"
          variant="outline"
          disabled={isDeleting}
          onClick={onCancel}
        >
          Cancel
        </Button>

        <Button
          type="button"
          variant="destructive"
          disabled={isDeleting}
          onClick={handleDelete}
        >
          {isDeleting ? "Deleting…" : "Delete administrator"}
        </Button>
      </div>
    </dialog>
  );
}
