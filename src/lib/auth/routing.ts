export type AccountState = "signed-out" | "needs-profile" | "ready"

export function getSafeNextPath(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string") {
    return null
  }

  try {
    const baseUrl = new URL("https://estateflow.local")
    const destination = new URL(value, baseUrl)

    if (
      destination.origin !== baseUrl.origin ||
      destination.pathname !== "/invite/accept"
    ) {
      return null
    }

    return `${destination.pathname}${destination.search}`
  } catch {
    return null
  }
}

export function getAuthRedirect(
  pathname: string,
  accountState: AccountState,
): string | null {
  const isSignedOutRoute =
    pathname.startsWith("/login") || pathname.startsWith("/signup")

  if (accountState === "signed-out" && !isSignedOutRoute) {
    return "/login"
  }

  if (
    accountState === "needs-profile" &&
    !pathname.startsWith("/onboarding") &&
    !pathname.startsWith("/invite/accept")
  ) {
    return "/onboarding"
  }

  if (accountState === "ready" && !pathname.startsWith("/dashboard")) {
    return "/dashboard"
  }

  return null
}
