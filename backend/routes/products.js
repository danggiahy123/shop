const express = require('express');
const Product = require('../models/Product');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/products
// @desc    Get all active products (public)
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const category = req.query.category;
    const search = req.query.search;
    const minPrice = req.query.minPrice;
    const maxPrice = req.query.maxPrice;
    const featured = req.query.featured;
    const hot = req.query.hot;

    // Build filter for active products only
    const filter = { status: 'active' };
    
    if (category) filter.category = category;
    if (featured === 'true') filter.isFeatured = true;
    if (hot === 'true') filter.isHot = true;
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const products = await Product.find(filter)
      .select('-specifications -reviews -createdBy -updatedBy')
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

// @route   GET /api/products/featured
// @desc    Get featured products
// @access  Public
router.get('/featured', optionalAuth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;

    const products = await Product.find({ 
      status: 'active', 
      isFeatured: true 
    })
    .select('-specifications -reviews -createdBy -updatedBy')
    .sort({ createdAt: -1 })
    .limit(limit);

    res.json({
      products
    });

  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      message: 'Failed to get featured products',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/products/hot
// @desc    Get hot products
// @access  Public
router.get('/hot', optionalAuth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;

    const products = await Product.find({ 
      status: 'active', 
      isHot: true 
    })
    .select('-specifications -reviews -createdBy -updatedBy')
    .sort({ createdAt: -1 })
    .limit(limit);

    res.json({
      products
    });

  } catch (error) {
    console.error('Get hot products error:', error);
    res.status(500).json({
      message: 'Failed to get hot products',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/products/categories
// @desc    Get product categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Product.aggregate([
      { $match: { status: 'active' } },
      { $group: { 
        _id: '$category', 
        count: { $sum: 1 },
        subcategories: { $addToSet: '$subcategory' }
      }},
      { $sort: { count: -1 } }
    ]);

    const categoryMap = {
      'website': 'Website',
      'mobile_app': 'Mobile App',
      'portfolio': 'Portfolio',
      'ecommerce': 'E-commerce',
      'other': 'Khác'
    };

    const formattedCategories = categories.map(cat => ({
      id: cat._id,
      name: categoryMap[cat._id] || cat._id,
      count: cat.count,
      subcategories: cat.subcategories.filter(sub => sub)
    }));

    res.json({
      categories: formattedCategories
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      message: 'Failed to get categories',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const productId = req.params.id;
    
    const product = await Product.findOne({ 
      _id: productId, 
      status: 'active' 
    })
    .populate('reviews.user', 'firstName lastName avatar')
    .select('-createdBy -updatedBy');

    if (!product) {
      return res.status(404).json({
        message: 'Product not found',
        code: 'PRODUCT_NOT_FOUND'
      });
    }

    // Get related products
    const relatedProducts = await Product.find({
      _id: { $ne: productId },
      category: product.category,
      status: 'active'
    })
    .select('-specifications -reviews -createdBy -updatedBy')
    .limit(4);

    res.json({
      product,
      relatedProducts
    });

  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      message: 'Failed to get product',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   POST /api/products/:id/reviews
// @desc    Add product review
// @access  Private
router.post('/:id/reviews', optionalAuth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }

    const productId = req.params.id;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        message: 'Rating must be between 1 and 5',
        code: 'INVALID_RATING'
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        message: 'Product not found',
        code: 'PRODUCT_NOT_FOUND'
      });
    }

    // Check if user already reviewed this product
    const existingReview = product.reviews.find(
      review => review.user.toString() === req.user._id.toString()
    );

    if (existingReview) {
      return res.status(400).json({
        message: 'You have already reviewed this product',
        code: 'REVIEW_EXISTS'
      });
    }

    // Add review
    product.reviews.push({
      user: req.user._id,
      rating: parseInt(rating),
      comment: comment || ''
    });

    // Update average rating
    product.updateRating();
    await product.save();

    const updatedProduct = await Product.findById(productId)
      .populate('reviews.user', 'firstName lastName avatar');

    res.status(201).json({
      message: 'Review added successfully',
      product: updatedProduct
    });

  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      message: 'Failed to add review',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/products/search/suggestions
// @desc    Get search suggestions
// @access  Public
router.get('/search/suggestions', async (req, res) => {
  try {
    const query = req.query.q;
    if (!query || query.length < 2) {
      return res.json({ suggestions: [] });
    }

    const suggestions = await Product.find({
      status: 'active',
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } }
      ]
    })
    .select('name tags category')
    .limit(10);

    const formattedSuggestions = suggestions.map(product => ({
      id: product._id,
      name: product.name,
      category: product.category,
      tags: product.tags
    }));

    res.json({
      suggestions: formattedSuggestions
    });

  } catch (error) {
    console.error('Get search suggestions error:', error);
    res.status(500).json({
      message: 'Failed to get search suggestions',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;
