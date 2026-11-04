import Link from "next/link";
import type { Config, PuckComponent } from "@puckeditor/core";
import { createSupabaseServer } from "@/lib/supabase/server";
import { getSettings } from "@/lib/settings";
import { getOrderAction } from "@/lib/order";

const validBackgroundTokens = ["brume", "menthe", "limonade", "verveine", "paper"] as const;
const validColorTokens = ["brume", "menthe", "limonade", "verveine", "paper"] as const;
const validPositions = ["top-left", "top-right", "bottom-left", "bottom-right", "center"] as const;

const marqueeStyle = `
  @keyframes marquee {
    from { transform: translateX(100%); }
    to { transform: translateX(-100%); }
  }
  @media (prefers-reduced-motion: reduce) {
    .marquee-track { animation: none; }
  }
`;

function HeroBlock({ title, subtitle, ctaText, ctaLink, backgroundToken, imageUrl }: {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  backgroundToken: string;
  imageUrl: string;
}) {
  const backgroundStyles: Record<string, string> = {
    brume: "var(--brume)",
    menthe: "var(--menthe)",
    limonade: "var(--limonade)",
    verveine: "var(--verveine)",
    paper: "var(--paper)",
  };
  const validToken = validBackgroundTokens.includes(backgroundToken as typeof validBackgroundTokens[number])
    ? backgroundToken
    : "brume";
  const bgStyle = backgroundStyles[validToken] || backgroundStyles.brume;
  return (
    <section style={{ 
      padding: "var(--space-2xl) 0",
      border: "2.5px solid var(--ink)",
      borderRadius: "var(--radius-lg)",
      boxShadow: "4px 4px 0 var(--ink)",
      backgroundColor: bgStyle,
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 var(--space-lg)", display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-lg)", textAlign: "center" }}>
        {imageUrl && (
          <div style={{ width: "100%", maxWidth: "600px", borderRadius: "var(--radius-md)", overflow: "hidden", border: "2px solid var(--ink)" }}>
            <img src={imageUrl} alt={title || "Hero image"} style={{ width: "100%", height: "auto", display: "block" }} width={600} height={400} />
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
          {title && <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, color: "var(--ink)", margin: 0, lineHeight: 1.1 }}>{title}</h1>}
          {subtitle && <p style={{ fontSize: "clamp(1rem, 2.5vw, 1.25rem)", color: "var(--ink)", opacity: 0.8, margin: 0, maxWidth: "60ch" }}>{subtitle}</p>}
          {ctaText && ctaLink && (
            <a href={ctaLink} style={{ 
              display: "inline-block",
              padding: "var(--space-sm) var(--space-xl)",
              background: "var(--ink)",
              color: "var(--paper)",
              fontWeight: 700,
              textDecoration: "none",
              border: "2.5px solid var(--ink)",
              borderRadius: "var(--radius-md)",
              boxShadow: "4px 4px 0 var(--ink)",
            }}>
              {ctaText}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

function MarqueeBlock({ text, direction, speed, color }: {
  text: string;
  direction: "left" | "right";
  speed: number;
  color: string;
}) {
  const colorStyles: Record<string, string> = {
    brume: "var(--brume)",
    menthe: "var(--menthe)",
    limonade: "var(--limonade)",
    verveine: "var(--verveine)",
    paper: "var(--paper)",
  };
  const duration = Math.max(5, 50 - speed);
  const texts = text.split(/\n+/).filter(t => t.trim()).map(t => t.replace(/<[^>]*>/g, '').trim()).filter(Boolean);
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: marqueeStyle }} />
      <div style={{ 
        overflow: "hidden",
        border: "2.5px solid var(--ink)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "4px 4px 0 var(--ink)",
        backgroundColor: "var(--ink)",
        color: "var(--paper)",
        padding: "var(--space-md) 0",
      }}>
        <div className="marquee-track" style={{ 
          display: "flex",
          animation: `marquee ${duration}s linear infinite`,
          animationDirection: direction === "left" ? "normal" : "reverse",
          whiteSpace: "nowrap",
        }}>
          {texts.flatMap((text, i) => [
            <span key={i} style={{ display: "inline-block", padding: "0 var(--space-xl)", fontSize: "clamp(1.25rem, 3vw, 2rem)", fontWeight: 700 }}>{text}</span>,
            <span key={`sep-${i}`} style={{ display: "inline-block", padding: "0 var(--space-xl)", fontSize: "clamp(1.25rem, 3vw, 2rem)", fontWeight: 700 }}> • </span>,
          ])}
        </div>
      </div>
    </>
  );
}

function AboutPillBlock({ label, paragraph, linkText, linkUrl }: {
  label: string;
  paragraph: string;
  linkText: string;
  linkUrl: string;
}) {
  return (
    <div style={{ 
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      gap: "var(--space-md)",
      padding: "var(--space-lg)",
      border: "2.5px solid var(--ink)",
      borderRadius: "var(--radius-lg)",
      boxShadow: "4px 4px 0 var(--ink)",
      background: "var(--paper)",
    }}>
      {label && <span style={{ padding: "var(--space-xs) var(--space-lg)", background: "var(--ink)", color: "var(--paper)", fontWeight: 700, fontSize: "clamp(0.875rem, 2vw, 1rem)", borderRadius: "var(--radius-full)", whiteSpace: "nowrap" }}>{label}</span>}
      {paragraph && <p style={{ flex: 1, minWidth: "200px", color: "var(--ink)", margin: 0, fontSize: "clamp(1rem, 2vw, 1.125rem)", lineHeight: 1.6 }}>{paragraph}</p>}
      {linkText && linkUrl && <a href={linkUrl} style={{ color: "var(--ink)", textDecoration: "underline", fontWeight: 700 }}>{linkText}</a>}
    </div>
  );
}

function ProjectGridBlock({ quantity, showFilter, showTab }: {
  quantity: "4" | "6" | "all";
  showFilter: boolean;
  showTab: boolean;
}) {
  return (
    <section style={{ padding: "var(--space-lg) 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)", flexWrap: "wrap", gap: "var(--space-md)" }}>
        <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, color: "var(--ink)", margin: 0 }}>Proyek</h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "var(--space-lg)" }}>
        <p style={{ gridColumn: "1 / -1", textAlign: "center", color: "var(--ink)", opacity: 0.6 }}>Proyek akan muncul di sini setelah dipublikasikan.</p>
      </div>
    </section>
  );
}

