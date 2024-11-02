// routes/cart.js
const express = require('express');
const router = express.Router();
const Cart = require('../models/cart'); // カートモデルをインポート
const Product = require('../models/product'); // 商品モデル

// カートに商品を追加するエンドポイント (POST)
router.post('/', async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.session.userId; // セッションからユーザーIDを取得

  if (!userId) {
    return res.status(401).json({ error: 'ユーザーが認証されていません' });
  }

  try {
    // 既存のカートアイテムをチェック
    let cart = await Cart.findOne({ user: userId });
    if (cart) {
      // カートに同じ商品があるか確認
      const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
      if (itemIndex > -1) {
        // 既存の商品がある場合、数量を更新
        cart.items[itemIndex].quantity += quantity;
      } else {
        // 新しい商品を追加
        cart.items.push({ product: productId, quantity });
      }
    } else {
      // 新しいカートを作成
      cart = new Cart({
        user: userId,
        items: [{ product: productId, quantity }]
      });
    }

    await cart.save();
    res.json({ message: '商品がカートに追加されました' });
  } catch (error) {
    console.error('カート追加エラー:', error);
    res.status(500).json({ error: 'サーバーエラーです' });
  }
});

// カートを取得するエンドポイント (GET)
router.get('/', async (req, res) => {
  const userId = req.session.userId;

  if (!userId) {
    return res.status(401).json({ error: 'ユーザーが認証されていません' });
  }

  try {
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart) {
      return res.json({ items: [] }); // 空のカート
    }
    res.json(cart);
  } catch (error) {
    console.error('カート取得エラー:', error);
    res.status(500).json({ error: 'サーバーエラーです' });
  }
});

module.exports = router;
