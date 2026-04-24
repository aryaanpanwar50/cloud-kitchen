"use client";

import { useDeferredValue, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { useSession } from "next-auth/react";
import { api } from "@/convex/_generated/api";
import { useCart } from "@/components/providers/cart-provider";
import { AppShell } from "@/components/ui/app-shell";
import { MenuSkeleton } from "@/components/menu/menu-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { menuCategories } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import type { MenuItemView } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Search, X, UtensilsCrossed } from "lucide-react";

const RATINGS = [3.9, 4.6, 4.4, 4.3, 4.8, 4.1, 4.5, 4.7, 4.2, 4.9];
const TABS = ["Recommended", ...menuCategories.map((c) => c.charAt(0).toUpperCase() + c.slice(1))];

function stableRating(id: string) {
  return RATINGS[id.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) % RATINGS.length];
}

function categoryLabel(category: string) {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

function CategoryIcon({ category }: { category: string }) {
  const glyph = {
    starters: "🥗",
    mains: "🍛",
    drinks: "🥤",
    desserts: "🍰",
  }[category] ?? "🍽️";

  return <span aria-hidden>{glyph}</span>;
}

function RatingRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-[#6B6B6B]">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3.5 w-3.5 ${star <= Math.round(rating) ? "fill-[#FF5F40] text-[#FF5F40]" : "fill-gray-200 text-gray-200"}`}
          />
        ))}
      </div>
      <span>{rating.toFixed(1)}</span>
    </div>
  );
}

