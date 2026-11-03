"use client";

import { useCallback, useId, useState } from "react";
import { Upload, X, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageDropzoneProps {
  multiple?: boolean;
  value?: File[];
  previews?: string[];
  onChange: (files: File[]) => void;
  label?: string;
  inputId?: string;
}

export function ImageDropzone({
  multiple = false,
  value = [],
  previews = [],
  onChange,
  label = "Upload gambar",
  inputId,
}: ImageDropzoneProps) {
  const generatedId = useId();
  const fileInputId = inputId ?? generatedId;
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files?.length) return;
      const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
      onChange(multiple ? [...value, ...list] : [list[0]]);
    },
    [multiple, onChange, value]
  );

  const removeFile = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const objectUrls = value.map((f) => URL.createObjectURL(f));

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 transition",
          dragActive
            ? "border-primary bg-primary/5"
            : "border-slate-200 hover:border-primary/50 dark:border-teal-700"
        )}
      >
        <input
          type="file"
          accept="image/*"
          multiple={multiple}
          className="hidden"
          id={fileInputId}
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <label htmlFor={fileInputId} className="flex cursor-pointer flex-col items-center">
          <Upload className="mb-2 h-8 w-8 text-primary" />
          <p className="font-medium text-slate-700 dark:text-teal-100">{label}</p>
          <p className="mt-1 text-xs text-slate-500">
            Drag & drop atau klik untuk memilih
          </p>
        </label>
      </div>

      {(objectUrls.length > 0 || previews.length > 0) && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {previews.map((src) => (
            <div
              key={src}
              className="relative aspect-square overflow-hidden rounded-2xl ring-1 ring-slate-200 dark:ring-teal-800"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
            </div>
          ))}
          {objectUrls.map((src, i) => (
            <div
              key={src}
              className="group relative aspect-square overflow-hidden rounded-2xl ring-1 ring-slate-200"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white opacity-0 transition group-hover:opacity-100"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {objectUrls.length === 0 && previews.length === 0 && (
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <ImageIcon className="h-4 w-4" />
          Belum ada gambar
        </div>
      )}
    </div>
  );
}
