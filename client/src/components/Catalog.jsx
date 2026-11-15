import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart, MAX_QTY_PER_ITEM } from '../context/CartContext';
import SingleItemModal from './SingleItemModal';
import {
  Search,
  Check,
  Plus,
  Minus,
  MessageSquare,
  ShoppingBag,
  Package,
  Layers,
  ArrowRight,
  AlertCircle,
  RefreshCw,
  Eye,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

const FALLBACK_PRODUCTS = [
  {
    id: 'prod-01',
    name: 'Clinical Hyaluronic & Niacinamide Serums',
    sku: 'BN-SKN-001',
    category: 'skincare',
    categoryLabel: 'Skincare',
    moq: '24 Units / Case',
    packSize: '30ml / 50ml Glass Droppers',
    stockStatus: 'In Stock',
    estimatedMargin: '38% – 48%',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    description: 'Concentrated clinical actives formulated for retail skincare counters and aesthetic clinic retail shelves.',
  },
  {
    id: 'prod-02',
    name: 'Barrier Defense SPF 50+ Broad Spectrum',
    sku: 'BN-SKN-002',
    category: 'skincare',
    categoryLabel: 'Skincare',
    moq: '36 Units / Carton',
    packSize: '50g Matte Tube',
    stockStatus: 'In Stock',
    estimatedMargin: '35% – 42%',
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80',
    description: 'Ultra-lightweight invisible finish SPF 50+ with high repeat purchase frequency in retail stores.',
  },
  {
    id: 'prod-03',
    name: 'Soft-Matte Velvet Lip Pigments (18 Shades)',
    sku: 'BN-MKP-101',
    category: 'makeup',
    categoryLabel: 'Color Cosmetics',
    moq: '36 Pcs Display Tray',
    packSize: '5ml Frosted Vial',
    stockStatus: 'In Stock',
    estimatedMargin: '42% – 52%',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    description: 'Long-wear non-drying liquid lipsticks in counter-ready display trays curated for Indian skin tones.',
  },
  {
    id: 'prod-04',
    name: 'HD High-Coverage Liquid Foundation',
    sku: 'BN-MKP-102',
    category: 'makeup',
    categoryLabel: 'Color Cosmetics',
    moq: '24 Assorted Units',
    packSize: '35ml Pump Flacon',
    stockStatus: 'In Stock',
    estimatedMargin: '40% – 50%',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80',
    description: 'Buildable professional grade foundation with 12 undertones designed for studio and everyday retail wear.',
  },
  {
    id: 'prod-05',
    name: 'Professional Salon Keratin Smoothing Complex',
    sku: 'BN-HAR-201',
    category: 'haircare',
    categoryLabel: 'Hair & Salon',
    moq: '6 Sets (Backbar)',
    packSize: '1,000ml (1 Litre Bottle)',
    stockStatus: 'In Stock',
    estimatedMargin: '35% – 48%',
    image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80',
    description: 'Professional salon backbar smoothing therapy and clarifying pre-wash systems for high-ticket hair services.',
  },
  {
    id: 'prod-06',
    name: 'Bond Repair Hair Mask & Moroccan Argan Oil',
    sku: 'BN-HAR-202',
    category: 'haircare',
    categoryLabel: 'Hair & Salon',
    moq: '18 Units Case Lot',
    packSize: '250ml Tub / 100ml Oil',
    stockStatus: 'In Stock',
    estimatedMargin: '38% – 46%',
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80',
    description: 'Intense reconstructive treatment for chemically treated hair; excellent salon checkout retail margin.',
  },
  {
    id: 'prod-07',
    name: 'Artisanal Eau de Parfum & Long-Wear Mists',
    sku: 'BN-FRG-301',
    category: 'fragrance',
    categoryLabel: 'Fragrances',
    moq: '12 Bottles Master Pack',
    packSize: '100ml Heavy Glass EDP',
    stockStatus: 'In Stock',
    estimatedMargin: '45% – 58%',
    image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=800&q=80',
    description: 'French essence concentration (18% perfume oil) with magnetic cap packaging for high-ticket gifting.',
  },
  {
    id: 'prod-08',
    name: 'Botanical Foaming Face Washes & Body Cleansers',
    sku: 'BN-PER-401',
    category: 'personal-care',
    categoryLabel: 'Personal Care',
    moq: '48 Units / Carton',
    packSize: '150ml Foam / 250ml Gel',
    stockStatus: 'In Stock',
    estimatedMargin: '30% – 42%',
    image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=800&q=80',
    description: 'High-turnover daily hygiene essentials with rapid re-order frequency and strong FMCG retail pull.',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All Inventory' },
  { id: 'skincare', label: 'Skincare' },
  { id: 'makeup', label: 'Color Cosmetics' },
  { id: 'haircare', label: 'Hair & Salon' },
  { id: 'fragrance', label: 'Fragrances' },
  { id: 'personal-care', label: 'Personal Care' },
];

export default function Catalog() {
  const { addToCart, getItemQuantity } = useCart();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState(null);
  const [cardQuantities, setCardQuantities] = useState({});
  const [addedItemFeedback, setAddedItemFeedback] = useState({});

  useEffect(() => {
    let isMounted = true;
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const queryParam = activeTab === 'all' ? '' : `?category=${activeTab}`;
        const res = await fetch(`/api/catalog${queryParam}`);
        if (!res.ok) throw new Error('Failed to fetch catalog from server');
        const json = await res.json();
        if (isMounted && json.data && json.data.length > 0) {
          setProducts(json.data);
        }
      } catch (err) {
        if (isMounted) {
          console.warn('Backend catalog offline or unreachable, using local fallback:', err.message);
          let filtered = FALLBACK_PRODUCTS;
          if (activeTab !== 'all') {
            filtered = FALLBACK_PRODUCTS.filter((item) => item.category === activeTab);
          }
          setProducts(filtered);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCatalog();
    return () => {
      isMounted = false;
    };
  }, [activeTab]);

  const filteredProducts = products.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      (item.sku && item.sku.toLowerCase().includes(q)) ||
      (item.categoryLabel && item.categoryLabel.toLowerCase().includes(q)) ||
      (item.category && item.category.toLowerCase().includes(q))
    );
  });

  const getCardQty = (id) => cardQuantities[id] || 1;

  const handleCardQtyStep = (id, delta) => {
    setCardQuantities((prev) => {
      const current = prev[id] || 1;
      const next = Math.min(MAX_QTY_PER_ITEM, Math.max(1, current + delta));
      return { ...prev, [id]: next };
    });
  };

  const handleCardQtyDirect = (id, value) => {
    const parsed = parseInt(value, 10);
    if (!isNaN(parsed)) {
      const next = Math.min(MAX_QTY_PER_ITEM, Math.max(1, parsed));
      setCardQuantities((prev) => ({ ...prev, [id]: next }));
    }
  };

  const handleAddToCart = (product) => {
    const targetId = product.sku || product._id || product.id;
    const qty = getCardQty(targetId);
    addToCart(product, qty);

    setAddedItemFeedback((prev) => ({ ...prev, [targetId]: true }));
    setTimeout(() => {
      setAddedItemFeedback((prev) => ({ ...prev, [targetId]: false }));
    }, 1800);
  };

  return (
    <section className="bg-stone-50/70 py-10 sm:py-14 border-b border-zinc-200 relative">
      {/* Background Dot-Matrix Texture */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Strip with Rich Contrast */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-zinc-200">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-mono tracking-widest text-zinc-600 uppercase font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                WHOLESALE INVENTORY DIRECTORY
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-950 text-white font-bold">
                MAX 25 UNITS/SKU
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
              B2B Wholesale Cosmetic Catalog
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 mt-1 max-w-2xl">
              Authentic batch-coded cases and salon lots for verified retail stores. Add up to 25 units per item to your Enquiry Cart or click any SKU for technical trade specifications.
            </p>
          </div>

          <Link
            to="/enquiry-cart"
            className="inline-flex items-center gap-2 self-start md:self-auto bg-zinc-950 text-white px-5 py-3 rounded-lg font-semibold text-xs tracking-wider uppercase hover:bg-zinc-800 transition-all shadow-md group"
          >
            <ShoppingBag className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            <span>Open Enquiry Cart</span>
            <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
          </Link>
        </div>

        {/* Filter & Search Bar */}
        <div className="py-6 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between border-b border-zinc-200 mb-8 bg-white/80 p-4 rounded-xl border shadow-sm backdrop-blur-sm">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`text-xs font-semibold px-3.5 py-2 rounded-lg transition-all whitespace-nowrap tracking-wide ${
                  activeTab === cat.id
                    ? 'bg-zinc-950 text-white font-bold shadow-sm'
                    : 'bg-stone-100 text-zinc-700 hover:text-zinc-950 hover:bg-stone-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[260px] sm:w-80">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by SKU, product, category..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-zinc-300 rounded-lg bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-950 focus:border-zinc-950 placeholder:text-zinc-400 font-sans"
            />
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-8">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="border border-zinc-200 rounded-xl p-4 bg-white animate-pulse space-y-4">
                <div className="h-48 bg-stone-100 rounded-lg" />
                <div className="h-4 bg-stone-100 rounded w-2/3" />
                <div className="h-3 bg-stone-100 rounded w-1/2" />
                <div className="h-8 bg-stone-100 rounded" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-zinc-300 rounded-xl bg-white my-6 shadow-sm">
            <AlertCircle className="w-8 h-8 text-zinc-400 mx-auto mb-3" />
            <h3 className="font-bold text-sm text-zinc-900">No wholesale inventory matched your search</h3>
            <p className="text-xs text-zinc-500 mt-1">Try resetting the filter category or search keyword.</p>
            <button
              onClick={() => {
                setActiveTab('all');
                setSearchQuery('');
              }}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-zinc-900 uppercase tracking-wider underline hover:text-zinc-600"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((item) => {
              const cardId = item.sku || item._id || item.id;
              const currentQty = getCardQty(cardId);
              const inCartCount = getItemQuantity(cardId);
              const isMax = currentQty >= MAX_QTY_PER_ITEM;
              const isJustAdded = !!addedItemFeedback[cardId];

              // Capacity Progress Bar Percentage
              const capacityPercent = Math.min(100, Math.round((inCartCount / MAX_QTY_PER_ITEM) * 100));

              return (
                <div
                  key={cardId}
                  className="bg-white border border-zinc-200/90 rounded-xl flex flex-col justify-between hover:border-zinc-800 hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 overflow-hidden group shadow-sm"
                >
                  <div>
                    {/* Image Area with Quick-Specs Overlay Button */}
                    <div
                      onClick={() => setSelectedProductForModal(item)}
                      className="relative aspect-[4/3] bg-stone-100 overflow-hidden border-b border-zinc-200 cursor-pointer"
                      title="Click to view full trade specifications & batch authenticity"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      
                      {/* Top Badges */}
                      <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                        <span className="font-mono text-[10px] font-black tracking-wider px-2 py-0.5 rounded bg-zinc-950/90 text-white backdrop-blur-sm uppercase">
                          {item.sku}
                        </span>
                      </div>
                      
                      <div className="absolute top-2.5 right-2.5">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/95 text-zinc-900 font-bold shadow-sm border border-zinc-200">
                          {item.stockStatus || 'In Stock'}
                        </span>
                      </div>

                      {/* Hover Overlay Quick-View Pill */}
                      <div className="absolute inset-0 bg-zinc-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 text-zinc-950 font-mono text-[11px] font-bold shadow-lg">
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Trade Specs</span>
                        </span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-4 space-y-3">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono tracking-wider text-zinc-500 uppercase font-semibold block">
                          {item.categoryLabel || item.category}
                        </span>
                        <h3 className="font-bold text-sm text-zinc-900 leading-snug line-clamp-2">
                          {item.name}
                        </h3>
                      </div>

                      <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Specs Matrix */}
                      <div className="font-mono text-[11px] bg-stone-50 border border-zinc-200 rounded-lg p-2.5 space-y-1">
                        <div className="flex justify-between items-center text-zinc-600">
                          <span>MOQ Case:</span>
                          <span className="font-bold text-zinc-900">{item.moq || '1 Case Lot'}</span>
                        </div>
                        <div className="flex justify-between items-center text-zinc-600">
                          <span>Packaging:</span>
                          <span className="text-zinc-800 truncate max-w-[130px]">{item.packSize || 'Standard'}</span>
                        </div>
                        {item.estimatedMargin && (
                          <div className="flex justify-between items-center text-emerald-700 font-bold pt-1 border-t border-zinc-200/80">
                            <span>Target Margin:</span>
                            <span>{item.estimatedMargin}</span>
                          </div>
                        )}
                      </div>

                      {/* Visual 25-Unit Capacity Progress Bar */}
                      <div className="space-y-1 pt-1">
                        <div className="flex justify-between items-center text-[10px] font-mono">
                          <span className="text-zinc-500 font-semibold">Enquiry Cart Limit:</span>
                          <span className={`font-bold ${inCartCount >= 25 ? 'text-amber-800' : 'text-zinc-700'}`}>
                            {inCartCount} / 25 Units
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${
                              capacityPercent >= 100
                                ? 'bg-amber-500'
                                : capacityPercent > 0
                                ? 'bg-zinc-900'
                                : 'bg-transparent'
                            }`}
                            style={{ width: `${capacityPercent}%` }}
                          />
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Interactive Card Action Area */}
                  <div className="p-4 pt-0 space-y-2.5">
                    {/* Quantity Selector with Max 25 Indicator */}
                    <div className="flex items-center justify-between border-t border-zinc-100 pt-3">
                      <span className="text-[11px] font-mono text-zinc-500 font-medium">Add Units:</span>
                      
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center border border-zinc-300 rounded-md bg-stone-50 overflow-hidden">
                          <button
                            type="button"
                            onClick={() => handleCardQtyStep(cardId, -1)}
                            disabled={currentQty <= 1}
                            className="px-2 py-1 text-zinc-700 hover:text-zinc-950 hover:bg-stone-200 disabled:opacity-30 disabled:cursor-not-allowed border-r border-zinc-300"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>

                          <input
                            type="number"
                            min="1"
                            max={MAX_QTY_PER_ITEM}
                            value={currentQty}
                            onChange={(e) => handleCardQtyDirect(cardId, e.target.value)}
                            className="w-10 text-center text-xs font-mono font-bold text-zinc-950 py-1 bg-transparent focus:outline-none"
                          />

                          <button
                            type="button"
                            onClick={() => handleCardQtyStep(cardId, 1)}
                            disabled={isMax}
                            className="px-2 py-1 text-zinc-700 hover:text-zinc-950 hover:bg-stone-200 disabled:opacity-30 disabled:cursor-not-allowed border-l border-zinc-300"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {isMax && (
                          <span className="text-[9px] font-mono font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300">
                            Max 25
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions: Add to Cart + View Trade Specs */}
                    <div className="space-y-1.5">
                      <button
                        type="button"
                        onClick={() => handleAddToCart(item)}
                        className={`w-full py-2.5 px-3 rounded-lg text-xs font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-2 shadow-sm ${
                          isJustAdded
                            ? 'bg-emerald-700 text-white'
                            : 'bg-zinc-950 text-white hover:bg-zinc-800'
                        }`}
                      >
                        {isJustAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-white" />
                            <span>Added {currentQty} to Cart!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                            <span>
                              Add to Cart {inCartCount > 0 ? `(${inCartCount} in cart)` : ''}
                            </span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedProductForModal(item)}
                        className="w-full py-2 px-3 rounded-lg text-xs font-semibold tracking-wider uppercase border border-zinc-300 text-zinc-700 hover:bg-stone-100 hover:text-zinc-950 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5 text-zinc-500" />
                        <span>View Trade Specs & Enquire</span>
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Single Item Quick-Specs & RFQ Modal */}
      {selectedProductForModal && (
        <SingleItemModal
          product={selectedProductForModal}
          isOpen={!!selectedProductForModal}
          onClose={() => setSelectedProductForModal(null)}
          onAddToCartAndClose={(prod, qty) => {
            addToCart(prod, qty);
            setSelectedProductForModal(null);
          }}
        />
      )}
    </section>
  );
}
