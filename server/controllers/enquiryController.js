const Enquiry = require('../models/Enquiry');

// In-memory fallback storage if MongoDB is disconnected
const inMemoryEnquiries = [];

// @desc    Register a B2B wholesale cart enquiry
// @route   POST /api/enquiries (and /api/inquiries)
// @access  Public
exports.createEnquiry = async (req, res) => {
  try {
    const {
      buyerName,
      businessName,
      businessType,
      items,
      notes,
    } = req.body;
    const rawPhone = req.body.phoneNumber || req.body.phone;

    // 1. Validate Buyer Details
    if (!buyerName || !businessName || !rawPhone) {
      return res.status(400).json({
        success: false,
        message: 'Contact Name, Business/Shop Name, and Phone Number are required.',
      });
    }

    const cleanPhone = String(rawPhone).replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 10-digit phone/WhatsApp number.',
      });
    }

    // 2. Validate Cart Items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Enquiry cart is empty. Please select at least one item.',
      });
    }

    // Validate quantities: strictly 1 to 25 units per product
    const validatedItems = [];
    for (const item of items) {
      const qtyNum = parseInt(item.qty || item.quantity, 10);
      if (isNaN(qtyNum) || qtyNum < 1) {
        return res.status(400).json({
          success: false,
          message: `Invalid quantity for ${item.name || item.sku}. Minimum quantity is 1 unit.`,
        });
      }
      if (qtyNum > 25) {
        return res.status(400).json({
          success: false,
          message: `Maximum allowed quantity per product is 25 units for item "${item.name || item.sku}". For larger bulk container orders, please contact trade desk directly.`,
        });
      }

      validatedItems.push({
        productId: String(item.productId || item.id || ''),
        sku: String(item.sku || 'SKU-NA').toUpperCase().trim(),
        name: String(item.name || 'Wholesale Product').trim(),
        qty: qtyNum,
        category: String(item.category || ''),
        packSize: String(item.packSize || ''),
      });
    }

    const totalUnits = validatedItems.reduce((acc, curr) => acc + curr.qty, 0);

    const enquiryDoc = {
      buyerName: buyerName.trim(),
      businessName: businessName.trim(),
      phoneNumber: cleanPhone,
      businessType: businessType || 'Cosmetics Retail Store',
      items: validatedItems,
      totalItems: validatedItems.length,
      totalUnits,
      notes: notes ? String(notes).trim() : '',
      status: 'New',
      createdAt: new Date(),
    };

    let savedEnquiry = null;
    try {
      savedEnquiry = await Enquiry.create(enquiryDoc);
    } catch (dbErr) {
      console.warn('[Enquiry Controller] MongoDB save warning, caching in-memory:', dbErr.message);
      enquiryDoc._id = `enq-${Date.now()}`;
      inMemoryEnquiries.push(enquiryDoc);
      savedEnquiry = enquiryDoc;
    }

    // 3. Format WhatsApp Deep Link Message
    // Itemized table representation for WhatsApp readability
    let itemListText = '';
    validatedItems.forEach((it, index) => {
      itemListText += `${index + 1}. [${it.sku}] ${it.name} — *${it.qty} Unit${it.qty > 1 ? 's' : ''}*${it.packSize ? ` (${it.packSize})` : ''}\n`;
    });

    const formattedWaMessage = 
`*B.N ENTERPRISES — WHOLESALE CART ENQUIRY*
──────────────────────────────
• *Contact Name:* ${savedEnquiry.buyerName}
• *Business / Shop:* ${savedEnquiry.businessName}
• *Phone Number:* ${savedEnquiry.phoneNumber}
• *Business Type:* ${savedEnquiry.businessType}
• *Total Products:* ${savedEnquiry.totalItems} lines (${savedEnquiry.totalUnits} total units)
──────────────────────────────
*ITEMIZED CART ORDER LIST (Max 25 units/item):*
${itemListText.trim()}
──────────────────────────────
• *Buyer Notes:* ${savedEnquiry.notes || 'Please share formal wholesale invoice, batch dates & dispatch timeline.'}
──────────────────────────────
_Submitted via B.N Enterprises Official B2B Wholesale Portal_`;

    const waLink = `https://wa.me/918527606769?text=${encodeURIComponent(formattedWaMessage)}`;

    res.status(201).json({
      success: true,
      message: 'Wholesale enquiry submitted successfully.',
      enquiryId: savedEnquiry._id,
      totalItems: savedEnquiry.totalItems,
      totalUnits: savedEnquiry.totalUnits,
      data: savedEnquiry,
      whatsappUrl: waLink,
    });
  } catch (error) {
    console.error('[Enquiry Controller Error]', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process wholesale enquiry',
      error: error.message,
    });
  }
};

// @desc    Retrieve all wholesale enquiries
// @route   GET /api/enquiries (and /api/inquiries)
// @access  Public / Trade Desk
exports.getEnquiries = async (req, res) => {
  try {
    let list = [];
    try {
      list = await Enquiry.find().sort({ createdAt: -1 });
    } catch {
      list = inMemoryEnquiries;
    }

    res.status(200).json({
      success: true,
      count: list.length,
      data: list,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
