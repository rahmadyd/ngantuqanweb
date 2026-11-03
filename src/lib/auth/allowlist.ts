function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map(normalizeEmail)
    .filter(Boolean);
}

export function isAllowlistedEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  return getAdminEmails().includes(normalizeEmail(email));
}
