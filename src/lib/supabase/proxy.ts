import { createServerClient } from "@supabase/ssr"
import { type NextRequest, NextResponse } from "next/server"

import { getAuthRedirect, type AccountState } from "@/lib/auth/routing"
import { getProfileRow } from "@/lib/auth/profile-lookup"
import type { Database } from "@/types/database"

import { getSupabasePublicEnv } from "./env"

function copyResponseCookies(source: NextResponse, target: NextResponse) {
  source.cookies.getAll().forEach((cookie) => {
    target.cookies.set(cookie)
  })
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })
  const { url, anonKey } = getSupabasePublicEnv()

  const supabase = createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value)
        })

        response = NextResponse.next({ request })

        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options)
        })
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let accountState: AccountState = "signed-out"

  if (user) {
    const profileResult = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .limit(1)

    const profile = getProfileRow(profileResult)
    accountState = profile ? "ready" : "needs-profile"
  }

  const redirectPath = getAuthRedirect(
    request.nextUrl.pathname,
    accountState,
  )

  if (!redirectPath) {
    return response
  }

  const redirectUrl = request.nextUrl.clone()
  redirectUrl.pathname = redirectPath
  redirectUrl.search = ""

  if (
    redirectPath === "/login" &&
    request.nextUrl.pathname === "/invite/accept"
  ) {
    redirectUrl.searchParams.set(
      "next",
      `${request.nextUrl.pathname}${request.nextUrl.search}`,
    )
  }

  const redirectResponse = NextResponse.redirect(redirectUrl)
  copyResponseCookies(response, redirectResponse)
  return redirectResponse
}
