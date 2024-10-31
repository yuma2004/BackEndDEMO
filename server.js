const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = 3000;

// MongoDB の接続設定
const mongoURI = 'mongodb+srv://yuuyakun0302:KoHePFGPt5YnolhZ@test.oefn6.mongodb.net/?retryWrites=true&w=majority&appName=test';

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB に接続されました'))
  .catch(err => console.error('MongoDB 接続エラー:', err));

// ミドルウェアの設定
app.use(cors()); // CORS を有効にする
app.use(express.json()); // JSON リクエストの解析

// テスト用のルート
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/html/login.html');
  });
app.use(express.static('/html')); // 静的ファイルの提供

// register.htmlを表示するルート
app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/html/register.html');
});

// ルーティングファイルのインポート
const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');
const cartRouter = require('./routes/cart');
const ordersRouter = require('./routes/orders');

// ルートの設定
app.use('/api/users', usersRouter);
app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', ordersRouter);

// サーバーの起動
app.listen(PORT, () => {
  console.log(`サーバーがポート ${PORT} で稼働中`);
});
