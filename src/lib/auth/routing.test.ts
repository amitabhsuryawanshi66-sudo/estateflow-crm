import assert from "node:assert/strict"
import test from "node:test"

import { getAuthRedirect, getSafeNextPath } from "./routing.ts"

test("signed-out users are redirected from the dashboard to login", () => {
  assert.equal(getAuthRedirect("/dashboard", "signed-out"), "/login")
})

test("authenticated users without a profile are redirected to onboarding", () => {
  assert.equal(getAuthRedirect("/dashboard", "needs-profile"), "/onboarding")
})

test("authenticated users without a profile leave login for onboarding", () => {
  assert.equal(getAuthRedirect("/login", "needs-profile"), "/onboarding")
})

test("authenticated users with a profile leave auth routes for dashboard", () => {
  assert.equal(getAuthRedirect("/login", "ready"), "/dashboard")
  assert.equal(getAuthRedirect("/signup", "ready"), "/dashboard")
  assert.equal(getAuthRedirect("/onboarding", "ready"), "/dashboard")
})

test("invite acceptance remains available to an authenticated user without a profile", () => {
  assert.equal(getAuthRedirect("/invite/accept", "needs-profile"), null)
})

test("signed-out invite recipients are sent to login", () => {
  assert.equal(getAuthRedirect("/invite/accept", "signed-out"), "/login")
})

test("post-auth redirects only preserve local invite acceptance paths", () => {
  assert.equal(
    getSafeNextPath("/invite/accept?token=raw-token"),
    "/invite/accept?token=raw-token",
  )
  assert.equal(getSafeNextPath("//evil.example/invite/accept"), null)
  assert.equal(getSafeNextPath("/dashboard"), null)
})
