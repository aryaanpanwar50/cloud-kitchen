"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { menuCategories } from "@/lib/constants";
import type { MenuCategory } from "@/lib/types";
import type { Doc, Id } from "@/convex/_generated/dataModel";

type MenuItemDoc = Doc<"menuItems"> & { imageUrl?: string };

type EditorProps = {
  existing?: MenuItemDoc;
  onDone?: () => void;
};

const inputCls = "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#FF5F40] focus:bg-white transition";

export function MenuEditor({ existing, onDone }: EditorProps) {
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const generateUploadUrl = useMutation(api.menu.generateUploadUrl);
  const createMenuItem = useMutation(api.menu.create);
  const updateMenuItem = useMutation(api.menu.update);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(existing?.name ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [price, setPrice] = useState(existing ? String(existing.price) : "");
  const [category, setCategory] = useState<MenuCategory>(existing?.category ?? "starters");
  const [previewUrl, setPreviewUrl] = useState(existing?.imageUrl ?? "");
  const [storageId, setStorageId] = useState<Id<"_storage"> | undefined>(existing?.imageStorageId);
  const [isAvailable, setIsAvailable] = useState(existing?.isAvailable ?? true);

  async function handleImageUpload(file: File) {
    const postUrl = await generateUploadUrl({});
    const result = await fetch(postUrl, { method: "POST", headers: { "Content-Type": file.type }, body: file });
    if (!result.ok) throw new Error("Image upload failed");
    const { storageId: uploadedId } = (await result.json()) as { storageId: Id<"_storage"> };
    setStorageId(uploadedId);
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name, description,
        price: Number(price),
        category: category as (typeof menuCategories)[number],
        imageUrl: previewUrl,
        imageStorageId: storageId,
        isAvailable,
      };
      if (existing) {
        await updateMenuItem({ id: existing._id, previousImageStorageId: existing.imageStorageId, ...payload });
        toast.success("Menu item updated");
      } else {
        await createMenuItem(payload);
        toast.success("Menu item created");
        setName(""); setDescription(""); setPrice(""); setPreviewUrl(""); setStorageId(undefined); setIsAvailable(true);
      }
      onDone?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save menu item");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-semibold text-gray-500">Item Name</label>
          <input className={inputCls} placeholder="e.g. Butter Chicken Bowl" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-semibold text-gray-500">Description</label>
          <textarea className={`${inputCls} resize-none`} rows={3} placeholder="Describe the dish…" value={description} onChange={e => setDescription(e.target.value)} required />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-gray-500">Price (₹)</label>
          <input className={inputCls} placeholder="e.g. 180" inputMode="decimal" value={price} onChange={e => setPrice(e.target.value)} required />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-gray-500">Category</label>
          <select className={inputCls} value={category} onChange={e => setCategory(e.target.value as MenuCategory)}>
            {menuCategories.map(c => (
              <option key={c} value={c} className="capitalize">{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Image upload */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-gray-500">Dish Image</label>
        <input
          ref={uploadInputRef} type="file" accept="image/*" className="hidden"
          onChange={async e => {
            const file = e.target.files?.[0];
            if (!file) return;
            if (file.size > 4 * 1024 * 1024) { toast.error("Image must be < 4MB"); return; }
            try { setLoading(true); await handleImageUpload(file); toast.success("Image uploaded"); }
            catch (err) { toast.error(err instanceof Error ? err.message : "Upload failed"); }
            finally { setLoading(false); }
          }}
        />
        <div
          onClick={() => uploadInputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 py-6 transition hover:border-[#FF5F40] hover:bg-[#FF5F40]/10"
        >
          {previewUrl ? (
            <div className="relative h-36 w-full overflow-hidden rounded-xl">
              <Image src={previewUrl} alt="Preview" fill className="object-cover" unoptimized />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition hover:opacity-100">
                <span className="text-xs font-semibold text-white">Click to replace</span>
              </div>
            </div>
          ) : (
            <>
              <svg className="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm text-gray-400">Click to upload a JPG, PNG or WebP</p>
            </>
          )}
        </div>
      </div>

      {/* Availability toggle */}
      <label className="flex cursor-pointer items-center gap-3">
        <div
          onClick={() => setIsAvailable(v => !v)}
          className={`relative h-6 w-11 rounded-full transition-colors ${isAvailable ? "bg-[#FF5F40]" : "bg-gray-200"}`}
        >
          <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${isAvailable ? "left-5" : "left-0.5"}`}/>
        </div>
        <span className="text-sm font-medium text-gray-700">{isAvailable ? "Available now" : "Marked as sold out"}</span>
      </label>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-[#FF5F40] py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#E04A2A] disabled:opacity-60"
      >
        {loading ? "Saving…" : existing ? "Update Item" : "Create Item"}
      </button>
    </form>
  );
}
