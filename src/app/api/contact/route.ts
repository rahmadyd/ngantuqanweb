import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { z } from "zod";
import { consumeRateLimit } from "@/lib/rate-limit";

const contactSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi").max(100),
  email: z.string().email("Email tidak valid").max(100),
  message: z.string().min(10, "Pesan minimal 10 karakter").max(2000),
  honeypot: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    // Rate limit
    const ip = request.headers.get("x-forwarded-for") ?? "anonymous";
    const { ok: success } = await consumeRateLimit(`contact:${ip}`, 5, 60 * 60 * 1000); // 5 req/jam
    if (!success) {
      return NextResponse.json({ error: "Terlalu banyak percobaan. Coba lagi nanti." }, { status: 429 });
    }

    const body = await request.json();
    
    // Honeypot check
    if (body.honeypot) {
      return NextResponse.json({ success: true }); // Silently ignore spam
    }

    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const { name, email, message } = parsed.data;

    // Kirim email via Resend
    const resendKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_TO_EMAIL;
    
    if (resendKey && toEmail) {
      try {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Ngantuqan <noreply@ngantuqan.com>",
            to: [toEmail],
            subject: `Pesan Baru dari ${name} (${email})`,
            html: `
              <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px;">
                <h2 style="color: #0C3B35; margin: 0 0 16px;">Pesan Baru dari Website</h2>
                <p style="margin: 8px 0;"><strong>Nama:</strong> ${name}</p>
                <p style="margin: 8px 0;"><strong>Email:</strong> ${email}</p>
                <p style="margin: 8px 0;"><strong>Pesan:</strong></p>
                <div style="background: #f9fafb; padding: 16px; border-radius: 8px; white-space: pre-wrap;">${message}</div>
                <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; font-size: 12px;">Dikirim dari form kontak Ngantuqan</p>
              </div>
            `,
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          console.error("Resend error:", err);
        }
      } catch (err) {
        console.error("Resend fetch error:", err);
      }
    }

    // Simpan ke database
    const supabase = await import("@/lib/supabase/server").then(m => m.createSupabaseServer());
    const { error: dbError } = await supabase
      .from("messages")
      .insert({ name, email, body: message });

    if (dbError) {
      console.error("DB insert error:", dbError);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}