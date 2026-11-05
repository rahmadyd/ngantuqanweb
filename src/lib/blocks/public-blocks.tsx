type BlockStyle = {
  backgroundToken?: "brume" | "menthe" | "limonade" | "verveine" | "paper";
  sticker?: "none" | "circle" | "square" | "triangle";
  stickerPosition?:
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "center";
  animation?: "none" | "float";
};

const BG_COLORS: Record<string, string> = {
  brume: "var(--brume)",
  menthe: "var(--menthe)",
  limonade: "var(--limonade)",
  verveine: "var(--verveine)",
  paper: "var(--paper)",
};

const validBg = (v?: string) =>
  v && v in BG_COLORS ? (v as keyof typeof BG_COLORS) : "paper";

function BlockWrapper({
  style,
  children,
}: {
  style?: BlockStyle;
  children: React.ReactNode;
}) {
  const bg = validBg(style?.backgroundToken);
  const hasSticker = style?.sticker && style?.sticker !== "none";
  return (
    <section
      style={{
        padding: "var(--space-2xl) 0",
        border: "2.5px solid var(--ink)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "4px 4px 0 var(--ink)",
        backgroundColor: BG_COLORS[bg],
        ...(style?.animation === "float" &&
          !window?.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches
            ? {
                animation: "floatBlock 6s ease-in-out infinite",
              }
            : {}),
      }}
      className={hasSticker ? "sticker-wrapper" : undefined}
    >
      {hasSticker && style?.stickerPosition && (
        <div
          className="sticker"
          style={{
            position: "absolute",
            ...STICKER_POS[style.stickerPosition],
            pointerEvents: "none",
            zIndex: 10,
          }}
          aria-hidden="true"
        >
          <span
            style={{
              fontSize: "0.75rem",
              color: "var(--ink)",
              opacity: 0.5,
            }}
          >
            {STICKER_LABEL[style.sticker]}
          </span>
        </div>
      )}
      {children}
    </section>
  );
}

const STICKER_POS: Record<string, React.CSSProperties> = {
  "top-left": { top: "var(--space-lg)", left: "var(--space-lg)" },
  "top-right": { top: "var(--space-lg)", right: "var(--space-lg)" },
  "bottom-left": { bottom: "var(--space-lg)", left: "var(--space-lg)" },
  "bottom-right": { bottom: "var(--space-lg)", right: "var(--space-lg)" },
  center: { top: "50%", left: "50%", transform: "translate(-50%, -50%)" },
};

const STICKER_LABEL: Record<string, string> = {
  circle: "●",
  square: "■",
  triangle: "▲",
};

export function HeroBlock({ props, style }: { props: any; style?: BlockStyle }) {
  return (
    <BlockWrapper style={style}>
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 var(--space-lg)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "var(--space-lg)",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        {props.imageUrl && (
          <div
            style={{
              width: "100%",
              maxWidth: "600px",
              borderRadius: "var(--radius-md)",
              overflow: "hidden",
              border: "2px solid var(--ink)",
            }}
          >
            <img
              src={props.imageUrl}
              alt={props.title || "Hero image"}
              style={{ width: "100%", height: "auto", display: "block" }}
              width={600}
              height={400}
            />
          </div>
        )}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-md)",
          }}
        >
          {props.title && (
            <h1
              style={{
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                fontWeight: 800,
                color: "var(--ink)",
                margin: 0,
                lineHeight: 1.1,
              }}
            >
              {props.title}
            </h1>
          )}
          {props.subtitle && (
            <p
              style={{
                fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
                color: "var(--ink)",
                opacity: 0.8,
                margin: 0,
                maxWidth: "60ch",
              }}
            >
              {props.subtitle}
            </p>
          )}
          {props.ctaText && props.ctaLink && (
            <a
              href={props.ctaLink}
              style={{
                display: "inline-block",
                padding: "var(--space-sm) var(--space-xl)",
                background: "var(--ink)",
                color: "var(--paper)",
                fontWeight: 700,
                textDecoration: "none",
                border: "2.5px solid var(--ink)",
                borderRadius: "var(--radius-md)",
                boxShadow: "4px 4px 0 var(--ink)",
              }}
            >
              {props.ctaText}
            </a>
          )}
        </div>
      </div>
    </BlockWrapper>
  );
}

