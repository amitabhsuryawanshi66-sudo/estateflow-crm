import assert from "node:assert/strict"
import test from "node:test"

import { getProfileRow } from "./profile-lookup.ts"

test("an empty successful profile lookup means the user needs onboarding", () => {
  assert.equal(
    getProfileRow({
      data: [],
      error: null,
    }),
    null,
  )
})

test("a real profile lookup error remains fatal", () => {
  const databaseError = new Error("database unavailable")

  assert.throws(
    () =>
      getProfileRow({
        data: null,
        error: databaseError,
      }),
    (error) =>
      error instanceof Error &&
      error.message === "Unable to load the authenticated profile." &&
      error.cause === databaseError,
  )
})
