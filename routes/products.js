const express = require('express');
const router = express.Router();

// 商品一覧を取得
router.get('/', (req, res) => {
  res.send('商品一覧エンドポイント');
});

// 商品を取得
router.get('/:id', (req, res) => {
  res.send(`商品詳細エンドポイント: ${req.params.id}`);
});

module.exports = router;
