import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
import doShardedTagCache from "@opennextjs/cloudflare/overrides/tag-cache/do-sharded-tag-cache";

export default defineCloudflareConfig({
  // Cache inkremental (dipakai revalidatePath / revalidateTag) disimpan di R2.
  // Binding NEXT_INC_CACHE_R2_BUCKET dideklarasikan di wrangler.jsonc.
  incrementalCache: r2IncrementalCache,
  // Tag cache untuk on-demand revalidation (`revalidateTag`).
  // Membutuhkan binding Durable Object NEXT_TAG_CACHE_DO_SHARDED.
  tagCache: doShardedTagCache({ baseShardSize: 4 }),
});