async function ProductGridBlock({ quantity, showFeaturedOnly }: {
  quantity: "4" | "6" | "all";
  showFeaturedOnly: boolean;
}) {
  const settings = await getSettings();
  if (!settings.shop_enabled) return null;

  const supabase = await createSupabaseServer();
  let query = supabase
    .from("items")
    .select("slug, title, summary, cover_image, price_idr, is_sold_out, is_featured, order_url, order_label")
    .eq("kind", "shop")
    .eq("is_published", true)
    .order("sort_order");

  if (showFeaturedOnly) {
    query = query.eq("is_featured", true);
  }
  if (quantity !== "all") {
    query = query.limit(parseInt(quantity, 10));
  }

  const { data: products } = await query;
  const items = products ?? [];

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return (
    <section style={{ padding: "var(--space-lg) 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)", flexWrap: "wrap", gap: "var(--space-md)" }}>
        <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, color: "var(--ink)", margin: 0 }}>Produk</h2>
      </div>
      {items.length === 0 ? (
        <p style={{ textAlign: "center", color: "var(--ink)", opacity: 0.6, padding: "var(--space-xl)" }}>Belum ada produk.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "var(--space-lg)" }}>
          {(function () {
            return items.map((product) => {
              const orderAction = getOrderAction(
                {
                  order_url: product.order_url,
                  order_label: product.order_label,
                  title: product.title,
                  slug: product.slug,
                  is_sold_out: product.is_sold_out,
                  kind: "shop" as const,
                },
                {
                  wa_number: settings.wa_number,
                  order_button_label: settings.order_button_label,
                },
                baseUrl,
              );

              return (
                <article key={product.slug} style={{
                  border: "2.5px solid var(--ink)",
                  borderRadius: "var(--radius-lg)",
                  boxShadow: "4px 4px 0 var(--ink)",
                  overflow: "hidden",
                  background: "var(--paper)",
                  display: "flex",
                  flexDirection: "column",
                }}>
                  {product.cover_image && (
                    <Link href={`/karya/${product.slug}`}>
                      <img src={product.cover_image} alt={product.title} style={{ width: "100%", aspectRatio: "1 / 1", objectFit: "cover", display: "block" }} width={400} height={400} />
                    </Link>
                  )}
                  <div style={{ padding: "var(--space-md)", display: "flex", flexDirection: "column", flex: 1 }}>
                    <Link href={`/karya/${product.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                      <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--ink)", margin: "0 0 var(--space-xs)" }}>{product.title}</h3>
                    </Link>
                    {product.price_idr != null && (
                      <p style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--verveine)", margin: "var(--space-xs) 0" }}>
                        Rp {product.price_idr.toLocaleString("id-ID")}
                      </p>
                    )}
                    {product.is_sold_out && <p style={{ color: "var(--pop)", fontWeight: 700, margin: "var(--space-xs) 0" }}>Habis</p>}
                    {orderAction && (
                      <a
                        href={orderAction.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          marginTop: "auto",
                          padding: "var(--space-sm) var(--space-lg)",
                          background: "var(--ink)",
                          color: "var(--paper)",
                          border: "2.5px solid var(--ink)",
                          borderRadius: "var(--radius-md)",
                          fontWeight: 700,
                          textDecoration: "none",
                          textAlign: "center",
                        }}
                      >
                        {product.is_sold_out ? "Habis" : orderAction.label}
                      </a>
                    )}
                  </div>
                </article>
              );
            });
          })()}
        </div>
      )}
    </section>
  );
}

function CTABlock({ title, subtitle, buttonText, buttonLink, backgroundToken }: {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  backgroundToken: string;
}) {
  const backgroundStyles: Record<string, string> = {
    brume: "var(--brume)",
    menthe: "var(--menthe)",
    limonade: "var(--limonade)",
    verveine: "var(--verveine)",
    paper: "var(--paper)",
  };
  const validToken = validBackgroundTokens.includes(backgroundToken as typeof validBackgroundTokens[number])
    ? backgroundToken
    : "brume";
  const bgStyle = backgroundStyles[validToken] || backgroundStyles.brume;
  return (
    <section style={{ 
      padding: "var(--space-2xl) var(--space-lg)",
      border: "2.5px solid var(--ink)",
      borderRadius: "var(--radius-lg)",
      boxShadow: "4px 4px 0 var(--ink)",
      textAlign: "center",
      backgroundColor: bgStyle,
    }}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        {title && <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 800, color: "var(--ink)", margin: "0 0 var(--space-md)" }}>{title}</h2>}
        {subtitle && <p style={{ fontSize: "clamp(1rem, 2.5vw, 1.25rem)", color: "var(--ink)", opacity: 0.8, margin: "0 0 var(--space-xl)", lineHeight: 1.6 }}>{subtitle}</p>}
        {buttonText && buttonLink && (
          <a href={buttonLink} style={{ 
            display: "inline-block",
            padding: "var(--space-md) var(--space-2xl)",
            background: "var(--ink)",
            color: "var(--paper)",
            fontWeight: 700,
            textDecoration: "none",
            border: "2.5px solid var(--ink)",
            borderRadius: "var(--radius-md)",
            boxShadow: "4px 4px 0 var(--ink)",
          }}>
            {buttonText}
          </a>
        )}
      </div>
    </section>
  );
}

function CaseStudyBlock({ title, client, project, outcome, imageUrl }: {
  title: string;
  client: string;
  project: string;
  outcome: string;
  imageUrl: string;
}) {
  return (
    <section style={{ 
      padding: "var(--space-2xl) 0",
      border: "2.5px solid var(--ink)",
      borderRadius: "var(--radius-lg)",
      boxShadow: "4px 4px 0 var(--ink)",
      background: "var(--paper)",
    }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 var(--space-lg)" }}>
        {imageUrl && (
          <div style={{ width: "100%", borderRadius: "var(--radius-md)", overflow: "hidden", border: "2px solid var(--ink)", marginBottom: "var(--space-lg)" }}>
            <img src={imageUrl} alt={title} style={{ width: "100%", height: "auto", display: "block" }} width={800} height={500} />
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
          {title && <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 800, color: "var(--ink)", margin: 0 }}>{title}</h2>}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-md)" }}>
            {client && <p style={{ fontSize: "1rem", color: "var(--ink)", margin: 0 }}><strong>Klien:</strong> {client}</p>}
            {project && <p style={{ fontSize: "1rem", color: "var(--ink)", margin: 0 }}><strong>Proyek:</strong> {project}</p>}
          </div>
          {outcome && (
            <div style={{ padding: "var(--space-lg)", background: "var(--brume)", border: "2px solid var(--ink)", borderRadius: "var(--radius-md)" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--ink)", margin: "0 0 var(--space-xs)" }}>Hasil</h3>
              <div style={{ color: "var(--ink)", opacity: 0.8, lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: outcome }} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function GalleryBlock({ images, columns }: {
  images: string[];
  columns: "2" | "3" | "4";
}) {
  const validColumns = ["2", "3", "4"].includes(columns) ? columns : "3";
  const colCount = parseInt(validColumns, 10);

  if (!images.length) {
    return (
      <section style={{ padding: "var(--space-lg) 0" }}>
        <p style={{ textAlign: "center", color: "var(--ink)", opacity: 0.6, padding: "var(--space-xl)" }}>
          Belum ada gambar.
        </p>
      </section>
    );
  }

  return (
    <section style={{ padding: "var(--space-lg) 0" }}>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${colCount}, 1fr)`, gap: "var(--space-md)" }}>
        {images.map((img, idx) => (
          <div key={img} style={{ border: "2.5px solid var(--ink)", borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "4px 4px 0 var(--ink)", background: "var(--paper)" }}>
            <img src={img} alt={`Galeri ${idx + 1}`} style={{ width: "100%", aspectRatio: "3 / 2", objectFit: "cover", display: "block" }} width={600} height={400} loading={idx < 4 ? "eager" : "lazy"} />
          </div>
        ))}
      </div>
    </section>
  );
}

function TestimonialBlock({ name, role, text, company, rating }: {
  name: string;
  role: string;
  text: string;
  company: string;
  rating: number;
}) {
  const stars = "★".repeat(Math.max(1, Math.min(5, Math.round(rating))));
  return (
    <article style={{ 
      padding: "var(--space-xl)",
      border: "2.5px solid var(--ink)",
      borderRadius: "var(--radius-lg)",
      boxShadow: "4px 4px 0 var(--ink)",
      background: "var(--paper)",
      textAlign: "center",
    }}>
      <div style={{ fontSize: "1.5rem", color: "var(--verveine)", marginBottom: "var(--space-md)", lineHeight: 1 }} aria-label={`Rating ${rating} dari 5`}>
        {stars}
      </div>
      <blockquote style={{ fontSize: "clamp(1.125rem, 2.5vw, 1.5rem)", fontStyle: "italic", color: "var(--ink)", margin: "0 0 var(--space-lg)", lineHeight: 1.6 }}>
        &ldquo;{text}&rdquo;
      </blockquote>
      <footer style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)", alignItems: "center" }}>
        <cite style={{ fontWeight: 700, color: "var(--ink)", fontStyle: "normal" }}>{name}</cite>
        {role && <span style={{ fontSize: "0.875rem", color: "var(--ink)", opacity: 0.7 }}>{role}</span>}
        {company && <span style={{ fontSize: "0.875rem", color: "var(--ink)", opacity: 0.5 }}>{company}</span>}
      </footer>
    </article>
  );
}

function TimelineBlock({ events }: {
  events: Array<{ title: string; date: string; description: string }>;
}) {
  if (!events.length) {
    return (
      <section style={{ padding: "var(--space-lg) 0" }}>
        <p style={{ textAlign: "center", color: "var(--ink)", opacity: 0.6, padding: "var(--space-xl)" }}>
          Belum ada event.
        </p>
      </section>
    );
  }

  return (
    <section style={{ padding: "var(--space-lg) 0" }}>
      <ol style={{ listStyle: "none", padding: 0, margin: 0, position: "relative" }}>
        <style dangerouslySetInnerHTML={{ __html: `
          .timeline-list::before {
            content: "";
            position: absolute;
            left: 16px;
            top: 0;
            bottom: 0;
            width: 2.5px;
            background: var(--ink);
          }
        ` }} />
        {events.map((event, idx) => (
          <li key={idx} style={{ display: "flex", gap: "var(--space-md)", paddingLeft: "40px", paddingBottom: "var(--space-xl)", position: "relative" }}>
            <div style={{ 
              flexShrink: 0, 
              width: "20px", 
              height: "20px", 
              borderRadius: "50%", 
              background: "var(--paper)", 
              border: "2.5px solid var(--ink)", 
              boxShadow: "0 0 0 4px var(--brume)", 
              marginLeft: "-40px", 
              position: "relative", 
              zIndex: 1 
            }} />
            <div style={{ flex: 1 }}>
              <time style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--verveine)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "var(--space-xs)" }} dateTime={event.date}>{event.date}</time>
              <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--ink)", margin: "0 0 var(--space-xs)" }}>{event.title}</h3>
              {event.description && <p style={{ color: "var(--ink)", opacity: 0.7, margin: 0, lineHeight: 1.6 }}>{event.description}</p>}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

async function ContactFormBlock() {
  const settings = await getSettings();
  return (
    <section style={{ 
      padding: "var(--space-xl)",
      border: "2.5px solid var(--ink)",
      borderRadius: "var(--radius-lg)",
      boxShadow: "4px 4px 0 var(--ink)",
      background: "var(--paper)",
      maxWidth: "600px",
    }}>
      <p style={{ color: "var(--ink)", textAlign: "center", marginBottom: "var(--space-lg)" }}>
        Form kontak akan berfungsi di versi publik (menggunakan /api/contact).
      </p>
      <form style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
          <label style={{ fontWeight: 700, color: "var(--ink)", fontSize: "0.875rem" }}>Nama</label>
          <input type="text" style={{ padding: "var(--space-sm) var(--space-md)", border: "2.5px solid var(--ink)", borderRadius: "var(--radius-md)", background: "var(--paper)", color: "var(--ink)", fontFamily: "inherit", fontSize: "1rem" }} disabled />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
          <label style={{ fontWeight: 700, color: "var(--ink)", fontSize: "0.875rem" }}>Email</label>
          <input type="email" style={{ padding: "var(--space-sm) var(--space-md)", border: "2.5px solid var(--ink)", borderRadius: "var(--radius-md)", background: "var(--paper)", color: "var(--ink)", fontFamily: "inherit", fontSize: "1rem" }} disabled />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
          <label style={{ fontWeight: 700, color: "var(--ink)", fontSize: "0.875rem" }}>Pesan</label>
          <textarea rows={5} style={{ padding: "var(--space-sm) var(--space-md)", border: "2.5px solid var(--ink)", borderRadius: "var(--radius-md)", background: "var(--paper)", color: "var(--ink)", fontFamily: "inherit", fontSize: "1rem", resize: "vertical", minHeight: "120px" }} disabled />
        </div>
        <div style={{ display: "flex", gap: "var(--space-md)", flexWrap: "wrap", marginTop: "var(--space-md)" }}>
          <button type="button" style={{ padding: "var(--space-md) var(--space-xl)", background: "var(--ink)", color: "var(--paper)", fontWeight: 700, border: "2.5px solid var(--ink)", borderRadius: "var(--radius-md)", cursor: "not-allowed", boxShadow: "2px 2px 0 var(--ink)", opacity: 0.7 }} disabled>
            Kirim Pesan
          </button>
          <a href={`https://wa.me/${settings.wa_number}?text=Halo,%20saya%20ingin%20berkontak%20melalui%20WhatsApp`} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", padding: "var(--space-md) var(--space-xl)", background: "#25D366", color: "white", fontWeight: 700, border: "2.5px solid var(--ink)", borderRadius: "var(--radius-md)", textDecoration: "none", boxShadow: "4px 4px 0 var(--ink)" }}>
            Via WhatsApp
          </a>
        </div>
      </form>
    </section>
  );
}

async function ShopCTABlock({ title, subtitle, buttonText, buttonLink, backgroundToken }: {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  backgroundToken: string;
}) {
  const settings = await getSettings();
  if (!settings.shop_enabled) return null;

  const backgroundStyles: Record<string, string> = {
    brume: "var(--brume)",
    menthe: "var(--menthe)",
    limonade: "var(--limonade)",
    verveine: "var(--verveine)",
    paper: "var(--paper)",
  };
  const validToken = validBackgroundTokens.includes(backgroundToken as typeof validBackgroundTokens[number])
    ? backgroundToken
    : "brume";
  const bgStyle = backgroundStyles[validToken] || backgroundStyles.brume;

  return (
    <section style={{
      padding: "var(--space-2xl) var(--space-lg)",
      border: "2.5px solid var(--ink)",
      borderRadius: "var(--radius-lg)",
      boxShadow: "4px 4px 0 var(--ink)",
      textAlign: "center",
      backgroundColor: bgStyle,
    }}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        {title && <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 800, color: "var(--ink)", margin: "0 0 var(--space-md)" }}>{title}</h2>}
        {subtitle && <p style={{ fontSize: "clamp(1rem, 2.5vw, 1.25rem)", color: "var(--ink)", opacity: 0.8, margin: "0 0 var(--space-xl)", lineHeight: 1.6 }}>{subtitle}</p>}
        {buttonText && buttonLink && (
          <a href={buttonLink} style={{
            display: "inline-block",
            padding: "var(--space-md) var(--space-2xl)",
            background: "var(--ink)",
            color: "var(--paper)",
            fontWeight: 700,
            textDecoration: "none",
            border: "2.5px solid var(--ink)",
            borderRadius: "var(--radius-md)",
            boxShadow: "4px 4px 0 var(--ink)",
          }}>
            {buttonText}
          </a>
        )}
      </div>
    </section>
  );
}

function RichTextBlock({ content }: {
  content: string;
}) {
  if (!content) {
    return (
      <div style={{ color: "var(--ink)", lineHeight: 1.8, fontSize: "1.0625rem", minHeight: "var(--space-xl)", opacity: 0.5 }}>
        <em>Konten rich text (klik untuk edit)</em>
      </div>
    );
  }
  return (
    <div
      style={{ color: "var(--ink)", lineHeight: 1.8, fontSize: "1.0625rem" }}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

function SpacerBlock({ size }: {
  size: "S" | "M" | "L";
}) {
  const sizeStyles: Record<string, string> = {
    S: "var(--space-md)",
    M: "var(--space-xl)",
    L: "var(--space-2xl)",
  };
  const height = sizeStyles[size] || sizeStyles.M;
  return <div style={{ height }} aria-hidden="true" />;
}

function StickerLayerBlock({ imageUrl, label, position }: {
  imageUrl: string;
  label: string;
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";
}) {
  if (!imageUrl) {
    return (
      <div style={{ position: "absolute", opacity: 0 }} aria-hidden="true">
        <span style={{ fontSize: "0.75rem", color: "var(--ink)", opacity: 0.5 }}>Stiker dekoratif (tambahkan URL gambar)</span>
      </div>
    );
  }

  const positionStyles: Record<string, React.CSSProperties> = {
    "top-left": { top: "var(--space-lg)", left: "var(--space-lg)", right: "auto", bottom: "auto" },
    "top-right": { top: "var(--space-lg)", right: "var(--space-lg)", left: "auto", bottom: "auto" },
    "bottom-left": { bottom: "var(--space-lg)", left: "var(--space-lg)", right: "auto", top: "auto" },
    "bottom-right": { bottom: "var(--space-lg)", right: "var(--space-lg)", left: "auto", top: "auto" },
    "center": { top: "50%", left: "50%", transform: "translate(-50%, -50%)", right: "auto", bottom: "auto" },
  };

  const posStyle = positionStyles[position] || positionStyles["top-right"];

  return (
    <div
      style={{ ...posStyle, pointerEvents: "none", zIndex: 10, position: "absolute" }}
      aria-hidden="true"
      role="img"
      aria-label={label || "Stiker dekoratif"}
    >
      <img
        src={imageUrl}
        alt=""
        style={{ filter: "drop-shadow(4px 4px 0 var(--ink))", transition: "transform 0.3s ease", imageRendering: "pixelated", width: 150, height: 150 } }
        width={150}
        height={150}
        loading="lazy"
      />
    </div>
  );
}

type Props = {
  hero: { title: string; subtitle: string; ctaText: string; ctaLink: string; backgroundToken: string; imageUrl: string };
  marquee: { text: string; direction: "left" | "right"; speed: number; color: string };
  aboutpill: { label: string; paragraph: string; linkText: string; linkUrl: string };
  projectgrid: { quantity: "4" | "6" | "all"; showFilter: boolean; showTab: boolean };
  productgrid: { quantity: "4" | "6" | "all"; showFeaturedOnly: boolean };
  cta: { title: string; subtitle: string; buttonText: string; buttonLink: string; backgroundToken: string };
  casestudy: { title: string; client: string; project: string; outcome: string; imageUrl: string };
  gallery: { images: string[]; columns: "2" | "3" | "4" };
  testimonial: { name: string; role: string; text: string; company: string; rating: number };
  timeline: { events: Array<{ title: string; date: string; description: string }> };
  contactform: { name: string; email: string; message: string };
  sticklayer: { imageUrl: string; label: string; position: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center" };
  richtext: { content: string };
  spacer: { size: "S" | "M" | "L" };
  shopcta: { title: string; subtitle: string; buttonText: string; buttonLink: string; backgroundToken: string };
};

export const config: Config<Props> = {
  components: {
    hero: {
      fields: {
        title: { type: "text", label: "Judul" },
        subtitle: { type: "text", label: "Subjudul" },
        ctaText: { type: "text", label: "Teks CTA" },
        ctaLink: { type: "text", label: "Link CTA" },
        backgroundToken: { type: "select", label: "Background", options: validBackgroundTokens.map(t => ({ value: t, label: t })) },
        imageUrl: { type: "text", label: "URL Gambar" },
      },
      defaultProps: { title: "", subtitle: "", ctaText: "", ctaLink: "", backgroundToken: "brume", imageUrl: "" },
      render: HeroBlock,
    },
    marquee: {
      fields: {
        text: { type: "richtext", label: "Teks Marquee (pisahkan dengan baris baru)" },
        direction: { type: "select", label: "Arah", options: [{ value: "left", label: "Kiri" }, { value: "right", label: "Kanan" }] },
        speed: { type: "number", label: "Kecepatan (1-50)" },
        color: { type: "select", label: "Warna", options: validColorTokens.map(t => ({ value: t, label: t })) },
      },
      defaultProps: { text: "Masukan teks marquee", direction: "left", speed: 20, color: "menthe" },
      render: MarqueeBlock,
    },
    aboutpill: {
      fields: {
        label: { type: "text", label: "Label Pill" },
        paragraph: { type: "richtext", label: "Paragraf" },
        linkText: { type: "text", label: "Teks Link" },
        linkUrl: { type: "text", label: "URL Link" },
      },
      defaultProps: { label: "Masukkan label", paragraph: "", linkText: "", linkUrl: "" },
      render: AboutPillBlock,
    },
    projectgrid: {
      fields: {
        quantity: { type: "select", label: "Jumlah", options: [{ value: "4", label: "4" }, { value: "6", label: "6" }, { value: "all", label: "Semua" }] },
        showFilter: { type: "checkbox", label: "Tampilkan Filter", options: [{ value: true, label: "Ya" }, { value: false, label: "Tidak" }] },
        showTab: { type: "checkbox", label: "Tampilkan Tab", options: [{ value: true, label: "Ya" }, { value: false, label: "Tidak" }] },
      },
      defaultProps: { quantity: "4", showFilter: true, showTab: false },
      render: ProjectGridBlock,
    },
    productgrid: {
      fields: {
        quantity: { type: "select", label: "Jumlah", options: [{ value: "4", label: "4" }, { value: "6", label: "6" }, { value: "all", label: "Semua" }] },
        showFeaturedOnly: { type: "checkbox", label: "Hanya Featured", options: [{ value: true, label: "Ya" }, { value: false, label: "Tidak" }] },
      },
      defaultProps: { quantity: "4", showFeaturedOnly: false },
      render: ProductGridBlock as unknown as PuckComponent<Props["productgrid"]>,
    },
    cta: {
      fields: {
        title: { type: "text", label: "Judul" },
        subtitle: { type: "text", label: "Subjudul" },
        buttonText: { type: "text", label: "Teks Tombol" },
        buttonLink: { type: "text", label: "Link Tombol" },
        backgroundToken: { type: "select", label: "Background", options: validBackgroundTokens.map(t => ({ value: t, label: t })) },
      },
      defaultProps: { title: "", subtitle: "", buttonText: "Baca lebih lanjut", buttonLink: "", backgroundToken: "brume" },
      render: CTABlock,
    },
    casestudy: {
      fields: {
        title: { type: "text", label: "Judul Case Study" },
        client: { type: "text", label: "Klien" },
        project: { type: "text", label: "Nama Proyek" },
        outcome: { type: "richtext", label: "Hasil/Outcome" },
        imageUrl: { type: "text", label: "URL Gambar" },
      },
      defaultProps: { title: "Case Study", client: "", project: "", outcome: "", imageUrl: "" },
      render: CaseStudyBlock,
    },
    gallery: {
      fields: {
        images: { type: "array", label: "Gambar", arrayFields: { type: "text", label: "URL Gambar" } },
        columns: { type: "select", label: "Kolom", options: [{ value: "2", label: "2" }, { value: "3", label: "3" }, { value: "4", label: "4" }] },
      },
      defaultProps: { images: [], columns: "3" },
      render: GalleryBlock,
    },
    testimonial: {
      fields: {
        name: { type: "text", label: "Nama" },
        role: { type: "text", label: "Peran/Jabatan" },
        text: { type: "richtext", label: "Kutipan" },
        company: { type: "text", label: "Perusahaan" },
        rating: { type: "number", label: "Rating (1-5)", min: 1, max: 5, step: 1 },
      },
      defaultProps: { name: "", role: "", text: "", company: "", rating: 5 },
      render: TestimonialBlock,
    },
    timeline: {
      fields: {
        events: {
          type: "array",
          label: "Event",
          arrayFields: {
            title: { type: "text", label: "Judul Event" },
            date: { type: "text", label: "Tanggal" },
            description: { type: "richtext", label: "Deskripsi" },
          },
        },
      },
      defaultProps: { events: [{ title: "Event 1", date: "", description: "" }, { title: "Event 2", date: "", description: "" }] },
      render: TimelineBlock,
    },
    contactform: {
      fields: {
        name: { type: "text", label: "Nama" },
        email: { type: "text", label: "Email" },
        message: { type: "richtext", label: "Pesan" },
      },
      defaultProps: { name: "", email: "", message: "" },
      render: ContactFormBlock as unknown as PuckComponent<Props["contactform"]>,
    },
    sticklayer: {
      fields: {
        imageUrl: { type: "text", label: "URL Gambar Stiker" },
        label: { type: "text", label: "Label (aria-label)" },
        position: { type: "select", label: "Posisi", options: validPositions.map(p => ({ value: p, label: p })) },
      },
      defaultProps: { imageUrl: "", label: "", position: "top-right" },
      render: StickerLayerBlock,
    },
    richtext: {
      fields: { content: { type: "richtext", label: "Konten HTML" } },
      defaultProps: { content: "" },
      render: RichTextBlock,
    },
    spacer: {
      fields: {
        size: { type: "select", label: "Ukuran", options: [{ value: "S", label: "Kecil (S)" }, { value: "M", label: "Sedang (M)" }, { value: "L", label: "Besar (L)" }] },
      },
      defaultProps: { size: "M" },
      render: SpacerBlock,
    },
    shopcta: {
      fields: {
        title: { type: "text", label: "Judul" },
        subtitle: { type: "text", label: "Subjudul" },
        buttonText: { type: "text", label: "Teks Tombol" },
        buttonLink: { type: "text", label: "Link Tombol" },
        backgroundToken: { type: "select", label: "Background", options: validBackgroundTokens.map(t => ({ value: t, label: t })) },
      },
      defaultProps: { title: "Cek Produk Kami", subtitle: "Temukan produk kreatif yang cocok untuk Anda.", buttonText: "Lihat Toko", buttonLink: "/shop", backgroundToken: "verveine" },
      render: ShopCTABlock as unknown as PuckComponent<Props["shopcta"]>,
    },
  },
};

export default config;