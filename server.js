// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// 環境変数の設定
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB の接続設定
const mongoURI = process.env.MONGODB_URI;

// MongoDB の接続設定
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB に接続されました'))
  .catch(err => {
    console.error('MongoDB 接続エラー:', err);
    process.exit(1); // 接続エラーが発生した場合、プロセスを終了
  });


// ミドルウェアの設定
app.use(cors()); // CORS を有効にする
app.use(express.json()); // JSON リクエストの解析

// テスト用のルート
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/html/login.html');
});

// 静的ファイルの提供
app.use(express.static(__dirname + '/html')); // 正しいパスに修正

// register.htmlを表示するルート
app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/html/register.html');
});

//index.htmlを表示するルート
app.get('/index', (req, res) => {
  res.sendFile(__dirname + '/html/index.html');
});

//cart.htmlを表示するルート
app.get('/cart', (req, res) => {
  res.sendFile(__dirname + '/html/cart.html');
});

//checkout.htmlを表示するルート
app.get('/checkout', (req, res) => {
  res.sendFile(__dirname + '/html/checkout.html');
});

//products.htmlを表示するルート
app.get('/products', (req, res) => {
  res.sendFile(__dirname + '/html/products.html');
});

//admin.htmlを表示するルート
app.get('/admin', (req, res) => {
  res.sendFile(__dirname + '/html/admin.html');
});

// ルーティングファイルのインポート
const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');
const cartRouter = require('./routes/cart');
const ordersRouter = require('./routes/orders');
const adminRouter = require('./routes/admin');

// ルートの設定
app.use('/api/users', usersRouter);
app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/admin', adminRouter);

// サーバーの起動
app.listen(PORT, () => {
  console.log(`サーバーがポート ${PORT} で稼働中`);
});
