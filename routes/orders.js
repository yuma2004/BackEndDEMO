// routes/order.js
const express = require('express');
const router = express.Router();
const Cart = require('../models/cart'); // カートモデル
const Order = require('../models/order'); // 注文モデル
const Product = require('../models/product'); // 商品モデル

// カート内の商品を注文に変換するエンドポイント
router.post('/', async (req, res) => {
  const userId = req.session.userId; // セッションからユーザーIDを取得

  if (!userId) {
    return res.status(401).json({ error: 'ユーザーが認証されていません' });
  }

  try {
    // ユーザーのカートを取得して、商品情報を展開
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'カートが空です' });
    }

    // カート内容を注文に変換
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      quantity: item.quantity
    }));

    // 注文を作成し、Orderスキーマに従って保存
    const order = new Order({
      user: userId,
      products: orderItems,
      orderDate: Date.now(),
      status: 'Pending'
    });
    await order.save();

    // 各商品の在庫を更新
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity }
      });
    }

    // カートを空にする
    await Cart.findOneAndUpdate({ user: userId }, { items: [] });

    // 注文成功のレスポンスを返す
    res.status(201).json({ message: '注文が作成されました', order });
  } catch (error) {
    console.error('注文作成エラー:', error);
    res.status(500).json({ error: 'サーバーエラーです' });
  }
});

// 注文履歴を取得するエンドポイント (GET /api/orders)
router.get('/', async (req, res) => {
  const userId = req.session.userId;

  if (!userId) {
    return res.status(401).json({ error: 'ユーザーが認証されていません' });
  }

  try {
    const orders = await Order.find({ user: userId }).populate('products.product');
    res.json(orders);
  } catch (error) {
    console.error('注文取得エラー:', error);
    res.status(500).json({ error: 'サーバーエラーです' });
  }
});


module.exports = router;
