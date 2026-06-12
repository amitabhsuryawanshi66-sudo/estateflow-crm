import Link from "next/link"
import type { ReactNode } from "react"

type AuthCardProps = {
  title: string
  description: string
  children: ReactNode
  footer?: {
    text: string
    href: string
    label: string
  }
}

export function AuthCard({
  title,
  description,
  children,
  footer,
}: AuthCardProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12">
      <section className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 space-y-2">
          <p className="text-sm font-semibold tracking-wide text-zinc-500">
            EstateFlow CRM
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
            {title}
          </h1>
          <p className="text-sm leading-6 text-zinc-600">{description}</p>
        </div>
        {children}
        {footer ? (
          <p className="mt-6 text-center text-sm text-zinc-600">
            {footer.text}{" "}
            <Link
              className="font-medium text-zinc-950 underline underline-offset-4"
              href={footer.href}
            >
              {footer.label}
            </Link>
          </p>
        ) : null}
      </section>
    </main>
  )
}
