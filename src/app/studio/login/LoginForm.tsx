"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui";
import { signInWithPassword, type LoginState } from "./actions";

import styles from "../studio.module.css";

const initial: LoginState = {};

export function LoginForm() {
  const [state, action, pending] = useActionState(signInWithPassword, initial);

  return (
    <form action={action} className={styles.form}>
      <label className={styles.label}>
        Email
        <input
          className={styles.input}
          type="email"
          name="email"
          autoComplete="email"
          required
          placeholder="kamu@email.com"
        />
      </label>
      <label className={styles.label}>
        Kata sandi
        <input
          className={styles.input}
          type="password"
          name="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
        />
      </label>
      <p className="sr-only" aria-live="polite">
        {state.error ?? ""}
      </p>
      {state.error ? <p className={styles.note}>{state.error}</p> : null}
      <Button type="submit" variant="primary" disabled={pending}>
        {pending ? "Masuk…" : "Masuk"}
      </Button>
    </form>
  );
}