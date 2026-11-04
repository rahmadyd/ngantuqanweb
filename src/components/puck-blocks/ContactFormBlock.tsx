"use client";

import { useState, useEffect } from "react";
import styles from "./PuckBlocks.module.css";

interface ContactFormBlockProps {
  name: string;
  email: string;
  message: string;
}

export function ContactFormBlock({ name, email, message }: ContactFormBlockProps) {
  const [formData, setFormData] = useState({ name: "", email: "", message: "", honeypot: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [waNumber, setWaNumber] = useState("6281234567890");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => setWaNumber(d.wa_number || "6281234567890"))
      .catch(() => setWaNumber("6281234567890"));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal mengirim");
      }

      setStatus("success");
      setFormData({ name: "", email: "", message: "", honeypot: "" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Terjadi kesalahan");
    }
  };

  return (
    <section className={styles.contactForm}>
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <input
          type="hidden"
          name="honeypot"
          value={formData.honeypot}
          onChange={(e) => setFormData(prev => ({ ...prev, honeypot: e.target.value }))}
          tabIndex={-1}
          autoComplete="off"
          style={{ display: "none" }}
        />
        <div className={styles.field}>
          <label htmlFor="contact-name" className={styles.label}>Nama</label>
          <input
            id="contact-name"
            type="text"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
            className={styles.input}
            disabled={status === "submitting"}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="contact-email" className={styles.label}>Email</label>
          <input
            id="contact-email"
            type="email"
            name="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            required
            className={styles.input}
            disabled={status === "submitting"}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="contact-message" className={styles.label}>Pesan</label>
          <textarea
            id="contact-message"
            name="message"
            value={formData.message}
            onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
            required
            rows={5}
            className={styles.textarea}
            disabled={status === "submitting"}
          />
        </div>
        <div className={styles.actions}>
          <button type="submit" className={styles.submitBtn} disabled={status === "submitting"}>
            {status === "submitting" ? "Mengirim..." : "Kirim Pesan"}
          </button>
          <a
            href={`https://wa.me/${waNumber}?text=Halo,%20saya%20ingin%20berkontak%20melalui%20WhatsApp`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.whatsappBtn}
          >
            Via WhatsApp
          </a>
        </div>
        {status === "success" && (
          <p className={styles.successMsg}>Pesan terkirim! Kami akan balas segera.</p>
        )}
        {status === "error" && (
          <p className={styles.errorMsg} role="alert">{errorMsg}</p>
        )}
      </form>
    </section>
  );
}