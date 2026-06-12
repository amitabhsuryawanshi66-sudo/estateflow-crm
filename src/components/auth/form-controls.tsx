"use client"

import { useFormStatus } from "react-dom"

import { Button } from "@/components/ui/button"
import type { AuthActionState } from "@/app/actions/auth"

export const inputClassName =
  "h-10 w-full rounded-lg border bg-white px-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"

export function ActionMessage({ state }: { state: AuthActionState }) {
  if (state.status === "idle") {
    return null
  }

  return (
    <p
      aria-live="polite"
      className={
        state.status === "error"
          ? "rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
          : "rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700"
      }
    >
      {state.message}
    </p>
  )
}

export function SubmitButton({
  idleLabel,
  pendingLabel,
}: {
  idleLabel: string
  pendingLabel: string
}) {
  const { pending } = useFormStatus()

  return (
    <Button className="h-10 w-full" disabled={pending} type="submit">
      {pending ? pendingLabel : idleLabel}
    </Button>
  )
}
