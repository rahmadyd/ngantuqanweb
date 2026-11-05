export type BlockStyle = {
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

export type HeroProps = {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
};

export type MarqueeProps = {
  text: string;
  direction: "left" | "right";
  speed: number;
  color: "brume" | "menthe" | "limonade" | "verveine" | "paper";
};

export type AboutProps = {
  label: string;
  paragraph: string;
  linkText: string;
  linkUrl: string;
};

export type ProjectProps = {
  quantity: "4" | "6" | "all";
  showFilter: boolean;
  showTab: boolean;
};

export type ProductProps = {
  quantity: "4" | "6" | "all";
  showFeaturedOnly: boolean;
};

export type ContactProps = {
  name: string;
  email: string;
  message: string;
};

export type RichTextProps = {
  content: string;
};

export type BlockProps =
  | { type: "hero"; props: HeroProps }
  | { type: "marquee"; props: MarqueeProps }
  | { type: "about"; props: AboutProps }
  | { type: "project"; props: ProjectProps }
  | { type: "product"; props: ProductProps }
  | { type: "contact"; props: ContactProps }
  | { type: "richtext"; props: RichTextProps };

export type Block = {
  id: string;
  type: BlockProps["type"];
  props: BlockProps["props"];
  style: BlockStyle;
};

export type PageContent = {
  root: {
    props: { title: string };
    content: Block[];
  };
};

export type BlockType = BlockProps["type"];
