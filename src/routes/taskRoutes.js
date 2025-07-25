const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// GET /api/tasks → lista tarefas do usuário
router.get('/', taskController.getTasks);

// POST /api/tasks → cria uma nova tarefa
router.post('/', taskController.createTask);

// PUT /api/tasks/:id → atualiza tarefa (se for dono ou admin)
router.put('/:id', taskController.updateTask);

// DELETE /api/tasks/:id → deleta tarefa (se for dono ou admin)
router.delete('/:id', taskController.deleteTask);

module.exports = router;

