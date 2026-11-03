import { headers } from "next/headers";
import { getAdminSession } from "@/lib/auth/session";
import { isShopEnabled } from "@/lib/settings";
import { AdminBar } from "./AdminBar";
import { Footer } from "./Footer";
import { Header } from "./Header";

export async function PublicChrome({ children }: { children: React.ReactNode }) {
  const [shopEnabled, admin, headerList] = await Promise.all([
    isShopEnabled(),
    getAdminSession(),
    headers(),
  ]);
  const pathname = headerList.get("x-pathname") ?? "/";

  return (
    <>
      <a className="sr-only" href="#konten">
        Lompat ke konten
      </a>
      <Header shopEnabled={shopEnabled} pathname={pathname} />
      <div id="konten">{children}</div>
      <Footer shopEnabled={shopEnabled} />
      {admin ? <AdminBar /> : null}
    </>
  );
}
