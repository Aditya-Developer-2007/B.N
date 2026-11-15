const mongoose = require('mongoose');
const Product = require('../models/Product');

// 8 Realistic Wholesale Cosmetic Items
const INITIAL_WHOLESALE_ITEMS = [
  {
    name: 'Clinical Hyaluronic & Niacinamide Serums',
    sku: 'BN-SKN-001',
    category: 'skincare',
    categoryLabel: 'Skincare',
    moq: '24 Units / Case',
    packSize: '30ml / 50ml Glass Droppers',
    stockStatus: 'In Stock',
    estimatedMargin: '38% – 48%',
    targetBuyers: ['Pharmacies', 'Derma Clinics', 'Beauty Retail'],
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    description: 'Concentrated clinical actives formulated for retail skincare counters and aesthetic clinic retail shelves.',
  },
  {
    name: 'Barrier Defense SPF 50+ Broad Spectrum',
    sku: 'BN-SKN-002',
    category: 'skincare',
    categoryLabel: 'Skincare',
    moq: '36 Units / Carton',
    packSize: '50g Matte Tube',
    stockStatus: 'In Stock',
    estimatedMargin: '35% – 42%',
    targetBuyers: ['Medical Stores', 'Cosmetic Retailers'],
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80',
    description: 'Ultra-lightweight invisible finish SPF 50+ with high repeat purchase frequency in retail stores.',
  },
  {
    name: 'Soft-Matte Velvet Lip Pigments (18 Shades)',
    sku: 'BN-MKP-101',
    category: 'makeup',
    categoryLabel: 'Color Cosmetics',
    moq: '36 Pcs Display Tray',
    packSize: '5ml Frosted Vial',
    stockStatus: 'In Stock',
    estimatedMargin: '42% – 52%',
    targetBuyers: ['Beauty Boutiques', 'Departmental Stores'],
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    description: 'Long-wear non-drying liquid lipsticks in counter-ready display trays curated for Indian skin tones.',
  },
  {
    name: 'HD High-Coverage Liquid Foundation',
    sku: 'BN-MKP-102',
    category: 'makeup',
    categoryLabel: 'Color Cosmetics',
    moq: '24 Assorted Units',
    packSize: '35ml Pump Flacon',
    stockStatus: 'In Stock',
    estimatedMargin: '40% – 50%',
    targetBuyers: ['Salon Bridal Desks', 'Retail Counters'],
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80',
    description: 'Buildable professional grade foundation with 12 undertones designed for studio and everyday retail wear.',
  },
  {
    name: 'Professional Salon Keratin Smoothing Complex',
    sku: 'BN-HAR-201',
    category: 'haircare',
    categoryLabel: 'Hair & Salon',
    moq: '6 Sets (Backbar)',
    packSize: '1,000ml (1 Litre Bottle)',
    stockStatus: 'In Stock',
    estimatedMargin: '35% – 48%',
    targetBuyers: ['Unisex Salons', 'Hair Academies', 'Day Spas'],
    image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80',
    description: 'Professional salon backbar smoothing therapy and clarifying pre-wash systems for high-ticket hair services.',
  },
  {
    name: 'Bond Repair Hair Mask & Moroccan Argan Oil',
    sku: 'BN-HAR-202',
    category: 'haircare',
    categoryLabel: 'Hair & Salon',
    moq: '18 Units Case Lot',
    packSize: '250ml Tub / 100ml Oil',
    stockStatus: 'In Stock',
    estimatedMargin: '38% – 46%',
    targetBuyers: ['Salons', 'Premium Supermarkets'],
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80',
    description: 'Intense reconstructive treatment for chemically treated hair; excellent salon checkout retail margin.',
  },
  {
    name: 'Artisanal Eau de Parfum & Long-Wear Mists',
    sku: 'BN-FRG-301',
    category: 'fragrance',
    categoryLabel: 'Fragrances',
    moq: '12 Bottles Master Pack',
    packSize: '100ml Heavy Glass EDP',
    stockStatus: 'In Stock',
    estimatedMargin: '45% – 58%',
    targetBuyers: ['Gift Boutiques', 'Perfumeries', 'Retail Marts'],
    image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=800&q=80',
    description: 'French essence concentration (18% perfume oil) with magnetic cap packaging for high-ticket gifting.',
  },
  {
    name: 'Botanical Foaming Face Washes & Body Cleansers',
    sku: 'BN-PER-401',
    category: 'personal-care',
    categoryLabel: 'Personal Care',
    moq: '48 Units / Carton',
    packSize: '150ml Foam / 250ml Gel',
    stockStatus: 'In Stock',
    estimatedMargin: '30% – 42%',
    targetBuyers: ['Grocery Stores', 'Pharmacies', 'Supermarkets'],
    image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=800&q=80',
    description: 'High-turnover daily hygiene essentials with rapid re-order frequency and strong FMCG retail pull.',
  },
];

