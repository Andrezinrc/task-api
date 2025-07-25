const axios = require('axios');

const API_URL = 'http://localhost:3000/api';

const user = {
    name: 'andre',
    email: 'andre@email.com',
    password: '123456'
};

const novaTarefa = {
    title: 'Estudar Node.js',
    description: 'Focar em Express e Mongoose',
    status: 'todo',
    priority: 'high',
    dueDate: new Date()
};

async function main() {
    let token = '';
    let taskId = '';

    // REGISTRO
    try {
        await axios.post(`${API_URL}/auth/register`, user);
        console.log('Usuário registrado');
    } catch (err) {
        console.log('Usuário já existe, fazendo login...');
    }

    // LOGIN
    try {
        const res = await axios.post(`${API_URL}/auth/login`, {
            email: user.email,
            password: user.password
        });
        token = res.data.token;
        console.log('Token recebido');
    } catch (err) {
        console.error('Erro ao logar:', err.response?.data || err.message);
        return;
    }

    const authHeaders = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    // CRIAR TAREFA
    try {
        const res = await axios.post(`${API_URL}/tasks`, novaTarefa, authHeaders);
        taskId = res.data._id;
        console.log('Tarefa criada:', res.data);
    } catch (err) {
        console.error('Erro ao criar tarefa:', err.response?.data || err.message);
        return;
    }

    // LISTAR TAREFAS
    try {
        const res = await axios.get(`${API_URL}/tasks`, authHeaders);
        console.log('Lista de tarefas:', res.data);
    } catch (err) {
        console.error('Erro ao listar tarefas:', err.response?.data || err.message);
        return;
    }

    // ATUALIZAR TAREFA
    try {
        const res = await axios.put(`${API_URL}/tasks/${taskId}`, {
            status: 'doing',
            title: 'Estudar Node.js (atualizado)'
        }, authHeaders);
        console.log('Tarefa atualizada:', res.data);
    } catch (err) {
        console.error('Erro ao atualizar tarefa:', err.response?.data || err.message);
        return;
    }

    // DELETAR TAREFA
    try {
        await axios.delete(`${API_URL}/tasks/${taskId}`, authHeaders);
        console.log('Tarefa deletada com sucesso');
    } catch (err) {
        console.error('Erro ao deletar tarefa:', err.response?.data || err.message);
        return;
    }

    // LISTAR TAREFAS FINAL
    try {
        const res = await axios.get(`${API_URL}/tasks`, authHeaders);
        console.log('Tarefas após deletar:', res.data);
    } catch (err) {
        console.error('Erro ao listar tarefas finais:', err.response?.data || err.message);
    }
}

main();
