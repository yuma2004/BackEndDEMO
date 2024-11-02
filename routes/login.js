// routes/login.js
const express = require('express');
const router = express.Router();
const User = require('../models/User.js'); // ユーザーモデルのインポート
const jwt = require('jsonwebtoken');

/**
 * ログインエンドポイント
 */
router.post('/', async (req, res) => {
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
    const payload = { userId: user._id, username: user.username, isAdmin: user.isAdmin };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log("生成されたトークン:", token); // トークンが生成されたことを確認

    // セッションにユーザーIDを保存
    req.session.userId = user._id;

    // 成功レスポンスの送信
    res.json({ message: 'ログインに成功しました。', token });
  } catch (error) {
    console.error('ログインエラー:', error);
    res.status(500).json({ error: 'ログイン処理中にエラーが発生しました。' });
  }
});

module.exports = router;
