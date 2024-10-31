const express = require('express');
const router = express.Router();

// 注文を作成
router.post('/create', (req, res) => {
  res.send('注文作成エンドポイント');
});

// 注文履歴を取得
router.get('/', (req, res) => {
  res.send('注文履歴取得エンドポイント');
});

module.exports = router;
