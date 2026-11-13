"use client";

import { useFormStatus } from "react-dom";

export default function CreateDraftButton({ disabled = false }: { disabled?: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={disabled || pending}>
      {pending ? "SAVING DRAFT…" : "CREATE DRAFT"} <span>↗</span>
    </button>
  );
}
