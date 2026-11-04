"use client";

import { useState, useCallback, useRef } from "react";

interface CompressOptions {
  maxWidth: number;
  maxHeight: number;
  quality: number;
  maxSizeMB: number;
  allowedTypes: string[];
}

interface CompressResult {
  file: File;
  dataUrl: string;
  width: number;
  height: number;
  originalSize: number;
  compressedSize: number;
}

interface UseImageCompressorReturn {
  compress: (file: File) => Promise<CompressResult>;
  compressing: boolean;
  error: string | null;
  previewUrl: string | null;
  reset: () => void;
  openFileDialog: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

const DEFAULT_OPTIONS: CompressOptions = {
  maxWidth: 1600,
  maxHeight: 1600,
  quality: 0.85,
  maxSizeMB: 5,
  allowedTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
};

function validateFile(file: File, options: CompressOptions): string | null {
  if (!options.allowedTypes.includes(file.type)) {
    return `Tipe file tidak didukung: ${file.type}. Hanya JPEG, PNG, WebP, GIF.`;
  }
  const maxBytes = options.maxSizeMB * 1024 * 1024;
  if (file.size > maxBytes) {
    return `File terlalu besar: ${(file.size / 1024 / 1024).toFixed(2)} MB. Maksimal ${options.maxSizeMB} MB.`;
  }
  return null;
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function compressImage(
  dataUrl: string,
  maxWidth: number,
  maxHeight: number,
  quality: number
): Promise<{ dataUrl: string; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas context not available"));

      let { width, height } = img;
      const ratio = Math.min(maxWidth / width, maxHeight / height, 1);
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      const compressedDataUrl = canvas.toDataURL("image/webp", quality);
      resolve({ dataUrl: compressedDataUrl, width, height });
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = dataUrl;
  });
}

function dataUrlToFile(dataUrl: string, originalName: string): File {
  const arr = dataUrl.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "image/webp";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  const ext = mime.split("/")[1] || "webp";
  return new File([u8arr], originalName.replace(/\.[^.]+$/, "") + `.webp`, { type: mime });
}

export function useImageCompressor(options: Partial<CompressOptions> = {}): UseImageCompressorReturn {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const [compressing, setCompressing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const compress = useCallback(async (file: File): Promise<CompressResult> => {
    setError(null);
    setCompressing(true);

    try {
      const validationError = validateFile(file, opts);
      if (validationError) throw new Error(validationError);

      const originalSize = file.size;
      const dataUrl = await fileToDataUrl(file);
      const { dataUrl: compressedDataUrl, width, height } = await compressImage(
        dataUrl,
        opts.maxWidth,
        opts.maxHeight,
        opts.quality
      );
      const compressedFile = dataUrlToFile(compressedDataUrl, file.name);
      const compressedSize = compressedFile.size;

      if (compressedSize > opts.maxSizeMB * 1024 * 1024) {
        throw new Error(`Hasil kompresi masih > ${opts.maxSizeMB} MB. Coba gambar resolusi lebih rendah.`);
      }

      setPreviewUrl(compressedDataUrl);
      return {
        file: compressedFile,
        dataUrl: compressedDataUrl,
        width,
        height,
        originalSize,
        compressedSize,
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Kompresi gagal";
      setError(msg);
      throw err;
    } finally {
      setCompressing(false);
    }
  }, [opts]);

  const reset = useCallback(() => {
    setError(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await compress(file);
      } catch {}
    }
  }, [compress]);

  return {
    compress,
    compressing,
    error,
    previewUrl,
    reset,
    openFileDialog,
    handleFileChange,
    fileInputRef,
  };
}

export function ImageUploader({
  onUpload,
  options,
  children,
  className = "",
}: {
  onUpload: (result: CompressResult) => void;
  options?: Partial<CompressOptions>;
  children?: React.ReactNode;
  className?: string;
}) {
  const { compress, compressing, error, previewUrl, reset, openFileDialog, handleFileChange, fileInputRef } = useImageCompressor(options);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        style={{ display: "none" }}
        disabled={compressing}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
        <button
          type="button"
          onClick={openFileDialog}
          disabled={compressing}
          style={{
            padding: "var(--space-md) var(--space-xl)",
            background: "var(--ink)",
            color: "var(--paper)",
            border: "2.5px solid var(--ink)",
            borderRadius: "var(--radius-md)",
            fontWeight: 700,
            cursor: compressing ? "not-allowed" : "pointer",
            boxShadow: compressing ? "2px 2px 0 var(--ink)" : "4px 4px 0 var(--ink)",
            opacity: compressing ? 0.7 : 1,
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--space-sm)",
          }}
        >
          {compressing ? (
            <>
              <span style={{ animation: "spin 1s linear infinite" }}>⟳</span>
              Memproses...
            </>
          ) : (
            "Pilih Gambar"
          )}
        </button>
        <input
          ref={(el) => {
            if (el) el.style.display = "none";
          }}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          disabled={compressing}
        />
        {error && (
          <p style={{ color: "var(--pop)", fontWeight: 600, fontSize: "0.875rem" }}>
            {error}
          </p>
        )}
        {previewUrl && (
          <div style={{ position: "relative", display: "inline-block" }}>
            <img
              src={previewUrl}
              alt="Preview"
              style={{
                maxWidth: "300px",
                maxHeight: "300px",
                border: "2.5px solid var(--ink)",
                borderRadius: "var(--radius-md)",
                boxShadow: "4px 4px 0 var(--ink)",
              }}
            />
            <button
              type="button"
              onClick={reset}
              style={{
                position: "absolute",
                top: "-8px",
                right: "-8px",
                padding: "var(--space-xs) var(--space-sm)",
                background: "var(--pop)",
                color: "var(--paper)",
                border: "2.5px solid var(--ink)",
                borderRadius: "50%",
                fontSize: "1rem",
                cursor: "pointer",
                boxShadow: "2px 2px 0 var(--ink)",
              }}
            >
              ✕
            </button>
          </div>
        )}
        {children}
      </div>
    </form>
  );
}

export { type CompressResult, type CompressOptions };