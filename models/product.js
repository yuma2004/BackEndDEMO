// models/product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },       // 商品名（必須）
  price: { type: Number, required: true },      // 価格（必須）
  stock: { type: Number, default: 0 },          // 在庫数（デフォルト0）
  description: { type: String },                // 説明
  category: { type: String }                    // カテゴリ
});

module.exports = mongoose.model('Product', productSchema); // "Product" モデルをエクスポート
