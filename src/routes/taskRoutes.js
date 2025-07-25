const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// GET /api/tasks → lista tarefas do usuário
router.get('/', taskController.getTasks);