export function MarqueeBlock({ props, style }: { props: any; style?: BlockStyle }) {
  const texts = (props.text || "")
    .split(/\n+/)
    .filter((t: string) => t.trim())
    .map((t: string) => t.replace(/<[^>]*>/g, "").trim())
    .filter(Boolean);
  const duration = Math.max(5, 50 - (props.speed || 20));
  const dir = props.direction === "left" ? "normal" : "reverse";

  return (
    <BlockWrapper style={style}>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes marquee {
              from { transform: translateX(100%); }
              to { transform: translateX(-100%); }
            }
            @media (prefers-reduced-motion: reduce) {
              .marquee-track { animation: none; }
            }
          `,
        }}
      />
      <div
        style={{
          overflow: "hidden",
          border: "2.5px solid var(--ink)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "4px 4px 0 var(--ink)",
          backgroundColor: "var(--ink)",
          color: "var(--paper)",
          padding: "var(--space-md) 0",
        }}
      >
        <div
          className="marquee-track"
          style={{
            display: "flex",
            animation: `marquee ${duration}s linear infinite`,
            animationDirection: dir,
            whiteSpace: "nowrap",
          }}
        >
          {texts.flatMap((text: string, i: number) => [
            <span
              key={i}
              style={{
                display: "inline-block",
                padding: "0 var(--space-xl)",
                fontSize: "clamp(1.25rem, 3vw, 2rem)",
                fontWeight: 700,
              }}
            >
              {text}
            </span>,
            <span
              key={`sep-${i}`}
              style={{
                display: "inline-block",
                padding: "0 var(--space-xl)",
                fontSize: "clamp(1.25rem, 3vw, 2rem)",
                fontWeight: 700,
              }}
            >
              •
            </span>,
          ])}
        </div>
      </div>
    </BlockWrapper>
  );
}

export function AboutBlock({ props, style }: { props: any; style?: BlockStyle }) {
  return (
    <BlockWrapper style={style}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "var(--space-md)",
          padding: "var(--space-lg)",
        }}
      >
        {props.label && (
          <span
            style={{
              padding: "var(--space-xs) var(--space-lg)",
              background: "var(--ink)",
              color: "var(--paper)",
              fontWeight: 700,
              fontSize: "clamp(0.875rem, 2vw, 1rem)",
              borderRadius: "var(--radius-full)",
              whiteSpace: "nowrap",
            }}
          >
            {props.label}
          </span>
        )}
        {props.paragraph && (
          <p
            style={{
              flex: 1,
              minWidth: "200px",
              color: "var(--ink)",
              margin: 0,
              fontSize: "clamp(1rem, 2vw, 1.125rem)",
              lineHeight: 1.6,
            }}
          >
            {props.paragraph}
          </p>
        )}
        {props.linkText && props.linkUrl && (
          <a
            href={props.linkUrl}
            style={{ color: "var(--ink)", textDecoration: "underline", fontWeight: 700 }}
          >
            {props.linkText}
          </a>
        )}
      </div>
    </BlockWrapper>
  );
}

export function ProjectBlock({ props, style }: { props: any; style?: BlockStyle }) {
  return (
    <BlockWrapper style={style}>
      <section style={{ padding: "var(--space-lg) 0" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "var(--space-lg)",
            flexWrap: "wrap",
            gap: "var(--space-md)",
          }}
        >
          <h2
            style={{
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              fontWeight: 800,
              color: "var(--ink)",
              margin: 0,
            }}
          >
            Proyek
          </h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "var(--space-lg)",
          }}
        >
          <p
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              color: "var(--ink)",
              opacity: 0.6,
            }}
          >
            Proyek akan muncul di sini setelah dipublikasikan.
          </p>
        </div>
      </section>
    </BlockWrapper>
  );
}

export function ProductBlock({ props, style, shopEnabled }: { props: any; style?: BlockStyle; shopEnabled: boolean }) {
  if (!shopEnabled) return null;

  return (
    <BlockWrapper style={style}>
      <section style={{ padding: "var(--space-lg) 0" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "var(--space-lg)",
            flexWrap: "wrap",
            gap: "var(--space-md)",
          }}
        >
          <h2
            style={{
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              fontWeight: 800,
              color: "var(--ink)",
              margin: 0,
            }}
          >
            Produk
          </h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "var(--space-lg)",
          }}
        >
          <p
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              color: "var(--ink)",
              opacity: 0.6,
              padding: "var(--space-xl)",
            }}
          >
            Belum ada produk.
          </p>
        </div>
      </section>
    </BlockWrapper>
  );
}

export function ContactBlock({ props, style }: { props: any; style?: BlockStyle }) {
  return (
    <BlockWrapper style={style}>
      <section
        style={{
          padding: "var(--space-xl)",
          border: "2.5px solid var(--ink)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "4px 4px 0 var(--ink)",
          background: "var(--paper)",
          maxWidth: "600px",
        }}
      >
        <p
          style={{
            color: "var(--ink)",
            textAlign: "center",
            marginBottom: "var(--space-lg)",
          }}
        >
          Form kontak akan berfungsi di versi publik (menggunakan /api/contact).
        </p>
      </section>
    </BlockWrapper>
  );
}

export function RichTextBlock({ props, style }: { props: any; style?: BlockStyle }) {
  if (!props.content) {
    return (
      <BlockWrapper style={style}>
        <div
          style={{
            color: "var(--ink)",
            lineHeight: 1.8,
            fontSize: "1.0625rem",
            minHeight: "var(--space-xl)",
            opacity: 0.5,
            padding: "var(--space-lg)",
          }}
        >
          <em>Konten rich text (klik untuk edit)</em>
        </div>
      </BlockWrapper>
    );
  }

  // Split into paragraphs by double newlines, render as plain text paragraphs
  const paragraphs = props.content.split(/\n\n+/).filter((p: string) => p.trim());

  return (
    <BlockWrapper style={style}>
      <div
        style={{
          color: "var(--ink)",
          lineHeight: 1.8,
          fontSize: "1.0625rem",
          padding: "var(--space-lg)",
        }}
      >
        {paragraphs.map((p: string, i: number) => (
          <p
            key={i}
            style={{ color: "var(--ink)", margin: "0 0 var(--space-md)", lineHeight: 1.6 }}
          >
            {p}
          </p>
        ))}
      </div>
    </BlockWrapper>
  );
}

export const PUBLIC_BLOCKS: Record<string, React.ComponentType<any>> = {
  hero: HeroBlock,
  marquee: MarqueeBlock,
  about: AboutBlock,
  project: ProjectBlock,
  product: ProductBlock,
  contact: ContactBlock,
  richtext: RichTextBlock,
};
