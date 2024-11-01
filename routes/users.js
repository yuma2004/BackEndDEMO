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

/**
 * ログインエンドポイント
 */
router.post('/login', async (req, res) => {

  console.log("ログインエンドポイントにリクエストが来ました");
  
  const { username, password } = req.body;

  try {
    // ユーザーの存在確認
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: 'ユーザー名またはパスワードが正しくありません。' });
    }

    // パスワードの検証
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'ユーザー名またはパスワードが正しくありません。' });
    }

    // JWTの生成して管理者フラグをトークンに含める
    const payload = { userId: user._id, username: user.username, isAdmin: user.isAdmin };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // 成功レスポンスの送信
    res.json({ message: 'ログインに成功しました。', token });
  } catch (error) {
    console.error('ログインエラー:', error);
    res.status(500).json({ error: 'ログイン処理中にエラーが発生しました。' });
  }
});

module.exports = router;
