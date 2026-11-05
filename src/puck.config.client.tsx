const validBackgroundTokens = ["brume", "menthe", "limonade", "verveine", "paper"] as const;

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
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          from { transform: translateX(100%); }
          to { transform: translateX(-100%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation: none; }
        }
      `}} />
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

type ClientProps = {
  hero: { title: string; subtitle: string; ctaText: string; ctaLink: string; backgroundToken: string; imageUrl: string };
  marquee: { text: string; direction: "left" | "right"; speed: number; color: string };
  aboutpill: { label: string; paragraph: string; linkText: string; linkUrl: string };
  projectgrid: { quantity: "4" | "6" | "all"; showFilter: boolean; showTab: boolean };
  cta: { title: string; subtitle: string; buttonText: string; buttonLink: string; backgroundToken: string };
  casestudy: { title: string; client: string; project: string; outcome: string; imageUrl: string };
  gallery: { images: string[]; columns: "2" | "3" | "4" };
  testimonial: { name: string; role: string; text: string; company: string; rating: number };
  timeline: { events: Array<{ title: string; date: string; description: string }> };
  richtext: { content: string };
  spacer: { size: "S" | "M" | "L" };
  sticklayer: { imageUrl: string; label: string; position: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center" };
};

export const clientConfig = {
  components: {
    hero: { render: HeroBlock },
    marquee: { render: MarqueeBlock },
    aboutpill: { render: AboutPillBlock },
    projectgrid: { render: ProjectGridBlock },
    cta: { render: CTABlock },
    casestudy: { render: CaseStudyBlock },
    gallery: { render: GalleryBlock },
    testimonial: { render: TestimonialBlock },
    timeline: { render: TimelineBlock },
    richtext: { render: RichTextBlock },
    spacer: { render: SpacerBlock },
    sticklayer: { render: StickerLayerBlock },
  },
} as const;

// Placeholder blocks for editor (server-only blocks that can't fetch data on client)
function ProductGridPlaceholder() {
  return <div style={{ padding: "var(--space-xl)", textAlign: "center", color: "var(--ink)", opacity: 0.6 }}>Produk akan dimuat saat halaman diakses.</div>;
}

function ContactFormPlaceholder() {
  return <div style={{ padding: "var(--space-xl)", textAlign: "center", color: "var(--ink)", opacity: 0.6 }}>Form kontak akan dimuat saat halaman diakses.</div>;
}

function ShopCTAPlaceholder() {
  return <div style={{ padding: "var(--space-xl)", textAlign: "center", color: "var(--ink)", opacity: 0.6 }}>CTA toko akan dimuat saat halaman diakses.</div>;
}

type AllClientProps = ClientProps & {
  productgrid: { quantity: "4" | "6" | "all"; showFeaturedOnly: boolean };
  contactform: { name: string; email: string; message: string };
  shopcta: { title: string; subtitle: string; buttonText: string; buttonLink: string; backgroundToken: string };
};

export default {
  components: {
    ...clientConfig.components,
    productgrid: { render: ProductGridPlaceholder },
    contactform: { render: ContactFormPlaceholder },
    shopcta: { render: ShopCTAPlaceholder },
  },
} as unknown as import("@puckeditor/core").Config<AllClientProps>;
