const express = require('express');
const router = express.Router();

// カートに商品を追加
router.post('/add', (req, res) => {
  res.send('カートに商品を追加するエンドポイント');
});

// カートの内容を取得
router.get('/', (req, res) => {
  res.send('カートの内容を取得するエンドポイント');
});

module.exports = router;
