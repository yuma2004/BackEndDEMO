const jwt = require('jsonwebtoken');

const authenticateAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: '認証トークンがありません' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.isAdmin) {
      return res.status(403).json({ error: '管理者権限がありません' });
    }
    req.user = decoded; // デコードしたユーザーデータをリクエストに追加
    next();
  } catch (error) {
    res.status(403).json({ error: 'トークンが無効です' });
  }
};

module.exports = authenticateAdmin;
