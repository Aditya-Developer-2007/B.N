import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BUSINESS_CONFIG } from '../config/business';
import {
  Lock,
  Unlock,
  KeyRound,
  Package,
  ShoppingBag,
  Trash2,
  Plus,
  RefreshCw,
  Phone,
  MessageSquare,
  Building2,
  Calendar,
  Layers,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ArrowLeft,
  X,
} from 'lucide-react';

const ADMIN_PIN = '8527';

const PRESET_IMAGES = [
  { label: 'Serum Dropper', url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80' },
  { label: 'Sunscreen Gel Tube', url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80' },
  { label: 'Matte Liquid Lipstick', url: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80' },
  { label: 'Studio Foundation Set', url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80' },
  { label: 'Salon Keratin 1L Bottle', url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80' },
  { label: 'Luxury Fragrance EDP', url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80' },
  { label: 'Facial Kit Master Box', url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80' },
  { label: 'Micellar Deep Cleanser', url: 'https://images.unsplash.com/photo-1608248597359-0e6d526a6828?auto=format&fit=crop&w=800&q=80' },
];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('bne_admin_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  const [activeTab, setActiveTab] = useState('enquiries'); // 'enquiries' | 'catalog'
  const [enquiries, setEnquiries] = useState([]);
  const [enquiriesLoading, setEnquiriesLoading] = useState(false);

  const [catalog, setCatalog] = useState([]);
  const [catalogLoading, setCatalogLoading] = useState(false);

  // New Product Form State
  const [productForm, setProductForm] = useState({
    sku: '',
    name: '',
    category: 'Skincare',
    packSize: '',
    moq: '24 Units / Case',
    image: PRESET_IMAGES[0].url,
    estimatedMargin: '38% – 48%',
    description: '',
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState({ type: '', text: '' });
  const [showAddModal, setShowAddModal] = useState(false);

  // Check PIN
  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pinInput.trim() === ADMIN_PIN) {
      setIsAuthenticated(true);
      sessionStorage.setItem('bne_admin_auth', 'true');
      setPinError('');
    } else {
      setPinError('Invalid PIN code. Access denied.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('bne_admin_auth');
    setPinInput('');
  };

  // Fetch Enquiries
  const fetchEnquiries = async () => {
    setEnquiriesLoading(true);
    try {
      const res = await fetch('/api/enquiries');
      const data = await res.json();
      if (data.data) {
        setEnquiries(data.data);
      }
    } catch (err) {
      console.error('Failed to load enquiries:', err);
    } finally {
      setEnquiriesLoading(false);
    }
  };

  // Fetch Catalog
  const fetchCatalog = async () => {
    setCatalogLoading(true);
    try {
      const res = await fetch('/api/catalog');
      const data = await res.json();
      if (data.data) {
        setCatalog(data.data);
      }
    } catch (err) {
      console.error('Failed to load catalog:', err);
    } finally {
      setCatalogLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchEnquiries();
      fetchCatalog();
    }
  }, [isAuthenticated]);

  // Handle Add Product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setFormMessage({ type: '', text: '' });

    if (!productForm.sku.trim() || !productForm.name.trim() || !productForm.packSize.trim() || !productForm.image.trim()) {
      setFormMessage({ type: 'error', text: 'SKU, Name, Pack Size, and Image URL are required.' });
      return;
    }

    setFormSubmitting(true);
    try {
      const res = await fetch('/api/catalog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productForm),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setFormMessage({ type: 'success', text: `Product "${data.data?.name || productForm.sku}" added successfully!` });
        setProductForm({
          sku: '',
          name: '',
          category: 'Skincare',
          packSize: '',
          moq: '24 Units / Case',
          image: PRESET_IMAGES[0].url,
          estimatedMargin: '38% – 48%',
          description: '',
        });
        setShowAddModal(false);
        fetchCatalog();
      } else {
        setFormMessage({ type: 'error', text: data.message || 'Failed to add product.' });
      }
    } catch (err) {
      setFormMessage({ type: 'error', text: err.message || 'Network error adding product.' });
    } finally {
      setFormSubmitting(false);
    }
  };

  // Handle Delete Product
  const handleDeleteProduct = async (productIdOrSku, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" (${productIdOrSku}) from the wholesale catalog?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/catalog/${encodeURIComponent(productIdOrSku)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCatalog((prev) => prev.filter((item) => (item._id || item.id || item.sku) !== productIdOrSku && item.sku !== productIdOrSku));
      } else {
        alert(data.message || 'Failed to remove product');
      }
    } catch (err) {
      alert('Error deleting product: ' + err.message);
    }
  };

  // 1. PIN Protected Login View
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-zinc-50">
        <div className="w-full max-w-sm border border-zinc-200 bg-white p-6 sm:p-8 rounded-lg shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-900">
              <Lock className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-mono tracking-widest text-zinc-500 uppercase font-semibold block">
              B.N ENTERPRISES
            </span>
            <h1 className="text-xl font-extrabold text-zinc-900 tracking-tight">
              Trade Desk Administration
            </h1>
            <p className="text-xs text-zinc-500">
              Authorized personnel only. Enter commercial operations PIN to access wholesale records.
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                Security PIN Code
              </label>
              <div className="relative">
                <input
                  type="password"
                  maxLength={6}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Enter PIN (Default: 8527)"
                  autoFocus
                  className="w-full px-3.5 py-2.5 text-center text-lg font-mono tracking-widest border border-zinc-300 rounded bg-zinc-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900"
                />
                <KeyRound className="w-4 h-4 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              {pinError && (
                <p className="text-xs text-red-600 mt-1.5 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{pinError}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-zinc-900 text-white font-semibold text-xs tracking-wider uppercase rounded hover:bg-zinc-800 transition-colors shadow-sm"
            >
              Verify PIN & Access Portal
            </button>
          </form>

          <div className="pt-4 border-t border-zinc-100 flex items-center justify-between text-[11px] font-mono text-zinc-500">
            <span>Help: 8527606769</span>
            <Link to="/" className="text-zinc-800 hover:underline">
              ← Return to Site
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. Authenticated Admin Dashboard
  return (
    <div className="bg-zinc-50/50 min-h-[calc(100vh-140px)] py-8 border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Control Bar */}
        <div className="bg-white border border-zinc-200 rounded-lg p-5 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-zinc-900 text-white">
                Admin Portal
              </span>
              <span className="text-xs font-mono text-zinc-500">PIN: Authorized</span>
            </div>
            <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">
              B.N Enterprises — Wholesale Operations Desk
            </h1>
            <p className="text-xs text-zinc-500 font-mono">
              Direct Contact Desk: {BUSINESS_CONFIG.phoneDisplay} | Primary Distributor Management
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/catalog"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-zinc-300 rounded text-zinc-700 hover:bg-zinc-50 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Live Catalog</span>
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-zinc-100 border border-zinc-200 rounded text-zinc-700 hover:bg-zinc-200 transition-colors font-mono"
            >
              <Unlock className="w-3.5 h-3.5 text-zinc-600" />
              <span>Lock / Exit</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Strip */}
        <div className="flex border-b border-zinc-200 gap-2">
          <button
            onClick={() => setActiveTab('enquiries')}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold tracking-wider uppercase border-b-2 transition-all ${
              activeTab === 'enquiries'
                ? 'border-zinc-900 text-zinc-900 bg-white rounded-t'
                : 'border-transparent text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>B2B Cart Enquiries ({enquiries.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold tracking-wider uppercase border-b-2 transition-all ${
              activeTab === 'catalog'
                ? 'border-zinc-900 text-zinc-900 bg-white rounded-t'
                : 'border-transparent text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Wholesale Inventory ({catalog.length})</span>
          </button>
        </div>

        {/* Tab 1: B2B Enquiries */}
        {activeTab === 'enquiries' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-white p-4 border border-zinc-200 rounded">
              <div className="text-xs text-zinc-600">
                <span className="font-bold text-zinc-900">Registered Cart Enquiries:</span>{' '}
                Records submitted through the B2B Wholesale Portal.
              </div>
              <button
                onClick={fetchEnquiries}
                disabled={enquiriesLoading}
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-zinc-700 hover:text-zinc-950 px-2.5 py-1 border border-zinc-200 rounded bg-zinc-50 hover:bg-zinc-100"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${enquiriesLoading ? 'animate-spin' : ''}`} />
                <span>Refresh Logs</span>
              </button>
            </div>

            {enquiriesLoading ? (
              <div className="bg-white border border-zinc-200 rounded p-8 text-center text-xs text-zinc-500 font-mono animate-pulse">
                Fetching wholesale enquiry records from database...
              </div>
            ) : enquiries.length === 0 ? (
              <div className="bg-white border border-zinc-200 rounded p-12 text-center space-y-2">
                <ShoppingBag className="w-8 h-8 text-zinc-300 mx-auto" />
                <h3 className="font-bold text-sm text-zinc-900">No B2B Cart Enquiries Found</h3>
                <p className="text-xs text-zinc-500">
                  New cart submissions made by beauty retail stores will appear here immediately.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {enquiries.map((enq, idx) => {
                  const phoneNum = enq.phoneNumber || enq.phone;
                  const dateStr = enq.createdAt ? new Date(enq.createdAt).toLocaleString() : 'Recent';

                  return (
                    <div
                      key={enq._id || idx}
                      className="bg-white border border-zinc-200 rounded-lg p-5 sm:p-6 space-y-4 hover:border-zinc-400 transition-colors"
                    >
                      {/* Enquiry Top Summary */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs font-extrabold px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 border border-zinc-200">
                            #{enq._id ? String(enq._id).slice(-6).toUpperCase() : `ENQ-${idx + 1}`}
                          </span>
                          <div>
                            <h3 className="font-bold text-sm text-zinc-900">
                              {enq.businessName}
                            </h3>
                            <span className="text-xs text-zinc-500">
                              Contact Person: <strong className="text-zinc-800">{enq.buyerName}</strong>
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-xs font-mono">
                          <div className="flex items-center gap-1.5 text-zinc-500">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{dateStr}</span>
                          </div>
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded font-bold">
                            {enq.status || 'Active Enquiry'}
                          </span>
                        </div>
                      </div>

                      {/* Buyer Details Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs bg-zinc-50/80 p-3.5 rounded border border-zinc-200/70">
                        <div>
                          <span className="text-zinc-500 block text-[10px] uppercase">Phone / WhatsApp:</span>
                          <div className="flex items-center gap-2 pt-0.5">
                            <span className="font-bold text-zinc-900">{phoneNum}</span>
                            {phoneNum && (
                              <a
                                href={`https://wa.me/91${String(phoneNum).replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-emerald-700 hover:text-emerald-900"
                                title="Open WhatsApp Chat"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </div>

                        <div>
                          <span className="text-zinc-500 block text-[10px] uppercase">Business Channel:</span>
                          <span className="font-bold text-zinc-900">{enq.businessType || 'Cosmetics Retail'}</span>
                        </div>

                        <div>
                          <span className="text-zinc-500 block text-[10px] uppercase">Cart Volume:</span>
                          <span className="font-bold text-zinc-900">
                            {enq.totalItems || (enq.items && enq.items.length) || 0} Line Items ({enq.totalUnits || 0} Total Units)
                          </span>
                        </div>
                      </div>

                      {/* Itemized SKUs List */}
                      <div className="space-y-2">
                        <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-zinc-700 block">
                          Ordered Items (Capped 1–25 units/SKU):
                        </span>
                        <div className="divide-y divide-zinc-100 border border-zinc-200 rounded overflow-hidden">
                          {enq.items && enq.items.length > 0 ? (
                            enq.items.map((it, itemIdx) => (
                              <div
                                key={itemIdx}
                                className="p-2.5 sm:px-4 bg-white flex items-center justify-between text-xs font-mono"
                              >
                                <div className="flex items-center gap-2.5">
                                  <span className="text-[10px] px-1.5 py-0.5 bg-zinc-100 text-zinc-800 rounded font-bold border border-zinc-200">
                                    {it.sku}
                                  </span>
                                  <span className="font-sans font-medium text-zinc-900">
                                    {it.name}
                                  </span>
                                  {it.packSize && (
                                    <span className="text-zinc-400 text-[11px] hidden sm:inline">
                                      ({it.packSize})
                                    </span>
                                  )}
                                </div>
                                <div className="font-bold text-zinc-900 bg-zinc-50 px-2 py-0.5 rounded border border-zinc-200">
                                  {it.qty || it.quantity} Units
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-3 text-xs text-zinc-400">No item details recorded.</div>
                          )}
                        </div>
                      </div>

                      {/* Buyer Notes */}
                      {enq.notes && (
                        <div className="text-xs bg-amber-50/60 border border-amber-200/80 p-3 rounded text-zinc-700">
                          <strong className="font-mono uppercase text-[10px] text-amber-900 block mb-0.5">
                            Buyer Instructions:
                          </strong>
                          {enq.notes}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Wholesale Catalog Management */}
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            
            {/* Action Bar */}
            <div className="bg-white p-4 border border-zinc-200 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-bold text-sm text-zinc-900">Wholesale Cosmetic Inventory Master</h3>
                <p className="text-xs text-zinc-500">
                  Add new cosmetic lines with wholesale MOQ and case lot specs or remove depleted items.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={fetchCatalog}
                  disabled={catalogLoading}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-zinc-700 hover:text-zinc-950 px-3 py-2 border border-zinc-200 rounded bg-zinc-50 hover:bg-zinc-100"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${catalogLoading ? 'animate-spin' : ''}`} />
                  <span>Refresh Inventory</span>
                </button>

                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold bg-zinc-900 text-white px-3.5 py-2 rounded hover:bg-zinc-800 transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Wholesale Product</span>
                </button>
              </div>
            </div>

            {/* Inventory Grid Table */}
            {catalogLoading ? (
              <div className="bg-white border border-zinc-200 rounded p-8 text-center text-xs text-zinc-500 font-mono animate-pulse">
                Loading wholesale items...
              </div>
            ) : (
              <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-600 font-mono text-[11px] uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Item & SKU</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Pack Size</th>
                        <th className="py-3 px-4">MOQ</th>
                        <th className="py-3 px-4">Margin</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200">
                      {catalog.map((item) => {
                        const itemId = item._id || item.id || item.sku;
                        return (
                          <tr key={itemId} className="hover:bg-zinc-50/70 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-10 h-10 object-cover rounded border border-zinc-200 bg-zinc-100 shrink-0"
                                />
                                <div>
                                  <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 bg-zinc-100 text-zinc-800 rounded border border-zinc-200">
                                    {item.sku}
                                  </span>
                                  <h4 className="font-bold text-zinc-900 mt-0.5 line-clamp-1">{item.name}</h4>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 font-mono text-zinc-600">
                              {item.categoryLabel || item.category}
                            </td>
                            <td className="py-3 px-4 font-mono text-zinc-600 truncate max-w-[150px]">
                              {item.packSize}
                            </td>
                            <td className="py-3 px-4 font-mono text-zinc-600">
                              {item.moq || '1 Case Lot'}
                            </td>
                            <td className="py-3 px-4 font-mono font-bold text-emerald-700">
                              {item.estimatedMargin || '38% – 48%'}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => handleDeleteProduct(itemId, item.name)}
                                className="inline-flex items-center gap-1 text-[11px] font-mono text-red-600 hover:text-red-800 hover:bg-red-50 px-2 py-1 rounded transition-colors border border-red-200"
                                title="Remove item from catalog"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        )}

      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border border-zinc-200 rounded-lg max-w-xl w-full p-6 space-y-5 my-8 shadow-2xl">
            
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-zinc-900" />
                <h3 className="font-extrabold text-base text-zinc-900">Add Wholesale Cosmetic SKU</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded text-zinc-400 hover:text-zinc-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formMessage.text && (
              <div
                className={`p-3 rounded text-xs font-medium flex items-center gap-2 ${
                  formMessage.type === 'error'
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                }`}
              >
                {formMessage.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>{formMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase text-zinc-700 mb-1">
                    SKU Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.sku}
                    onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                    placeholder="e.g. BN-SKN-205"
                    className="w-full px-3 py-2 text-xs font-mono uppercase border border-zinc-300 rounded bg-zinc-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase text-zinc-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-zinc-300 rounded bg-zinc-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  >
                    <option value="skincare">Skincare & Clinical</option>
                    <option value="makeup">Color Cosmetics</option>
                    <option value="haircare">Hair & Salon Professional</option>
                    <option value="fragrance">Fragrances & Perfumes</option>
                    <option value="personal-care">Personal Care & FMCG</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold uppercase text-zinc-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. Botanical Glycolic 7% Exfoliating Toner Lot"
                  className="w-full px-3 py-2 text-xs border border-zinc-300 rounded bg-zinc-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase text-zinc-700 mb-1">
                    Pack Size / Packaging *
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.packSize}
                    onChange={(e) => setProductForm({ ...productForm, packSize: e.target.value })}
                    placeholder="e.g. 24 Bottles / Carton (200ml)"
                    className="w-full px-3 py-2 text-xs font-mono border border-zinc-300 rounded bg-zinc-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase text-zinc-700 mb-1">
                    MOQ Specification
                  </label>
                  <input
                    type="text"
                    value={productForm.moq}
                    onChange={(e) => setProductForm({ ...productForm, moq: e.target.value })}
                    placeholder="e.g. 24 Units / Master Carton"
                    className="w-full px-3 py-2 text-xs font-mono border border-zinc-300 rounded bg-zinc-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold uppercase text-zinc-700 mb-1">
                  Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 text-xs font-mono border border-zinc-300 rounded bg-zinc-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
                />

                {/* Preset Image Chooser */}
                <div className="mt-2">
                  <span className="text-[10px] font-mono text-zinc-500 block mb-1">
                    Or select standard cosmetic stock image:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_IMAGES.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setProductForm({ ...productForm, image: preset.url })}
                        className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${
                          productForm.image === preset.url
                            ? 'bg-zinc-900 text-white border-zinc-900 font-bold'
                            : 'bg-zinc-100 text-zinc-700 border-zinc-200 hover:bg-zinc-200'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase text-zinc-700 mb-1">
                    Target Retail Margin
                  </label>
                  <input
                    type="text"
                    value={productForm.estimatedMargin}
                    onChange={(e) => setProductForm({ ...productForm, estimatedMargin: e.target.value })}
                    placeholder="e.g. 40% – 52%"
                    className="w-full px-3 py-2 text-xs font-mono border border-zinc-300 rounded bg-zinc-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-5 py-2 text-xs font-bold bg-zinc-900 text-white rounded hover:bg-zinc-800 transition-colors uppercase tracking-wider"
                >
                  {formSubmitting ? 'Saving...' : 'Add to Catalog'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}

