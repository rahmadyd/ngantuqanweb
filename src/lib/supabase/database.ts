export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type PageStatus = "draft" | "published";
export type ItemKind = "project" | "shop";
export type ItemRow = Database["public"]["Tables"]["items"]["Row"];

export type Database = {
  public: {
    Tables: {
      pages: {
        Row: {
          id: string;
          slug: string;
          title: string;
          seo_description: string | null;
          og_image: string | null;
          data: Json;
          published_data: Json | null;
          status: PageStatus;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          seo_description?: string | null;
          og_image?: string | null;
          data?: Json;
          published_data?: Json | null;
          status?: PageStatus;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["pages"]["Insert"]>;
        Relationships: [];
      };
      page_versions: {
        Row: {
          id: string;
          page_id: string;
          data: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          page_id: string;
          data: Json;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["page_versions"]["Insert"]>;
        Relationships: [];
      };
      items: {
        Row: {
          id: string;
          slug: string;
          kind: ItemKind;
          title: string;
          summary: string | null;
          body_md: string | null;
          cover_image: string | null;
          images: string[];
          tags: string[];
          role: string | null;
          client: string | null;
          year: number | null;
          price_idr: number | null;
          order_url: string | null;
          order_label: string | null;
          live_url: string | null;
          repo_url: string | null;
          is_featured: boolean;
          is_sold_out: boolean;
          is_published: boolean;
          sort_order: number;
          alt_text: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          kind: ItemKind;
          title: string;
          summary?: string | null;
          body_md?: string | null;
          cover_image?: string | null;
          images?: string[];
          tags?: string[];
          role?: string | null;
          client?: string | null;
          year?: number | null;
          price_idr?: number | null;
          order_url?: string | null;
          order_label?: string | null;
          live_url?: string | null;
          repo_url?: string | null;
          is_featured?: boolean;
          is_sold_out?: boolean;
          is_published?: boolean;
          sort_order?: number;
          alt_text?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["items"]["Insert"]>;
        Relationships: [];
      };
      site_settings: {
        Row: {
          key: string;
          value: Json;
          updated_at: string;
        };
        Insert: {
          key: string;
          value: Json;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["site_settings"]["Insert"]>;
        Relationships: [];
      };
      messages: {
        Row: {
          id: string;
          name: string | null;
          email: string | null;
          body: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name?: string | null;
          email?: string | null;
          body: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["messages"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
