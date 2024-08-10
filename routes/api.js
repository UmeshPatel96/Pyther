const express = require('express');
const router = express.Router();
const customermongo = require('../service/customer-mongo');
const { validate, addValidator, updateValidator } = require('../middleware/useValidators');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const requireRole = require('../middleware/roleMiddleware');

// Multer setup for file upload
const upload = multer({ dest: 'uploads/' });

// CRUD Routes
router.get('/:id', authMiddleware, requireRole('admin'), async (req, res, next) => {
    const customer = await customermongo.getCustomersById(req.params.id);
    res.send(customer);
});

router.post('/', authMiddleware, requireRole('admin'), addValidator, validate, async (req, res, next) => {
    const customer = await customermongo.addCustomer(req.body);
    res.send(customer);
});

router.put('/:id', authMiddleware, requireRole('admin'),  updateValidator, validate, async (req, res, next) => {
    const customer = await customermongo.updateCustomer(req.params.id, req.body);
    res.send(customer);
});

router.delete('/:id', authMiddleware, requireRole('admin'), async (req, res, next) => {
    const customer = await customermongo.deleteCustomer(req.params.id);
    res.send(customer);
});

router.get('/', authMiddleware, requireRole('user'), async (req, res, next) => {
    const text = req.headers.text || '';
    const field = req.headers.field || 'name';
    const order = req.headers.order || 'normal';
    const page = req.headers.page || 1;
    const limit = req.headers.limit || 2;
    const customer = await customermongo.searchAndSortCustomers(text, field, order, page, limit);
    res.send(customer);
});



// Import Routes
// router.post('/import-csv', authMiddleware, upload.single('file'), async (req, res) => {
//     const result = await customermongo.importCSV(req.file.path);
//     fs.unlinkSync(req.file.path); // Delete file after processing
//     res.send(result);
// });

// router.post('/import-excel', authMiddleware, upload.single('file'), async (req, res) => {
//     const result = await customermongo.importExcel(req.file.path);
//     fs.unlinkSync(req.file.path); // Delete file after processing
//     res.send(result);
// });

// // Export Routes
// router.get('/export-csv', authMiddleware, async (req, res) => {
//     const result = await customermongo.exportCSV();
//     if (result.result === "success") {
//         res.header('Content-Type', 'text/csv');
//         res.attachment(result.filename);
//         res.send(result.data);
//     } else {
//         res.status(500).send(result);
//     }
// });

// router.get('/export-excel', authMiddleware, async (req, res) => {
//     const result = await customermongo.exportExcel();
//     if (result.result === "success") {
//         res.download(result.filename, () => fs.unlinkSync(result.filename)); // Delete file after download
//     } else {
//         res.status(500).send(result);
//     }
// });

module.exports = router;
