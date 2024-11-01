// routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User.js'); // ユーザーモデルのインポート
const jwt = require('jsonwebtoken');
// const dotenv = require('dotenv'); // server.js で dotenv.config() を呼び出しているため不要

// 環境変数の設定は server.js で既に行われているため不要

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
  const { username, password } = req.body;

  console.log('JWT_SECRET:', process.env.JWT_SECRET);
  
  try {
    // ユーザーの存在確認
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: 'ユーザー名またはパスワードが正しくありません。' });
    }

    // パスワードの検証
    if (typeof user.comparePassword !== 'function') {
      console.error('comparePassword メソッドが定義されていません。');
      return res.status(500).json({ error: '内部サーバーエラー' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'ユーザー名またはパスワードが正しくありません。' });
    }

    // JWTの生成
    const payload = { userId: user._id, username: user.username };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log("生成されたトークン:", token); // トークンが生成されたことを確認

    // 成功レスポンスの送信
    res.json({ message: 'ログインに成功しました。', token });
  } catch (error) {
    console.error('ログインエラー:', error);
    res.status(500).json({ error: 'ログイン処理中にエラーが発生しました。' });
  }
});

module.exports = router;
