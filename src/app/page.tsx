import { createSupabaseServer } from "@/lib/supabase/server";

export async function GET(_request: Request) {
  const supabase = createSupabaseServer();
  const { data, error } = await supabase.from("pages").select("*").eq("slug", "home");
  
  if (error) return new Response(error.message, { status: 500 });
  
  const page = data?.[0];
  if (!page) return new Response("Halaman tidak ditemukan", { status: 404 });
  
  // Render published data
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${page.title || "Home"}</title>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="stylesheet" href="/globals.css" />
    </head>
    <body>
      <h1>${page.title || "Home"}</h1>
      <p>Status: ${page.status}</p>
      <p>Published data: ${JSON.stringify(page.published_data)}</p>
    </body>
    </html>
  `;
  
  return new Response(html, {
    headers: { "Content-Type": "text/html" },
  });
}