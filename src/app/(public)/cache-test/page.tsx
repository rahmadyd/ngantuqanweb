import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { Pill, Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "Cache Test",
  robots: { index: false, follow: false },
};

export const dynamic = "force-static";

const getCacheStamp = unstable_cache(
  async () => ({
    generatedAt: new Date().toISOString(),
    nonce: crypto.randomUUID(),
  }),
  ["revalidate-test-entry"],
  { tags: ["revalidate-test"] },
);

export default async function CacheTestPage() {
  const { generatedAt, nonce } = await getCacheStamp();

  return (
    <main>
      <Section background="limonade" space="md">
        <Pill color="pop" size="sm">
          Halaman uji cache
        </Pill>
        <h1 style={{ marginBlockStart: "var(--space-sm)" }}>revalidateTag</h1>
        <p style={{ maxWidth: "60ch", marginBlockStart: "var(--space-sm)" }}>
          Nilai di bawah diambil dari cache inkremental OpenNext. Jika tag{" "}
          <code>revalidate-test</code> diinvalidasi, nilai akan berubah pada permintaan
          berikutnya.
        </p>
        <dl
          style={{
            display: "grid",
            gap: "var(--space-sm)",
            marginBlockStart: "var(--space-lg)",
          }}
        >
          <div>
            <dt style={{ fontWeight: 700 }}>generatedAt</dt>
            <dd style={{ margin: 0 }}>
              <time dateTime={generatedAt}>{generatedAt}</time>
            </dd>
          </div>
          <div>
            <dt style={{ fontWeight: 700 }}>nonce</dt>
            <dd style={{ margin: 0 }}>
              <code>{nonce}</code>
            </dd>
          </div>
        </dl>
      </Section>
    </main>
  );
}
