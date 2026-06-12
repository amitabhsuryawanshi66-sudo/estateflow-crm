import { redirect } from "next/navigation"

import { AuthCard } from "@/components/auth/auth-card"
import { LoginForm } from "@/components/auth/login-form"
import { getCurrentAccount } from "@/lib/auth/account"
import { getSafeNextPath } from "@/lib/auth/routing"

type LoginPageProps = {
  searchParams: Promise<{ next?: string | string[] }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
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
  const signupHref = nextPath
    ? `/signup?next=${encodeURIComponent(nextPath)}`
    : "/signup"

  return (
    <AuthCard
      description="Sign in to continue to your organization."
      footer={{
        text: "Need an account?",
        href: signupHref,
        label: "Sign up",
      }}
      title="Welcome back"
    >
      <LoginForm nextPath={nextPath} />
    </AuthCard>
  )
}
