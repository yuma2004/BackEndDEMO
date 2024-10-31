const express = require('express');
const router = express.Router();

// ユーザー登録
router.post('/register', (req, res) => {
  res.send('ユーザー登録エンドポイント');
});

// ユーザーログイン
router.post('/login', (req, res) => {
  res.send('ユーザーログインエンドポイント');
});

module.exports = router;