function FeaturedCard({
  item,
  onAdd,
  compact = false,
}: {
  item: MenuItemView;
  onAdd: () => void;
  compact?: boolean;
}) {
  const rating = stableRating(item._id);

  return (
    <article className={`group relative overflow-hidden rounded-3xl border border-[#E8E8E4] bg-white transition hover:border-[#FF5F40]/30 ${compact ? "min-h-[220px]" : "min-h-[340px]"}`}>
      <div className={`relative grid h-full ${compact ? "grid-cols-[1.1fr_0.9fr]" : "lg:grid-cols-[1.15fr_0.85fr]"}`}>
        <div className={`flex flex-col justify-between ${compact ? "p-5" : "p-6 sm:p-7"}`}>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full bg-[#FF5F40]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#FF5F40]`}>
                Chef pick
              </span>
              <span className={`rounded-full bg-gray-100 px-3 py-1 text-[11px] font-medium text-[#6B6B6B]`}>
                {categoryLabel(item.category)}
              </span>
            </div>
            <h2 className={`mt-4 font-bold tracking-tight text-[#1A1A1A] ${compact ? "text-xl" : "text-3xl"}`}>
              {item.name}
            </h2>
            <p className={`mt-3 max-w-xl text-sm leading-6 text-[#6B6B6B]`}>
              {item.description}
            </p>
          </div>
          <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <RatingRow rating={rating} />
              <div className={`mt-3 text-2xl font-bold text-[#FF5F40]`}>
                {formatCurrency(item.price)}
              </div>
            </div>
            <button
              disabled={!item.isAvailable}
              onClick={onAdd}
              className={`rounded-full bg-[#FF5F40] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#E04A2A] disabled:cursor-not-allowed disabled:opacity-50`}
            >
              {item.isAvailable ? "Add to cart" : "Unavailable"}
            </button>
          </div>
        </div>
        <div className={`relative bg-[#F0EDE8] ${compact ? "min-h-[220px]" : "min-h-[260px]"}`}>
          {item.imageUrl ? (
            <Image src={item.imageUrl} alt={item.name} fill className="object-cover transition duration-500 group-hover:scale-105" />
          ) : (
            <div className="flex h-full items-center justify-center text-6xl">🍽️</div>
          )}
          {!item.isAvailable && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <span className="rounded-full bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#1A1A1A]">Sold out</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function FoodCard({ item, onAdd }: { item: MenuItemView; onAdd: () => void }) {
  const rating = stableRating(item._id);
  const comparePrice = Math.round(item.price * 1.2);

  return (
    <motion.article 
      variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
      className="group overflow-hidden rounded-3xl border border-[#E8E8E4] bg-white transition hover:border-[#FF5F40]/30"
    >
      <div className="relative h-52 overflow-hidden bg-[#F0EDE8]">
        {item.imageUrl ? (
          <Image src={item.imageUrl} alt={item.name} fill className="object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center text-5xl">🍽️</div>
        )}
        <div className="absolute left-4 top-4 flex gap-2">
          <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-[#1A1A1A] shadow-sm">
            <CategoryIcon category={item.category} /> {" "}{categoryLabel(item.category)}
          </span>
          {!item.isAvailable && (
            <span className="rounded-full bg-black/75 px-3 py-1 text-[11px] font-semibold text-white">Sold out</span>
          )}
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold tracking-tight text-[#1A1A1A]">{item.name}</h3>
            <p className="mt-1 line-clamp-2 text-sm leading-6 text-[#6B6B6B]">{item.description}</p>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between gap-4">
          <RatingRow rating={rating} />
          <div className="text-right">
            <p className="text-lg font-bold text-[#FF5F40]">{formatCurrency(item.price)}</p>
            <p className="text-xs text-[#6B6B6B] line-through">{formatCurrency(comparePrice)}</p>
          </div>
        </div>
        <button
          disabled={!item.isAvailable}
          onClick={onAdd}
          className="mt-5 w-full rounded-2xl bg-[#F0EDE8] px-4 py-3 text-sm font-bold text-[#1A1A1A] transition hover:bg-[#FF5F40] hover:text-white disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
        >
          {item.isAvailable ? "Add to cart" : "Unavailable"}
        </button>
      </div>
    </motion.article>
  );
}

export function MenuPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { addItem } = useCart();
  const menuItems = useQuery(api.menu.listAvailable, {});
  const settings = useQuery(api.settings.getPublic, {});

  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [searchValue, setSearchValue] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const deferredSearch = useDeferredValue(searchValue.trim().toLowerCase());

  const allItems = useMemo(() => ((menuItems ?? []) as MenuItemView[]), [menuItems]);
  const featuredItems = useMemo(() => allItems.slice(0, 3), [allItems]);
  const spotlightItem = featuredItems[0];
  const sideSpotlights = featuredItems.slice(1, 3);

  // Get top 5 suggestions based on current typing
  const searchSuggestions = useMemo(() => {
    if (!deferredSearch) return [];
    return allItems
      .filter((item) => item.name.toLowerCase().includes(deferredSearch) || item.description.toLowerCase().includes(deferredSearch))
      .slice(0, 5);
  }, [allItems, deferredSearch]);

  const displayedItems = useMemo(() => {
    const byTab =
      activeTab === "Recommended"
        ? allItems
        : allItems.filter((item) => item.category === activeTab.toLowerCase());
        
    if (!appliedSearch) {
      return byTab;
    }
    
    const appliedLower = appliedSearch.toLowerCase();
    return allItems.filter(
      (item) =>
        item.name.toLowerCase().includes(appliedLower) ||
        item.description.toLowerCase().includes(appliedLower),
    );
  }, [activeTab, allItems, appliedSearch]);

  function handleAdd(item: MenuItemView) {
    if (!session?.user) {
      router.push("/landing");
      return;
    }
    addItem({ itemId: item._id, name: item.name, price: item.price, quantity: 1, imageUrl: item.imageUrl });
  }

  function handleSuggestionClick(suggestionName: string) {
    setSearchValue(suggestionName);
    setAppliedSearch(suggestionName);
    setShowDropdown(false);
  }
  
  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAppliedSearch(searchValue);
    setShowDropdown(false);
  }

  function handleClearSearch() {
    setSearchValue("");
    setAppliedSearch("");
    setShowDropdown(false);
  }

  return (
    <AppShell
      title=""
      subtitle=""
      fullHeight
    >
      <div className="flex h-full flex-col overflow-hidden bg-white">
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          {!menuItems ? (
            <MenuSkeleton />
          ) : (
            <div className="space-y-10 max-w-7xl mx-auto">
              
              {/* Search Section */}
              <section className="relative z-20 mx-auto w-full max-w-2xl">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <div className="flex items-center gap-3 rounded-full border border-[#E8E8E4] bg-white px-6 py-4 shadow-sm transition-all focus-within:shadow-md focus-within:border-[#FF5F40]/50">
                    <Search className="h-5 w-5 shrink-0 text-[#6B6B6B]" />
                    <input
                      value={searchValue}
                      onChange={(event) => {
                        setSearchValue(event.target.value);
                        setShowDropdown(true);
                      }}
                      onFocus={() => setShowDropdown(true)}
                      onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                      placeholder="Search for your favorite dishes..."
                      className="flex-1 bg-transparent text-base text-[#1A1A1A] outline-none placeholder:text-[#A0A0A0]"
                    />
                    {searchValue ? (
                      <button type="button" onClick={handleClearSearch} className="text-[#6B6B6B] transition hover:text-[#1A1A1A] rounded-full p-1 hover:bg-gray-100">
                        <X className="h-5 w-5" />
                      </button>
                    ) : null}
                  </div>
                  
                  {/* Autocomplete Dropdown */}
                  <AnimatePresence>
                    {showDropdown && searchValue && searchSuggestions.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-2xl border border-[#E8E8E4] bg-white shadow-xl"
                      >
                        <ul className="py-2">
                          {searchSuggestions.map((item) => (
                            <li key={item._id}>
                              <button
                                type="button"
                                onClick={() => handleSuggestionClick(item.name)}
                                className="flex w-full items-center gap-4 px-6 py-3 text-left transition hover:bg-[#F9F9F7]"
                              >
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F0EDE8] text-[#6B6B6B]">
                                  {item.imageUrl ? (
                                    <Image src={item.imageUrl} alt={item.name} width={40} height={40} className="rounded-full object-cover h-full w-full" />
                                  ) : (
                                    <UtensilsCrossed className="h-4 w-4" />
                                  )}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-sm font-bold text-[#1A1A1A]">{item.name}</p>
                                  <p className="truncate text-xs text-[#6B6B6B]">{categoryLabel(item.category)} · {formatCurrency(item.price)}</p>
                                </div>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>

                {settings?.kitchenOpen === false && (
                  <div className="mt-4 text-center">
                    <span className="inline-flex rounded-full bg-rose-100 px-4 py-1.5 text-xs font-bold text-rose-700">
                      Kitchen is currently closed
                    </span>
                  </div>
                )}
              </section>

              {/* Tabs */}
              {!appliedSearch && (
                <section>
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide justify-center">
                    {TABS.map((tab) => {
                      const isActive = activeTab === tab;
                      return (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`relative whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-bold transition-colors duration-300 ${isActive ? "text-white" : "text-[#6B6B6B] hover:text-[#1A1A1A]"}`}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="activeTab"
                              className="absolute inset-0 rounded-full bg-[#FF5F40]"
                              transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            />
                          )}
                          <span className="relative z-10">{tab}</span>
                        </button>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Main Content Area */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={appliedSearch ? `search-${appliedSearch}` : activeTab}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.05, duration: 0.2 } },
                    exit: { opacity: 0, y: -10, transition: { duration: 0.15 } }
                  }}
                  className="space-y-10"
                >
                  {/* Spotlight Section */}
                  {!appliedSearch && activeTab === "Recommended" && spotlightItem && (
                    <section className="space-y-5">
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight text-[#1A1A1A]" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>Featured Now</h2>
                        <p className="mt-1 text-sm text-[#6B6B6B]">Start with the kitchen&apos;s strongest dishes</p>
                      </div>
                      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
                        <FeaturedCard item={spotlightItem} onAdd={() => handleAdd(spotlightItem)} />
                        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-1">
                          {sideSpotlights.map((item) => (
                            <FeaturedCard key={item._id} item={item} onAdd={() => handleAdd(item)} compact />
                          ))}
                        </div>
                      </div>
                    </section>
                  )}

                  {/* All Dishes Grid */}
                  <section className="space-y-5">
                    <div className="flex flex-wrap items-end justify-between gap-3">
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight text-[#1A1A1A]" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
                          {appliedSearch ? `Search Results for "${appliedSearch}"` : activeTab === "Recommended" ? "All Dishes" : `${activeTab}`}
                        </h2>
                      </div>
                      <div className="rounded-full border border-[#E8E8E4] bg-[#F9F9F7] px-4 py-1.5 text-sm text-[#6B6B6B] font-medium">
                        {displayedItems.length} dish{displayedItems.length === 1 ? "" : "es"}
                      </div>
                    </div>
                    
                    {displayedItems.length === 0 ? (
                      <div className="rounded-3xl border border-dashed border-[#E8E8E4] bg-[#F9F9F7] px-6 py-16">
                        <EmptyState title="No dishes match this search" description="Try another keyword, switch categories, or clear the search to browse the full kitchen." />
                      </div>
                    ) : (
                      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {displayedItems.map((item) => (
                          <FoodCard key={item._id} item={item} onAdd={() => handleAdd(item)} />
                        ))}
                      </div>
                    )}
                  </section>
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
