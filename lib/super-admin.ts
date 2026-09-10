/** Trajni vlasnik / super-admin — ne smije se degradirati ni obrisati. */
export const SUPER_ADMIN_EMAIL = "cizmicm@cizmici.net";
export const SUPER_ADMIN_NAME = "cizmicm";

export function isSuperAdminEmail(email: string | null | undefined) {
  return (email || "").toLowerCase() === SUPER_ADMIN_EMAIL;
}
