"use server"

import { redirect } from "next/navigation"

import { getAccountWithClient } from "@/lib/auth/account"
import { getSafeNextPath } from "@/lib/auth/routing"
import {
  validateInitialOrganizationForm,
  validateInviteAcceptanceForm,
  validateSignInForm,
  validateSignUpForm,
} from "@/lib/auth/validation"
import { createClient } from "@/lib/supabase/server"

export type AuthActionState = {
  status: "idle" | "error" | "success"
  message: string
}

function errorState(message: string): AuthActionState {
  return { status: "error", message }
}

export async function signUpAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const validation = validateSignUpForm(formData)
  if (!validation.ok) {
    return errorState(validation.error)
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email: validation.data.email,
    password: validation.data.password,
    options: {
      data: {
        full_name: validation.data.fullName,
      },
    },
  })

  if (error) {
    return errorState("Unable to create the account. Please try again.")
  }

  if (!data.session) {
    return {
      status: "success",
      message: "Account created. Check your email to confirm it, then sign in.",
    }
  }

  redirect(getSafeNextPath(formData.get("next")) ?? "/onboarding")
}

export async function signInAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const validation = validateSignInForm(formData)
  if (!validation.ok) {
    return errorState(validation.error)
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword(validation.data)

  if (error) {
    return errorState("Unable to sign in. Check your email and password.")
  }

  const account = await getAccountWithClient(supabase)

  if (account.state === "ready") {
    redirect("/dashboard")
  }

  redirect(getSafeNextPath(formData.get("next")) ?? "/onboarding")
}

export async function signOutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}

export async function createInitialOrganizationAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const validation = validateInitialOrganizationForm(formData)
  if (!validation.ok) {
    return errorState(validation.error)
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return errorState("You must sign in before creating an organization.")
  }

  const { error } = await supabase.rpc("create_initial_organization", {
    p_org_name: validation.data.organizationName,
    p_full_name: validation.data.fullName,
    p_phone: validation.data.phone,
  })

  if (error) {
    return errorState(
      "Unable to create the organization. Your account may already be onboarded.",
    )
  }

  redirect("/dashboard")
}

export async function acceptPendingInviteAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const validation = validateInviteAcceptanceForm(formData)
  if (!validation.ok) {
    return errorState(validation.error)
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return errorState("You must sign in before accepting an invite.")
  }

  const { error } = await supabase.rpc("accept_pending_invite", {
    p_token: validation.data.token,
    p_full_name: validation.data.fullName,
    p_phone: validation.data.phone,
  })

  if (error) {
    return errorState(
      "Unable to accept this invite. It may be invalid, expired, already used, or issued to another email.",
    )
  }

  redirect("/dashboard")
}
