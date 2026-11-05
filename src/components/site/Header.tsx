import Link from "next/link";
import { Container } from "@/components/ui";
import { getPublicNav } from "@/lib/nav";
import { SecretLogo } from "./SecretLogo";
import styles from "./Header.module.css";

type HeaderProps = {
  shopEnabled: boolean;
  pathname?: string;
  admin?: { email: string } | null;
};

export function Header({ shopEnabled, pathname = "/", admin }: HeaderProps) {
  const items = getPublicNav(shopEnabled);

  return (
    <header className={styles.header}>
      <Container className={styles.inner}>
        <SecretLogo />
        <nav className={styles.nav} aria-label="Utama">
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={styles.link}
              aria-current={pathname === item.href ? "page" : undefined}
            >
              {item.label}
            </a>
          ))}
          {admin && (
            <Link href="/studio" passHref>
              <a className={styles.link}>Studio</a>
            </Link>
          )}
        </nav>
        <details className={styles.menu}>
          <summary>Menu</summary>
          <div className={styles.drawer}>
            {items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={styles.link}
                aria-current={pathname === item.href ? "page" : undefined}
              >
                {item.label}
              </a>
            ))}
            {admin && (
              <Link href="/studio" passHref>
                <a className={styles.link}>Studio</a>
              </Link>
            )}
          </div>
        </details>
      </Container>
    </header>
  );
}
