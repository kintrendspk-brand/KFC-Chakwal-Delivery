import React from 'react';
import { MenuItem, BadgePosition } from '../types';
import { useStore } from '../context/StoreContext';
import { Heart, Plus, Flame, Sparkles, SlidersHorizontal } from 'lucide-react';

interface MenuItemCardProps {
  item: MenuItem;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item }) => {
  const {
    calculatePrice,
    formatPKR,
    addToCart,
    setSelectedItemForCustomization,
    wishlist,
    toggleWishlist,
    settings,
    isAdmin,
    viewProduct,
    themeMode,
  } = useStore();

  const isDark = themeMode === 'dark';
  const isFavorite = wishlist.includes(item.id);
  const effectivePrice = calculatePrice(item.baseKfcPrice);

  // Position classes for customizable badges
  const badgePosition: BadgePosition =
    item.customBadgePosition || settings.defaultBadgePosition || 'top-left';

  const positionClasses: Record<BadgePosition, string> = {
    'top-left': 'top-2.5 left-2.5',
    'top-right': 'top-2.5 right-12',
    'bottom-left': 'bottom-2.5 left-2.5',
    'bottom-right': 'bottom-2.5 right-2.5',
  };

  const handleCardClick = () => {
    viewProduct(item);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    // If the item has required customizations, open modal instead
    if (
      item.customizableOptions?.allowSpiceLevel ||
      item.customizableOptions?.allowDrinkChoice ||
      (item.customizableOptions?.availableAddons && item.customizableOptions.availableAddons.length > 0)
    ) {
      setSelectedItemForCustomization(item);
    } else {
      addToCart(item);
    }
  };

  const handleCustomizeUpgrade = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedItemForCustomization(item);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-red-950/20 group cursor-pointer border ${
        isDark
          ? 'bg-[#18181c] border-[#27272e] hover:border-[#e4002b]/60'
          : 'bg-white border-zinc-200 hover:border-[#e4002b]/60 shadow-sm'
      }`}
    >
      {/* Card Top: Image & Floating Badges */}
      <div className="relative aspect-[4/3] w-full bg-[#111113] overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            const target = e.currentTarget;
            target.src = '/src/assets/images/kfc_hero_zinger_combo_1791015805739.jpg';
          }}
        />

        {/* Gradient shadow for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Customizable Badges container with dynamic position */}
        <div className={`absolute ${positionClasses[badgePosition]} flex flex-wrap gap-1.5 z-10 pointer-events-none`}>
          {item.customBadgeText ? (
            <span className="bg-[#e4002b] text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded shadow-md tracking-wide">
              {item.customBadgeText}
            </span>
          ) : (
            <>
              {item.isPopular && (
                <span className="bg-[#e4002b] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded shadow">
                  Popular
                </span>
              )}
              {item.isSpicy && (
                <span className="bg-amber-600 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded flex items-center gap-1 shadow">
                  <Flame className="w-2.5 h-2.5" />
                  Spicy
                </span>
              )}
            </>
          )}
        </div>

        {/* Wishlist toggle */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(item.id);
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer z-20 ${
            isFavorite
              ? 'bg-[#e4002b] text-white shadow-md'
              : 'bg-black/50 text-zinc-300 hover:text-white hover:bg-black/80'
          }`}
          title={isFavorite ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Image bottom badge */}
        {badgePosition !== 'bottom-right' && (
          <div className="absolute bottom-2 right-2.5 text-[10px] text-zinc-300 bg-black/75 backdrop-blur-sm px-2 py-0.5 rounded border border-white/10 font-mono tabular-nums">
            {isAdmin ? `+${settings.markupPercentage}% Markup` : 'Chakwal Delivery'}
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className={`font-kfc text-xl sm:text-2xl font-black uppercase tracking-tight group-hover:text-[#e4002b] transition-colors leading-tight ${
            isDark ? 'text-white' : 'text-zinc-900'
          }`}>
            {item.name}
          </h3>
          <p className={`text-xs mt-1.5 line-clamp-2 leading-relaxed ${
            isDark ? 'text-zinc-400' : 'text-zinc-600'
          }`}>
            {item.description}
          </p>
        </div>

        {/* Price & Action Buttons */}
        <div className={`mt-4 pt-3 border-t flex flex-col gap-2.5 ${
          isDark ? 'border-[#26262e]' : 'border-zinc-200'
        }`}>
          {/* Price line */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold uppercase text-zinc-500 tracking-wider">
                Price
              </span>
              <span className={`text-lg sm:text-xl font-black tabular-nums ${
                isDark ? 'text-white' : 'text-zinc-900'
              }`}>
                {formatPKR(effectivePrice)}
              </span>
            </div>
            {isAdmin && (
              <span className="text-[10px] text-amber-500 font-mono tabular-nums bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                Original KFC: Rs. {item.baseKfcPrice}
              </span>
            )}
          </div>

          {/* Action Buttons: "Customize & Upgrade" + "Add to Bucket" */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleCustomizeUpgrade}
              className={`text-[11px] font-bold uppercase py-2 px-2 rounded-xl flex items-center justify-center gap-1 border transition-all cursor-pointer ${
                isDark
                  ? 'border-[#3a3a46] bg-[#22222a] hover:bg-[#2b2b35] text-zinc-200 hover:text-white'
                  : 'border-zinc-300 bg-zinc-100 hover:bg-zinc-200 text-zinc-800'
              }`}
              title="Customize spice, beverage, and add-ons"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#e4002b]" />
              <span className="truncate">Customize</span>
            </button>

            <button
              type="button"
              onClick={handleQuickAdd}
              className="bg-[#e4002b] hover:bg-[#c30025] text-white text-[11px] font-black uppercase py-2 px-2 rounded-xl flex items-center justify-center gap-1 transition-all shadow-md shadow-red-950/50 hover:shadow-red-900/60 cursor-pointer active:scale-95 shrink-0"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span className="truncate">ADD TO BUCKET</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

