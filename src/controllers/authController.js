const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Gera um token JWT
function generateToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
}

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Verifica se já existe o usuário
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email já registrado' });
    }

    // Cria novo usuário
    const user = new User({ name, email, password });
    await user.save();

    // Gera token e responde
    const token = generateToken(user);
    res.status(201).json({
      message: 'Usuário registrado com sucesso',
      token
    });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao registrar', error: err.message });
  }
}
