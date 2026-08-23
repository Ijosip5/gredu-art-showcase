import { useState, useRef } from "react";
import { Upload, X, Link2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Harap pilih file gambar (JPG, PNG, WebP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran gambar maksimal 5MB.");
      return;
    }
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `works/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("karya").upload(path, file, { upsert: false });

    if (error) {
      alert("Upload gagal: " + error.message);
      setUploading(false);
      return;
    }

    // Bucket is private, so store a long-lived signed URL (10 years).
    const { data, error: signError } = await supabase.storage
      .from("karya")
      .createSignedUrl(path, 60 * 60 * 24 * 365 * 10);

    if (signError || !data) {
      alert("Gagal membuat tautan gambar: " + (signError?.message ?? "unknown"));
      setUploading(false);
      return;
    }

    onChange(data.signedUrl);
    setUploading(false);
  };


  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setUrlInput("");
    }
  };

  return (
    <div className="space-y-3">
      {/* Mode toggle */}
      <div className="flex rounded-xl border border-border bg-secondary p-1 w-fit">
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`rounded-lg px-4 py-1.5 text-xs font-medium transition-smooth ${
            mode === "upload" ? "bg-card shadow-soft text-foreground" : "text-muted-foreground"
          }`}
        >
          Upload File
        </button>
        <button
          type="button"
          onClick={() => setMode("url")}
          className={`rounded-lg px-4 py-1.5 text-xs font-medium transition-smooth ${
            mode === "url" ? "bg-card shadow-soft text-foreground" : "text-muted-foreground"
          }`}
        >
          URL Gambar
        </button>
      </div>

      {mode === "upload" ? (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => !disabled && inputRef.current?.click()}
          className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-smooth ${
            dragOver
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary hover:bg-secondary/50"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            disabled={disabled}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) uploadFile(file);
            }}
          />
          {uploading ? (
            <div className="space-y-2">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="text-sm text-muted-foreground">Mengunggah...</p>
            </div>
          ) : (
            <>
              <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm font-medium">Klik atau seret gambar ke sini</p>
              <p className="text-xs text-muted-foreground">JPG, PNG, WebP · Maks. 5MB</p>
            </>
          )}
        </div>
      ) : (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Link2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full rounded-xl border border-input bg-background py-3 pl-10 pr-4 text-sm outline-none transition-smooth focus:border-primary focus:ring-4 focus:ring-ring/15"
            />
          </div>
          <button
            type="button"
            onClick={handleUrlSubmit}
            className="rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-smooth hover:opacity-90"
          >
            Gunakan
          </button>
        </div>
      )}

      {/* Preview */}
      {value && (
        <div className="relative mt-3 inline-block">
          <img
            src={value}
            alt="Preview thumbnail"
            className="h-32 w-48 rounded-xl border border-border object-cover shadow-soft"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground shadow-soft transition-smooth hover:opacity-80"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
}
