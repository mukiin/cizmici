import { redirect } from "next/navigation";

/** Stara "ostalo" stranica — sadržaj je sada podijeljen po sekcijama. */
export default function AdminOstaloRedirect() {
  redirect("/admin/sadrzaj");
}
