const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { auth, authorize } = require('../middleware/auth');

router.get('/', categoryController.getCategories);
router.post('/', auth, authorize('admin'), categoryController.createCategory);
router.put('/:id', auth, authorize('admin'), categoryController.updateCategory);
router.delete('/:id', auth, authorize('admin'), categoryController.deleteCategory);

module.exports = router;
