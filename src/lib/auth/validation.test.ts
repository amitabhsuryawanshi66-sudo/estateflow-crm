import assert from "node:assert/strict"
import test from "node:test"

import {
  validateInviteAcceptanceForm,
  validateInitialOrganizationForm,
  validateSignInForm,
  validateSignUpForm,
} from "./validation.ts"

test("sign in normalizes a required email and preserves the password", () => {
  const formData = new FormData()
  formData.set("email", "  Agent@Example.COM ")
  formData.set("password", " correct horse battery staple ")

  assert.deepEqual(validateSignInForm(formData), {
    ok: true,
    data: {
      email: "agent@example.com",
      password: " correct horse battery staple ",
    },
  })
})

test("invite acceptance requires the raw token without transforming it", () => {
  const formData = new FormData()
  formData.set("token", " Raw-Invite_Token.123 ")
  formData.set("fullName", " Asha Singh ")
  formData.set("phone", "+91 98765 43210")

  assert.deepEqual(validateInviteAcceptanceForm(formData), {
    ok: true,
    data: {
      token: "Raw-Invite_Token.123",
      fullName: "Asha Singh",
      phone: "+91 98765 43210",
    },
  })
})

test("initial organization requires names and treats an empty phone as null", () => {
  const formData = new FormData()
  formData.set("organizationName", "  North Star Realty ")
  formData.set("fullName", " Asha Singh ")
  formData.set("phone", "   ")

  assert.deepEqual(validateInitialOrganizationForm(formData), {
    ok: true,
    data: {
      organizationName: "North Star Realty",
      fullName: "Asha Singh",
      phone: null,
    },
  })
})

test("sign up requires and trims a full name", () => {
  const formData = new FormData()
  formData.set("fullName", "  Asha Singh  ")
  formData.set("email", " ASHA@EXAMPLE.COM ")
  formData.set("password", "secret")

  assert.deepEqual(validateSignUpForm(formData), {
    ok: true,
    data: {
      fullName: "Asha Singh",
      email: "asha@example.com",
      password: "secret",
    },
  })
})
