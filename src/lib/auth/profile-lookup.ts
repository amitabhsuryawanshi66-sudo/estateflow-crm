type ProfileQueryResult<T> = {
  data: T[] | null
  error: unknown
}

export function getProfileRow<T>({
  data,
  error,
}: ProfileQueryResult<T>): T | null {
  if (error) {
    throw new Error("Unable to load the authenticated profile.", {
      cause: error,
    })
  }

  return data?.[0] ?? null
}
