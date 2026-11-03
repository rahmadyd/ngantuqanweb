import { getPublicNav } from "@/lib/nav";
import { Container } from "@/components/ui";
import styles from "./Footer.module.css";

type FooterProps = {
  shopEnabled: boolean;
};

export function Footer({ shopEnabled }: FooterProps) {
  const items = getPublicNav(shopEnabled);

  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.inner}>
          <div>
            <p className={styles.brand}>Ngantuqan</p>
            <p className={styles.copy}>Karya visual, project, dan merch.</p>
          </div>
          <nav className={styles.nav} aria-label="Footer">
            {items.map((item) => (
              <a key={item.href} href={item.href} className={styles.link}>
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </Container>
    </footer>
  );
}
