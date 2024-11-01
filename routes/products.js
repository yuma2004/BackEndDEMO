// routes/products.js
const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// 商品一覧取得ルート
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('商品一覧取得エラー:', error); // エラーログの追加
    res.status(500).json({ error: 'サーバーエラーです。' });
  }
});

// 商品詳細取得ルート
router.get('/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: '商品が見つかりません。' });
    }
    res.json(product);
  } catch (error) {
    console.error('商品詳細取得エラー:', error);
    res.status(500).json({ error: 'サーバーエラーです。' });
  }
});

module.exports = router;
