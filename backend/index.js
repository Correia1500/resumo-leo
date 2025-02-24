const express = require('express');
const cors = require('cors');
const axios = require('axios');
const pool = require('./db'); // Importa a conexão com o PostgreSQL
require('dotenv').config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

app.post('/send-message', async (req, res) => {
    try {
        const { userMessage } = req.body;
        
        // Chamar o n8n
        const N8N_WEBHOOK_URL = 'http://n8n:5678/webhook/resumo';
        const response = await axios.post(N8N_WEBHOOK_URL, { message: userMessage });

        const botResponse = response.data.text || 'Sem resposta do n8n';

        // Salvar no banco de dados
        await pool.query(
            'INSERT INTO messages (user_message, bot_response) VALUES ($1, $2)',
            [userMessage, botResponse]
        );

        res.json({ ok: true, botResponse });
    } catch (error) {
        console.error('Erro ao processar mensagem:', error);
        res.status(500).json({ ok: false, error: 'Erro ao processar a mensagem' });
    }
});

// Rota para testar a conexão com Postgres
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() as current_time');
    res.json({ dbTime: result.rows[0].current_time });
  } catch (error) {
    console.error('Erro ao conectar no banco:', error);
    res.status(500).json({ error: 'Falha ao conectar no banco' });
  }
});

app.get('/messages', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT user_message, bot_response FROM messages ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
    res.status(500).json({ error: 'Erro ao buscar mensagens' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend rodando na porta ${PORT}`);
});
