import { redirect } from "next/navigation"

import { AuthCard } from "@/components/auth/auth-card"
import { SignupForm } from "@/components/auth/signup-form"
import { getCurrentAccount } from "@/lib/auth/account"
import { getSafeNextPath } from "@/lib/auth/routing"

type SignupPageProps = {
  searchParams: Promise<{ next?: string | string[] }>
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const account = await getCurrentAccount()

  if (account.state === "ready") {
    redirect("/dashboard")
  }

  if (account.state === "needs-profile") {
    redirect("/onboarding")
  }

  const params = await searchParams
  const nextValue = Array.isArray(params.next) ? params.next[0] : params.next
  const nextPath = getSafeNextPath(nextValue ?? null)
  const loginHref = nextPath
    ? `/login?next=${encodeURIComponent(nextPath)}`
    : "/login"

  return (
    <AuthCard
      description="Create your account, then create an organization or accept an invite."
      footer={{
        text: "Already have an account?",
        href: loginHref,
        label: "Sign in",
      }}
      title="Create your account"
    >
      <SignupForm nextPath={nextPath} />
    </AuthCard>
  )
}
