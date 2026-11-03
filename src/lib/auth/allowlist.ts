function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => normalizeEmail(e))
    .filter((e): e is string => Boolean(e));
}

export function isAllowlistedEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  const normalized = normalizeEmail(email);
  return getAdminEmails().includes(normalized);
}
