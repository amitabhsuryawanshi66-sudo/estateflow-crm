import { redirect } from "next/navigation"

import { signOutAction } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { getCurrentAccount } from "@/lib/auth/account"

export default async function DashboardPage() {
  const account = await getCurrentAccount()

  if (account.state === "signed-out") {
    redirect("/login")
  }

  if (account.state === "needs-profile" || !account.profile) {
    redirect("/onboarding")
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-12">
      <section className="mx-auto max-w-3xl rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-semibold tracking-wide text-zinc-500">
              EstateFlow CRM
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
              Authentication is working
            </h1>
            <p className="text-zinc-600">
              Signed in as {account.profile.fullName}
              {account.user?.email ? ` (${account.user.email})` : ""}.
            </p>
            <p className="text-sm text-zinc-500">
              Role: {account.profile.role.replaceAll("_", " ")}
            </p>
          </div>
          <form action={signOutAction}>
            <Button variant="outline">Sign out</Button>
          </form>
        </div>
      </section>
    </main>
  )
}
