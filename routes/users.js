// routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User.js'); // ユーザーモデルのインポート
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// 環境変数の設定
dotenv.config();

/**
 * 新規ユーザー登録エンドポイント
 */
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  console.log(`新規登録ユーザー: ${username}`);
  
  try {
    // 既存ユーザーの確認
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'このユーザー名は既に使用されています。' });
    }

    // 新しいユーザーの作成
    const newUser = new User({ username, password });
    await newUser.save(); // データベースに保存
    res.status(201).json({ message: 'ユーザーが登録されました' });
  } catch (error) {
    console.error('ユーザー登録エラー:', error);
    res.status(500).json({ error: 'ユーザーの登録に失敗しました' });
  }
});

module.exports = router;
