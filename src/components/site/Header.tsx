import Link from "next/link";
import { Container } from "@/components/ui";
import { SecretLogo } from "./SecretLogo";
import { PublicNavbar } from "./PublicNavbar";
import styles from "./Header.module.css";

type HeaderProps = {
  shopEnabled: boolean;
  pathname?: string;
  admin?: { email: string } | null;
};

export function Header({ shopEnabled, pathname = "/", admin }: HeaderProps) {
  return (
    <header className={styles.header}>
      <Container className={styles.inner}>
        <SecretLogo />
        <PublicNavbar shopEnabled={shopEnabled} pathname={pathname} />
        {admin && (
          <Link href="/studio" passHref>
            <a className={styles.link}>Studio</a>
          </Link>
        )}
      </Container>
      <details className={styles.menu}>
        <summary>Menu</summary>
        <div className={styles.drawer}>
          <PublicNavbar shopEnabled={shopEnabled} pathname={pathname} />
          {admin && (
            <Link href="/studio" passHref>
              <a className={styles.link}>Studio</a>
            </Link>
          )}
        </div>
      </details>
    </header>
  );
}
