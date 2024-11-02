const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const authenticateAdmin = require('../middleware/auth'); // 管理者認証ミドルウェア

// 商品一覧取得エンドポイント（認証不要）
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('商品一覧取得エラー:', error);
    res.status(500).json({ error: 'サーバーエラーです' });
  }
});

// 商品詳細取得エンドポイント（認証不要）
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: '商品が見つかりません' });
    }
    res.json(product);
  } catch (error) {
    console.error('商品詳細取得エラー:', error);
    res.status(500).json({ error: 'サーバーエラーです' });
  }
});

// 商品登録エンドポイント（管理者のみ）
router.post('/', authenticateAdmin, async (req, res) => {
  const { name, price, category, description, stock } = req.body;
  try {
    const newProduct = new Product({ name, price, category, description, stock });
    await newProduct.save();
    res.status(201).json({ message: '商品が登録されました。', product: newProduct });
  } catch (error) {
    console.error('商品登録エラーの詳細:', error);
    res.status(500).json({ error: 'サーバーエラーです' });
  }
});

// 商品更新エンドポイント（管理者のみ）
router.put('/:id', authenticateAdmin, async (req, res) => {
  const { name, price } = req.body;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price },
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ error: '商品が見つかりません' });
    }
    res.json({ message: '商品が更新されました。', product: updatedProduct });
  } catch (error) {
    console.error('商品更新エラーの詳細:', error);
    res.status(500).json({ error: 'サーバーエラーです' });
  }
});

// 商品削除エンドポイント（管理者のみ）
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ error: '商品が見つかりません' });
    }
    res.json({ message: '商品が削除されました。', product: deletedProduct });
  } catch (error) {
    console.error('商品削除エラーの詳細:', error);
    res.status(500).json({ error: 'サーバーエラーです' });
  }
});

module.exports = router;
