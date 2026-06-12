import { redirect } from "next/navigation"

import { AuthCard } from "@/components/auth/auth-card"
import { OnboardingForm } from "@/components/auth/onboarding-form"
import { getCurrentAccount } from "@/lib/auth/account"

export default async function OnboardingPage() {
  const account = await getCurrentAccount()

  if (account.state === "signed-out") {
    redirect("/login")
  }

  if (account.state === "ready") {
    redirect("/dashboard")
  }

  return (
    <AuthCard
      description="Create the first organization for this account. You will become its administrator."
      title="Set up your organization"
    >
      <OnboardingForm defaultFullName={account.user?.fullName ?? ""} />
    </AuthCard>
  )
}
