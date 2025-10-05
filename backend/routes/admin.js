const express = require('express');
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');
const Product = require('../models/Product');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/products/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// @route   GET /api/admin/products
// @desc    Get all products (admin view)
// @access  Private (Admin)
router.get('/products', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const status = req.query.status;
    const category = req.query.category;
    const search = req.query.search;

    // Build filter
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const products = await Product.find(filter)
      .populate('createdBy', 'firstName lastName email')
      .populate('updatedBy', 'firstName lastName email')
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(filter);

    res.json({
      products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      message: 'Failed to get products',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   POST /api/admin/products
// @desc    Create a new product
// @access  Private (Admin)
router.post('/products', authenticateToken, requireAdmin, upload.array('images', 10), [
  body('name').trim().isLength({ min: 3, max: 200 }).withMessage('Product name must be 3-200 characters'),
  body('description').trim().isLength({ min: 10, max: 2000 }).withMessage('Description must be 10-2000 characters'),
  body('price').isNumeric().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').isIn(['website', 'mobile_app', 'portfolio', 'ecommerce', 'other']).withMessage('Invalid category'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      name,
      description,
      shortDescription,
      price,
      originalPrice,
      category,
      subcategory,
      features,
      specifications,
      tags,
      stock,
      sku,
      weight,
      dimensions,
      seo
    } = req.body;

    // Handle uploaded images
    const images = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file, index) => {
        images.push({
          url: `/uploads/products/${file.filename}`,
          alt: req.body.imageAlts ? req.body.imageAlts[index] : '',
          isPrimary: index === 0
        });
      });
    }

    // Parse JSON fields
    const parsedFeatures = features ? JSON.parse(features) : [];
    const parsedSpecifications = specifications ? JSON.parse(specifications) : {};
    const parsedTags = tags ? JSON.parse(tags) : [];
    const parsedDimensions = dimensions ? JSON.parse(dimensions) : {};
    const parsedSeo = seo ? JSON.parse(seo) : {};

    const product = new Product({
      name,
      description,
      shortDescription,
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      category,
      subcategory,
      images,
      features: parsedFeatures,
      specifications: parsedSpecifications,
      tags: parsedTags,
      stock: stock ? parseInt(stock) : 0,
      sku,
      weight: weight ? parseFloat(weight) : undefined,
      dimensions: parsedDimensions,
      seo: parsedSeo,
      createdBy: req.user._id,
      status: 'draft'
    });

    await product.save();

    const populatedProduct = await Product.findById(product._id)
      .populate('createdBy', 'firstName lastName email');

    res.status(201).json({
      message: 'Product created successfully',
      product: populatedProduct
    });

  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      message: 'Failed to create product',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   PUT /api/admin/products/:id
// @desc    Update a product
// @access  Private (Admin)
router.put('/products/:id', authenticateToken, requireAdmin, upload.array('images', 10), [
  body('name').optional().trim().isLength({ min: 3, max: 200 }).withMessage('Product name must be 3-200 characters'),
  body('description').optional().trim().isLength({ min: 10, max: 2000 }).withMessage('Description must be 10-2000 characters'),
  body('price').optional().isNumeric().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').optional().isIn(['website', 'mobile_app', 'portfolio', 'ecommerce', 'other']).withMessage('Invalid category'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: 'Product not found',
        code: 'PRODUCT_NOT_FOUND'
      });
    }

    const updateData = { ...req.body };
    updateData.updatedBy = req.user._id;

    // Handle new images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file, index) => ({
        url: `/uploads/products/${file.filename}`,
        alt: req.body.imageAlts ? req.body.imageAlts[index] : '',
        isPrimary: false
      }));
      
      // Add new images to existing ones
      updateData.images = [...product.images, ...newImages];
    }

    // Parse JSON fields if provided
    if (updateData.features) {
      updateData.features = JSON.parse(updateData.features);
    }
    if (updateData.specifications) {
      updateData.specifications = JSON.parse(updateData.specifications);
    }
    if (updateData.tags) {
      updateData.tags = JSON.parse(updateData.tags);
    }
    if (updateData.dimensions) {
      updateData.dimensions = JSON.parse(updateData.dimensions);
    }
    if (updateData.seo) {
      updateData.seo = JSON.parse(updateData.seo);
    }

    // Convert numeric fields
    if (updateData.price) updateData.price = parseFloat(updateData.price);
    if (updateData.originalPrice) updateData.originalPrice = parseFloat(updateData.originalPrice);
    if (updateData.stock) updateData.stock = parseInt(updateData.stock);
    if (updateData.weight) updateData.weight = parseFloat(updateData.weight);

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'firstName lastName email')
     .populate('updatedBy', 'firstName lastName email');

    res.json({
      message: 'Product updated successfully',
      product: updatedProduct
    });

  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      message: 'Failed to update product',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   DELETE /api/admin/products/:id
// @desc    Delete a product
// @access  Private (Admin)
router.delete('/products/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: 'Product not found',
        code: 'PRODUCT_NOT_FOUND'
      });
    }

    await Product.findByIdAndDelete(productId);

    res.json({
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      message: 'Failed to delete product',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   PUT /api/admin/products/:id/status
// @desc    Update product status
// @access  Private (Admin)
router.put('/products/:id/status', authenticateToken, requireAdmin, [
  body('status').isIn(['draft', 'active', 'inactive', 'archived']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const productId = req.params.id;
    const { status } = req.body;

    const product = await Product.findByIdAndUpdate(
      productId,
      { status, updatedBy: req.user._id },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        message: 'Product not found',
        code: 'PRODUCT_NOT_FOUND'
      });
    }

    res.json({
      message: 'Product status updated successfully',
      product: {
        id: product._id,
        name: product.name,
        status: product.status
      }
    });

  } catch (error) {
    console.error('Update product status error:', error);
    res.status(500).json({
      message: 'Failed to update product status',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   PUT /api/admin/products/:id/featured
// @desc    Toggle product featured status
// @access  Private (Admin)
router.put('/products/:id/featured', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: 'Product not found',
        code: 'PRODUCT_NOT_FOUND'
      });
    }

    product.isFeatured = !product.isFeatured;
    product.updatedBy = req.user._id;
    await product.save();

    res.json({
      message: `Product ${product.isFeatured ? 'featured' : 'unfeatured'} successfully`,
      product: {
        id: product._id,
        name: product.name,
        isFeatured: product.isFeatured
      }
    });

  } catch (error) {
    console.error('Toggle featured status error:', error);
    res.status(500).json({
      message: 'Failed to toggle featured status',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;
