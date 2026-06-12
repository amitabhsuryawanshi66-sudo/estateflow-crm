"use client"

import { useActionState } from "react"

import {
  signInAction,
  type AuthActionState,
} from "@/app/actions/auth"
import {
  ActionMessage,
  inputClassName,
  SubmitButton,
} from "@/components/auth/form-controls"

const initialState: AuthActionState = { status: "idle", message: "" }

export function LoginForm({ nextPath }: { nextPath: string | null }) {
  const [state, formAction] = useActionState(signInAction, initialState)

  return (
    <form action={formAction} className="space-y-4">
      {nextPath ? <input name="next" type="hidden" value={nextPath} /> : null}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-zinc-800" htmlFor="email">
          Email
        </label>
        <input
          autoComplete="email"
          className={inputClassName}
          id="email"
          name="email"
          required
          type="email"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-zinc-800" htmlFor="password">
          Password
        </label>
        <input
          autoComplete="current-password"
          className={inputClassName}
          id="password"
          name="password"
          required
          type="password"
        />
      </div>
      <ActionMessage state={state} />
      <SubmitButton idleLabel="Sign in" pendingLabel="Signing in..." />
    </form>
  )
}
