import { PUBLIC_BLOCKS } from "@/lib/blocks/public-blocks";

interface PageRendererProps {
  data: any;
  shopEnabled?: boolean;
}

export function PageRenderer({ data, shopEnabled = true }: PageRendererProps) {
  const content = data?.root?.content || [];
  const title = data?.root?.props?.title;

  return (
    <div>
      {title && (
        <h1
          style={{
            display: "none",
          }}
        >
          {title}
        </h1>
      )}
      {content.map((block: any, idx: number) => {
        const Block = PUBLIC_BLOCKS[block.type];
        if (!Block) return null;
        return (
          <Block
            key={block.id || idx}
            props={block.props}
            style={block.style}
            shopEnabled={shopEnabled}
          />
        );
      })}
    </div>
  );
}
