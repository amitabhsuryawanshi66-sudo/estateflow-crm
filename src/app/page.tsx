import { redirect } from "next/navigation"

import { getCurrentAccount } from "@/lib/auth/account"

export default async function Home() {
  const account = await getCurrentAccount()

  if (account.state === "ready") {
    redirect("/dashboard")
  }

  if (account.state === "needs-profile") {
    redirect("/onboarding")
  }

  redirect("/login")
}
