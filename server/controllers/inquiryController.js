const Inquiry = require('../models/Inquiry');

// In-memory fallback storage when MongoDB is disconnected
const inMemoryInquiries = [];

// @desc    Register a B2B wholesale inquiry
// @route   POST /api/inquiries
// @access  Public
exports.createInquiry = async (req, res) => {
  try {
    const {
      buyerName,
      businessName,
      phoneNumber,
      businessType,
      selectedCategories,
      estimatedOrderVolume,
      notes,
    } = req.body;

    // Strict validation
    if (!buyerName || !businessName || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Name, Business/Shop Name, and Phone Number are required fields.',
      });
    }

    const cleanPhone = String(phoneNumber).replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 10-digit phone/WhatsApp number.',
      });
    }

    const categoriesArray = Array.isArray(selectedCategories)
      ? selectedCategories
      : [selectedCategories || 'General Wholesale'];

    const inquiryPayload = {
      buyerName: buyerName.trim(),
      businessName: businessName.trim(),
      phoneNumber: cleanPhone,
      businessType: businessType || 'Cosmetics Retail Store',
      selectedCategories: categoriesArray,
      estimatedOrderVolume: estimatedOrderVolume || '₹25,000 – ₹50,000',
      notes: notes ? notes.trim() : '',
      createdAt: new Date(),
    };

    let savedRecord = null;
    try {
      savedRecord = await Inquiry.create(inquiryPayload);
    } catch {
      inquiryPayload._id = `inq-${Date.now()}`;
      inMemoryInquiries.push(inquiryPayload);
      savedRecord = inquiryPayload;
    }

    // Format professional WhatsApp RFQ message string
    const formattedWaMessage = 
`*B.N ENTERPRISES — WHOLESALE INQUIRY (RFQ)*
──────────────────────────────
• *Contact Name:* ${savedRecord.buyerName}
• *Business / Shop:* ${savedRecord.businessName}
• *Phone Number:* ${savedRecord.phoneNumber}
• *Business Channel:* ${savedRecord.businessType}
• *Required Categories:* ${savedRecord.selectedCategories.join(', ')}
• *Estimated Volume:* ${savedRecord.estimatedOrderVolume}
• *Specific SKUs / Notes:* ${savedRecord.notes || 'Please share latest wholesale rate card & case MOQs.'}
──────────────────────────────
_Sent via B.N Enterprises Official Wholesale Portal_`;

    const waLink = `https://wa.me/918527606769?text=${encodeURIComponent(formattedWaMessage)}`;

    res.status(201).json({
      success: true,
      message: 'Wholesale inquiry registered successfully.',
      inquiryId: savedRecord._id,
      data: savedRecord,
      whatsappUrl: waLink,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to process wholesale inquiry',
      error: error.message,
    });
  }
};

// @desc    Get all wholesale inquiries (Trade desk review)
// @route   GET /api/inquiries
// @access  Public / Internal
exports.getInquiries = async (req, res) => {
  try {
    let list = [];
    try {
      list = await Inquiry.find().sort({ createdAt: -1 });
    } catch {
      list = inMemoryInquiries;
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
