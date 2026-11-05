"use client";

import { Render } from "@puckeditor/core";
import { clientConfig } from "@/puck.config.client";

interface PuckRenderClientProps {
  data: unknown;
}

export default function PuckRenderClient({ data }: PuckRenderClientProps) {
  return <Render config={clientConfig as unknown as Parameters<typeof Render>[0]["config"]} data={data as unknown as Parameters<typeof Render>[0]["data"]} />;
}
