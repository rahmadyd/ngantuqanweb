"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui";
import { sendMagicLink, type LoginState } from "./actions";

const SUCCESS =
  "Kalau email itu terdaftar sebagai admin, tautan masuk sudah dikirim. Cek inbox (dan folder spam).";
import styles from "../studio.module.css";

const initial: LoginState = {};

export function LoginForm() {
  const [state, action, pending] = useActionState(sendMagicLink, initial);

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
      <p className="sr-only" aria-live="polite">
        {state.ok ? SUCCESS : state.error ?? ""}
      </p>
      {state.error ? <p className={styles.note}>{state.error}</p> : null}
      {state.ok ? <p className={styles.note}>{SUCCESS}</p> : null}
      <Button type="submit" variant="primary" disabled={pending}>
        {pending ? "Mengirim…" : "Kirim tautan masuk"}
      </Button>
    </form>
  );
}
