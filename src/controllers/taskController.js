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

// POST /api/tasks
exports.createTask = async (req, res) => {
    try {
        const { title, description, status, priority, dueDate } = req.body;
        const task = new Task({
            title,
            description,
            status,
            priority,
            dueDate,
            owner: req.user.id
        });
        await task.save();
        res.status(201).json(task);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao criar tarefa', error: err.message });
    }
};

// PUT /api/tasks/:id
exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) return res.status(404).json({ message: 'Tarefa não encontrada' });
        
        if (!task.owner.equals(req.user.id) && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Acesso negado' });
        }
        
        Object.assign(task, req.body);
        await task.save();

        res.json(task);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao atualizar tarefa', error: err.message });
    }
};

// DELETE /api/tasks/:id
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) return res.status(404).json({ message: 'Tarefa não encontrada' });

        if (task.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Acesso negado' });
        }

        await task.deleteOne();
        res.json({ message: 'Tarefa excluída com sucesso' });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao excluir tarefa', error: err.message });
    }
};
