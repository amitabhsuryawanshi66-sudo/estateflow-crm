import type { SupabaseClient } from "@supabase/supabase-js"
import { cache } from "react"

import type { AccountState } from "@/lib/auth/routing"
import { createClient } from "@/lib/supabase/server"
import type { Database, UserRole } from "@/types/database"

import { getProfileRow } from "./profile-lookup"

type AccountUser = {
  email: string | null
  fullName: string | null
}

type AccountProfile = {
  fullName: string
  role: UserRole
}

export type CurrentAccount = {
  state: AccountState
  user: AccountUser | null
  profile: AccountProfile | null
}

function getMetadataFullName(metadata: unknown): string | null {
  if (
    typeof metadata === "object" &&
    metadata !== null &&
    "full_name" in metadata &&
    typeof metadata.full_name === "string"
  ) {
    const fullName = metadata.full_name.trim()
    return fullName === "" ? null : fullName
  }

  return null
}

export async function getAccountWithClient(
  supabase: SupabaseClient<Database>,
): Promise<CurrentAccount> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { state: "signed-out", user: null, profile: null }
  }

  const profileResult = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .limit(1)

  const accountUser = {
    email: user.email ?? null,
    fullName: getMetadataFullName(user.user_metadata),
  }
  const profile = getProfileRow(profileResult)

  if (!profile) {
    return {
      state: "needs-profile",
      user: accountUser,
      profile: null,
    }
  }

  return {
    state: "ready",
    user: accountUser,
    profile: {
      fullName: profile.full_name,
      role: profile.role,
    },
  }
}

export const getCurrentAccount = cache(async () => {
  const supabase = await createClient()
  return getAccountWithClient(supabase)
})