// In-memory fallback if MongoDB is not connected
let inMemoryCatalog = [...INITIAL_WHOLESALE_ITEMS];

/**
 * Built-in Seed Function:
 * Seeds the database if empty, or populates the in-memory fallback.
 */
const seedWholesaleCatalog = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log('[Catalog Controller] Database empty. Seeding 8 wholesale cosmetic items into MongoDB...');
      await Product.insertMany(INITIAL_WHOLESALE_ITEMS);
      console.log('[Catalog Controller] Successfully seeded 8 wholesale items into MongoDB.');
    }
  } catch (err) {
    // If MongoDB is offline, use in-memory seed catalog
    inMemoryCatalog = [...INITIAL_WHOLESALE_ITEMS];
  }
};

// Immediately execute seed check on module load
seedWholesaleCatalog();

// @desc    Get wholesale catalog with optional category filtering
// @route   GET /api/catalog
// @access  Public
exports.getCatalog = async (req, res) => {
  try {
    const { category, search } = req.query;

    // Ensure database has initial items
    await seedWholesaleCatalog();

    let queryFilter = {};

    if (category && category !== 'all') {
      queryFilter.category = category.toLowerCase();
    }

    if (search) {
      queryFilter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    let products = [];
    try {
      products = await Product.find(queryFilter).sort({ createdAt: -1 });
    } catch {
      products = [];
    }

    // Fallback to in-memory if MongoDB returned no records or threw
    if (!products || products.length === 0) {
      let filtered = [...inMemoryCatalog];
      if (category && category !== 'all') {
        const catClean = category.toLowerCase();
        filtered = filtered.filter((p) => p.category === catClean);
      }
      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(s) ||
            p.sku.toLowerCase().includes(s) ||
            p.description.toLowerCase().includes(s)
        );
      }
      products = filtered;
    }

    const categories = [
      { id: 'all', label: 'All Inventory' },
      { id: 'skincare', label: 'Skincare' },
      { id: 'makeup', label: 'Color Cosmetics' },
      { id: 'haircare', label: 'Hair & Salon' },
      { id: 'fragrance', label: 'Fragrances' },
      { id: 'personal-care', label: 'Personal Care' },
    ];

    res.status(200).json({
      success: true,
      count: products.length,
      categories,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve wholesale catalog',
      error: error.message,
    });
  }
};

