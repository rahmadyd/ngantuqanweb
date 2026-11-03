import { Container } from "@/components/ui";
import { getPublicNav } from "@/lib/nav";
import { SecretLogo } from "./SecretLogo";
import styles from "./Header.module.css";

type HeaderProps = {
  shopEnabled: boolean;
  pathname?: string;
};

export function Header({ shopEnabled, pathname = "/" }: HeaderProps) {
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
          </div>
        </details>
      </Container>
    </header>
  );
}
