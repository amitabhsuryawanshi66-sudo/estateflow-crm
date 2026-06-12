import { redirect } from "next/navigation"

import { AuthCard } from "@/components/auth/auth-card"
import { InviteForm } from "@/components/auth/invite-form"
import { getCurrentAccount } from "@/lib/auth/account"

type InvitePageProps = {
  searchParams: Promise<{ token?: string | string[] }>
}

export default async function InviteAcceptPage({
  searchParams,
}: InvitePageProps) {
  const params = await searchParams
  const tokenValue = Array.isArray(params.token)
    ? params.token[0]
    : params.token
  const token = tokenValue?.trim() ?? ""
  const account = await getCurrentAccount()

  if (account.state === "signed-out") {
    const nextPath = token
      ? `/invite/accept?token=${encodeURIComponent(token)}`
      : "/invite/accept"
    redirect(`/login?next=${encodeURIComponent(nextPath)}`)
  }

  if (account.state === "ready") {
    redirect("/dashboard")
  }

  return (
    <AuthCard
      description="Accept the invitation using the same email address it was issued to."
      title="Join an organization"
    >
      <InviteForm
        defaultFullName={account.user?.fullName ?? ""}
        token={token}
      />
    </AuthCard>
  )
}
