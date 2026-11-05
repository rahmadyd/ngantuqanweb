"use client";

import dynamic from "next/dynamic";
import { ImageUploader } from "@/components/ImageUploader";

const MediaUploader = dynamic(
  () => Promise.resolve({ default: ImageUploader }),
  {
    ssr: false,
    loading: () => <div style={{ padding: "var(--space-md)", color: "var(--ink)" }}>Memuat uploader...</div>,
  }
);

interface MediaUploaderProps {
  onUpload: (result: any) => void;
}

export function MediaUploaderWrapper({ onUpload }: MediaUploaderProps) {
  return <MediaUploader onUpload={onUpload} />;
}