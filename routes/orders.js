const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const Product = require('../models/product'); // 在庫チェックに使用
const authenticateUser = require('../middleware/auth'); // 認証用ミドルウェア（仮）

// 注文作成エンドポイント
router.post('/', async (req, res) => {
  const { products } = req.body;

  try {
    // 注文内容の検証と在庫の確認
    const orderItems = await Promise.all(products.map(async item => {
      const product = await Product.findById(item.product);
      if (!product) {
        throw new Error(`商品が見つかりません: ${item.product}`);
      }
      if (product.stock < item.quantity) {
        throw new Error(`在庫が不足しています: ${product.name}`);
      }
      return { product: product._id, quantity: item.quantity };
    }));

    // 注文をデータベースに保存
    const order = new Order({
      user: req.user._id,
      products: orderItems,
      orderDate: Date.now(),
      status: 'Pending'
    });
    await order.save();

    // 在庫を更新
    for (const item of products) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    res.status(201).json({ message: '注文が作成されました', order });
  } catch (error) {
    console.error('注文作成エラー:', error);
    res.status(400).json({ error: error.message });
  }
});

// 特定のユーザーの注文一覧取得エンドポイント
router.get('/user/:userId', authenticateUser, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId }).populate('products.product');
    res.json(orders);
  } catch (error) {
    console.error('注文取得エラー:', error);
    res.status(500).json({ error: 'サーバーエラーです' });
  }
});

// 特定の注文取得エンドポイント
router.get('/:id', authenticateUser, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('products.product');
    if (!order) {
      return res.status(404).json({ error: '注文が見つかりません' });
    }
    res.json(order);
  } catch (error) {
    console.error('注文詳細取得エラー:', error);
    res.status(500).json({ error: 'サーバーエラーです' });
  }
});

// 注文のステータス更新エンドポイント
router.put('/:id', authenticateUser, async (req, res) => {
  const { status } = req.body;
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) {
      return res.status(404).json({ error: '注文が見つかりません' });
    }
    res.json({ message: '注文のステータスが更新されました', order });
  } catch (error) {
    console.error('注文更新エラー:', error);
    res.status(500).json({ error: 'サーバーエラーです' });
  }
});

// 注文削除エンドポイント
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ error: '注文が見つかりません' });
    }
    res.json({ message: '注文が削除されました', order });
  } catch (error) {
    console.error('注文削除エラー:', error);
    res.status(500).json({ error: 'サーバーエラーです' });
  }
});

module.exports = router;