// @desc    Get single wholesale SKU by ID or SKU
// @route   GET /api/catalog/:idOrSku
// @access  Public
exports.getProductById = async (req, res) => {
  try {
    const { idOrSku } = req.params;
    let product = null;

    try {
      product = await Product.findOne({
        $or: [{ _id: idOrSku }, { sku: idOrSku.toUpperCase() }],
      });
    } catch {
      product = null;
    }

    if (!product) {
      product = inMemoryCatalog.find(
        (p) => p.sku === idOrSku.toUpperCase() || p.id === idOrSku
      );
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product SKU '${idOrSku}' not found in wholesale inventory`,
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Manual re-seed endpoint
// @route   POST /api/catalog/seed
// @access  Public / Admin
exports.seedCatalog = async (req, res) => {
  try {
    await Product.deleteMany({});
    const inserted = await Product.insertMany(INITIAL_WHOLESALE_ITEMS);
    res.status(201).json({
      success: true,
      message: `Successfully re-seeded ${inserted.length} wholesale cosmetic items`,
      data: inserted,
    });
  } catch (error) {
    inMemoryCatalog = [...INITIAL_WHOLESALE_ITEMS];
    res.status(200).json({
      success: true,
      message: 'MongoDB unavailable. In-memory catalog refreshed with 8 wholesale items.',
      data: inMemoryCatalog,
    });
  }
};

// @desc    Add a new wholesale cosmetic product
// @route   POST /api/catalog
// @access  Admin
exports.createProduct = async (req, res) => {
  try {
    const {
      sku,
      name,
      category,
      packSize,
      image,
      moq,
      brandSegment,
      description,
      estimatedMargin,
    } = req.body;

    if (!sku || !name || !category || !packSize || !image) {
      return res.status(400).json({
        success: false,
        message: 'SKU, Product Name, Category, Pack Size, and Image URL are required.',
      });
    }

    const cleanSku = String(sku).toUpperCase().trim();

    // Map category to categoryLabel
    const categoryLabels = {
      skincare: 'Skincare',
      makeup: 'Color Cosmetics',
      haircare: 'Hair & Salon',
      fragrance: 'Fragrances',
      'personal-care': 'Personal Care',
    };
    const catLower = category.toLowerCase().replace(/\s+/g, '-');
    const catLabel = categoryLabels[catLower] || category;

    const newProductData = {
      sku: cleanSku,
      name: name.trim(),
      category: catLower,
      categoryLabel: catLabel,
      packSize: packSize.trim(),
      image: image.trim(),
      moq: moq ? moq.trim() : '1 Case Lot',
      brandSegment: brandSegment ? brandSegment.trim() : 'Wholesale Division',
      description: description
        ? description.trim()
        : 'Authentic manufacturer wholesale cosmetic inventory with verified batch codes.',
      estimatedMargin: estimatedMargin ? estimatedMargin.trim() : '35% – 48%',
      inStock: true,
    };

    let savedProduct = null;
    try {
      const existing = await Product.findOne({ sku: cleanSku });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: `Product with SKU '${cleanSku}' already exists in wholesale inventory.`,
        });
      }
      savedProduct = await Product.create(newProductData);
    } catch (dbErr) {
      console.warn('[Catalog Controller] MongoDB unavailable, adding to in-memory store:', dbErr.message);
      newProductData._id = `prod_${Date.now()}`;
      inMemoryCatalog.unshift(newProductData);
      savedProduct = newProductData;
    }

    res.status(201).json({
      success: true,
      message: 'Product added successfully to wholesale catalog.',
      data: savedProduct,
    });
  } catch (error) {
    console.error('[Create Product Error]', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message,
    });
  }
};

// @desc    Delete a wholesale cosmetic product
// @route   DELETE /api/catalog/:id
// @access  Admin
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let deleted = false;

    try {
      const query = mongoose.Types.ObjectId.isValid(id)
        ? { _id: id }
        : { sku: id.toUpperCase() };

      const resDb = await Product.findOneAndDelete(query);
      if (resDb) deleted = true;
    } catch (dbErr) {
      console.warn('[Catalog Controller] MongoDB delete warning:', dbErr.message);
    }

    // Also remove from in-memory fallback catalog
    const prevLen = inMemoryCatalog.length;
    inMemoryCatalog = inMemoryCatalog.filter(
      (item) => item._id !== id && item.id !== id && item.sku !== id.toUpperCase()
    );
    if (inMemoryCatalog.length < prevLen) deleted = true;

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: `Product '${id}' not found in wholesale inventory.`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Product '${id}' removed successfully from wholesale inventory.`,
    });
  } catch (error) {
    console.error('[Delete Product Error]', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message,
    });
  }
};

// @desc    Auto-seed database if empty on server start
exports.autoSeedIfEmpty = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      const inserted = await Product.insertMany(INITIAL_WHOLESALE_ITEMS);
      console.log(`[Database Auto-Seed] Seeded ${inserted.length} wholesale cosmetic items into MongoDB.`);
    } else {
      console.log(`[Database] Found ${count} wholesale cosmetic items in database.`);
    }
  } catch (err) {
    console.warn('[Database Auto-Seed] Could not auto-seed MongoDB:', err.message);
  }
};
