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

module.exports = router;
