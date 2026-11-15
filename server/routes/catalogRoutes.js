const express = require('express');
const router = express.Router();
const { getCatalog, getProductById } = require('../controllers/catalogController');

router.get('/', getCatalog);
router.get('/:idOrSku', getProductById);

module.exports = router;

