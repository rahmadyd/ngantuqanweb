"use client";

import { useState, FormEvent } from "react";
import { Container } from "@/components/ui";
import { Button } from "@/components/ui";
import styles from "./Contact.module.css";

interface ContactField {
  name: string;
  label: string;
  type: "text" | "email" | "textarea";
  placeholder: string;
}

interface ContactProps {
  title: string;
  fields: ContactField[];
  submitLabel: string;
  comingSoonMessage: string;
}

export function Contact({ title, fields, submitLabel, comingSoonMessage }: ContactProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({});
  };

  return (
    <section
      className={styles.section}
      style={{ background: "var(--pop)" }}
      aria-labelledby="contact-title"
    >
      <Container className={styles.container}>
        <div className={styles.console} role="form" aria-label="Form kontak">
          <div className={styles.consoleTop}>
            <div className={styles.consoleButtons}>
              <span className={styles.btnClose} aria-hidden="true" />
              <span className={styles.btnMin} aria-hidden="true" />
              <span className={styles.btnMax} aria-hidden="true" />
            </div>
          </div>
          <div className={styles.consoleScreen}>
            <h2 id="contact-title" className={styles.title}>
              {title}
            </h2>
            {submitted ? (
              <div className={styles.successMessage} role="status" aria-live="polite">
                <p>{comingSoonMessage}</p>
                <button
                  type="button"
                  className={styles.backBtn}
                  onClick={() => setSubmitted(false)}
                >
                  Kembali
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form} noValidate>
                {fields.map((field) => (
                  <div key={field.name} className={styles.fieldGroup}>
                    <label htmlFor={field.name} className={styles.label}>
                      {field.label}
                    </label>
                    {field.type === "textarea" ? (
                      <textarea
                        id={field.name}
                        name={field.name}
                        placeholder={field.placeholder}
                        className={styles.textarea}
                        value={formData[field.name] || ""}
                        onChange={handleChange}
                        required
                        rows={4}
                      />
                    ) : (
                      <input
                        type={field.type}
                        id={field.name}
                        name={field.name}
                        placeholder={field.placeholder}
                        className={styles.input}
                        value={formData[field.name] || ""}
                        onChange={handleChange}
                        required
                      />
                    )}
                  </div>
                ))}
                <Button
                  type="submit"
                  variant="pop"
                  size="lg"
                  className={styles.submitBtn}
                  aria-label={submitLabel}
                >
                  {submitLabel}
                </Button>
              </form>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}