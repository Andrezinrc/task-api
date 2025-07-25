const Task = require('../models/Task');

// GET /api/tasks
exports.getTasks = async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { owner: req.user.id };
    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar tarefas', error: err.message });
  }
}
