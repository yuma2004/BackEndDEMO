const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const jwt = require('jsonwebtoken');
const authenticateAdmin = require('../middleware/auth'); // 認証ミドルウェアをインポート

// 管理者用の商品登録エンドポイント
router.post('/products', async (req, res) => {
  const { name, price } = req.body;
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ error: '認証トークンがありません。' });

  try {
    // トークンの検証と管理者確認
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    if (!decoded.isAdmin) {
      return res.status(403).json({ error: '管理者権限がありません。' });
    }

    // 商品の登録処理
    const newProduct = new Product({ name, price });
    await newProduct.save();
    res.json({ message: '商品が登録されました。' });
  } catch (error) {
    console.error('商品登録エラーの詳細:', error); // エラー詳細をコンソールに出力
    if (error.name === 'JsonWebTokenError') {
        return res.status(400).json({ error: '無効なトークンです。' });
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: '入力データに誤りがあります。' });
    }
    res.status(500).json({ error: '0サーバーエラーです。' });
  }
});

module.exports = router;

