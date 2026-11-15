const express = require('express');
const router = express.Router();

const {
  getCatalog,
  getProductById,
  seedCatalog,
  createProduct,
  deleteProduct,
} = require('../controllers/catalogController');

const {
  createEnquiry,
  getEnquiries,
} = require('../controllers/enquiryController');

// 1. Health Status
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    company: 'B.N Enterprises',
    division: 'Wholesale Cosmetic Trade Desk',
    helpline: '8527606769',
    timestamp: new Date().toISOString(),
  });
});

// 2. Catalog & Inventory Routes
router.get('/catalog', getCatalog);
router.post('/catalog', createProduct);
router.get('/catalog/:idOrSku', getProductById);
router.delete('/catalog/:id', deleteProduct);
router.post('/catalog/seed', seedCatalog);

// 3. Wholesale Cart Enquiries (supports both /enquiries and /inquiries)
router.post('/enquiries', createEnquiry);
router.get('/enquiries', getEnquiries);

router.post('/inquiries', createEnquiry);
router.get('/inquiries', getEnquiries);

module.exports = router;
