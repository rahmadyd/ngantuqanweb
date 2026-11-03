"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import styles from "./Header.module.css";

type SecretLogoProps = {
  className?: string;
};

const WINDOW_MS = 2000;
const CLICKS_NEEDED = 5;

export function SecretLogo({ className }: SecretLogoProps) {
  const router = useRouter();
  const stamps = useRef<number[]>([]);

  function onClick(event: React.MouseEvent<HTMLAnchorElement>) {
    const now = Date.now();
    stamps.current = [...stamps.current.filter((t) => now - t < WINDOW_MS), now];
    if (stamps.current.length >= CLICKS_NEEDED) {
      event.preventDefault();
      stamps.current = [];
      router.push("/studio/login");
    }
  }

  return (
    <Link href="/" className={className ?? styles.logo} onClick={onClick}>
      <span className={styles.logoMark} aria-hidden>
        N
      </span>
      Ngantuqan
    </Link>
  );
}
