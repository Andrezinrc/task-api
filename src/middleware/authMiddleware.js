const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verifica o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Busca o usuário no banco
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Usuário inválido' });
    }

    // Anexa o usuário à requisição
    req.user = {
      id: user._id,
      role: user.role,
      name: user.name
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido ou expirado' });
  }
};

module.exports = authMiddleware;
