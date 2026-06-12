export type ValidationResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string }

function getRequiredString(
  formData: FormData,
  field: string,
  label: string,
): ValidationResult<string> {
  const value = formData.get(field)

  if (typeof value !== "string" || value.trim() === "") {
    return { ok: false, error: `${label} is required.` }
  }

  return { ok: true, data: value.trim() }
}

function getRequiredPassword(
  formData: FormData,
): ValidationResult<string> {
  const value = formData.get("password")

  if (typeof value !== "string" || value.length === 0) {
    return { ok: false, error: "Password is required." }
  }

  return { ok: true, data: value }
}

export function validateSignInForm(
  formData: FormData,
): ValidationResult<{ email: string; password: string }> {
  const email = getRequiredString(formData, "email", "Email")
  if (!email.ok) {
    return email
  }

  const password = getRequiredPassword(formData)
  if (!password.ok) {
    return password
  }

  return {
    ok: true,
    data: {
      email: email.data.toLowerCase(),
      password: password.data,
    },
  }
}

export function validateSignUpForm(
  formData: FormData,
): ValidationResult<{
  fullName: string
  email: string
  password: string
}> {
  const fullName = getRequiredString(formData, "fullName", "Full name")
  if (!fullName.ok) {
    return fullName
  }

  const credentials = validateSignInForm(formData)
  if (!credentials.ok) {
    return credentials
  }

  return {
    ok: true,
    data: {
      fullName: fullName.data,
      ...credentials.data,
    },
  }
}

function getOptionalString(formData: FormData, field: string): string | null {
  const value = formData.get(field)

  if (typeof value !== "string" || value.trim() === "") {
    return null
  }

  return value.trim()
}

export function validateInitialOrganizationForm(
  formData: FormData,
): ValidationResult<{
  organizationName: string
  fullName: string
  phone: string | null
}> {
  const organizationName = getRequiredString(
    formData,
    "organizationName",
    "Organization name",
  )
  if (!organizationName.ok) {
    return organizationName
  }

  const fullName = getRequiredString(formData, "fullName", "Full name")
  if (!fullName.ok) {
    return fullName
  }

  return {
    ok: true,
    data: {
      organizationName: organizationName.data,
      fullName: fullName.data,
      phone: getOptionalString(formData, "phone"),
    },
  }
}

export function validateInviteAcceptanceForm(
  formData: FormData,
): ValidationResult<{
  token: string
  fullName: string
  phone: string | null
}> {
  const token = getRequiredString(formData, "token", "Invite token")
  if (!token.ok) {
    return token
  }

  const fullName = getRequiredString(formData, "fullName", "Full name")
  if (!fullName.ok) {
    return fullName
  }

  return {
    ok: true,
    data: {
      token: token.data,
      fullName: fullName.data,
      phone: getOptionalString(formData, "phone"),
    },
  }
}
