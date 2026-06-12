"use client"

import { useActionState } from "react"

import {
  acceptPendingInviteAction,
  type AuthActionState,
} from "@/app/actions/auth"
import {
  ActionMessage,
  inputClassName,
  SubmitButton,
} from "@/components/auth/form-controls"

const initialState: AuthActionState = { status: "idle", message: "" }

export function InviteForm({
  defaultFullName,
  token,
}: {
  defaultFullName: string
  token: string
}) {
  const [state, formAction] = useActionState(
    acceptPendingInviteAction,
    initialState,
  )

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-zinc-800" htmlFor="token">
          Invite token
        </label>
        <input
          autoComplete="off"
          className={inputClassName}
          defaultValue={token}
          id="token"
          name="token"
          required
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-zinc-800" htmlFor="fullName">
          Full name
        </label>
        <input
          autoComplete="name"
          className={inputClassName}
          defaultValue={defaultFullName}
          id="fullName"
          name="fullName"
          required
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-zinc-800" htmlFor="phone">
          Phone <span className="font-normal text-zinc-500">(optional)</span>
        </label>
        <input
          autoComplete="tel"
          className={inputClassName}
          id="phone"
          name="phone"
          type="tel"
        />
      </div>
      <ActionMessage state={state} />
      <SubmitButton
        idleLabel="Accept invite"
        pendingLabel="Accepting invite..."
      />
    </form>
  )
}
