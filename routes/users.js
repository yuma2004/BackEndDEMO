// routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User'); // ユーザーモデルのインポート

// 新規ユーザー登録エンドポイント
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    // 新しいユーザーの作成
    const newUser = new User({ username, password });
    await newUser.save(); // データベースに保存
    res.json({ message: 'ユーザーが登録されました' });
  } catch (error) {
    console.error('ユーザー登録エラー:', error);
    res.status(500).json({ error: 'ユーザーの登録に失敗しました' });
  }
});

module.exports = router;

