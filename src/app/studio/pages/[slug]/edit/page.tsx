import { ComingSoon } from "../../../coming-soon";

export default async function StudioPageEdit({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ComingSoon title={`Edit: ${slug}`} phase="Fase 4 (editor Puck)" />;
}
