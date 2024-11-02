// models/order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // ユーザーID（Userモデルと参照関係）
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // 商品ID
      quantity: { type: Number, required: true } // 数量
    }
  ],
  orderDate: { type: Date, default: Date.now }, // 注文日
  status: { type: String, default: 'Pending' }  // ステータス（デフォルトは"Pending"）
});

module.exports = mongoose.model('Order', orderSchema);