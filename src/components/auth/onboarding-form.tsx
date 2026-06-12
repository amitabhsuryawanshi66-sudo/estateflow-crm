"use client"

import { useActionState } from "react"

import {
  createInitialOrganizationAction,
  type AuthActionState,
} from "@/app/actions/auth"
import {
  ActionMessage,
  inputClassName,
  SubmitButton,
} from "@/components/auth/form-controls"

const initialState: AuthActionState = { status: "idle", message: "" }

export function OnboardingForm({
  defaultFullName,
}: {
  defaultFullName: string
}) {
  const [state, formAction] = useActionState(
    createInitialOrganizationAction,
    initialState,
  )

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1.5">
        <label
          className="text-sm font-medium text-zinc-800"
          htmlFor="organizationName"
        >
          Organization name
        </label>
        <input
          autoComplete="organization"
          className={inputClassName}
          id="organizationName"
          name="organizationName"
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
        idleLabel="Create organization"
        pendingLabel="Creating organization..."
      />
    </form>
  )
}
