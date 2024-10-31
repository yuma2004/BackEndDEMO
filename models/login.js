// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// ユーザースキーマの定義
const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true // 前後の空白を削除
  },
  password: { 
    type: String, 
    required: true 
  }
});

// パスワードのハッシュ化ミドルウェア
userSchema.pre('save', async function(next) {
  try {
    // パスワードが変更された場合のみハッシュ化
    if (!this.isModified('password')) {
      return next();
    }
    // ソルトの生成とパスワードのハッシュ化
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// パスワードの検証メソッド
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// モデルのエクスポート
module.exports = mongoose.model('User', userSchema);
