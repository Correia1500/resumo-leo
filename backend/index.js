const express = require('express');
const cors = require('cors');
const axios = require('axios');
const pool = require('./db'); // Importa a conexão com o Postgres
require('dotenv').config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Rota de teste
app.post('/send-message', async (req, res) => {
    try {
        // 1) Recebe a mensagem do body
        const { userMessage } = req.body;
        // 2) Chama o n8n via Webhook (exemplo de URL)
        //    Você deve criar um "Webhook" node no n8n com path: /webhook/chatbot
        //    Então a URL seria algo como: http://localhost:5678/webhook/chatbot
        const N8N_WEBHOOK_URL = 'http://n8n:5678/webhook/resumo';

        // 3) Envia payload para o n8n
        const response = await axios.post(N8N_WEBHOOK_URL, {
            message: userMessage,
            // Você pode incluir mais dados aqui (ex: userId, context, etc.)
        });
        // 4) Pega a resposta do n8n
        const n8nResponse = response.data;  // Depende do que seu n8n retorna
        // Ex: n8n poderia retornar { response: "...texto do flowise..." }
        res.json({
            ok: true,
            botResponse: n8nResponse.response || 'Sem resposta do n8n'
          });  
    } catch (error) {
        console.error('Erro ao chamar n8n:', error.message);
        res.status(500).json({ ok: false, error: 'Falha ao processar a mensagem' });
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

// Inicia o servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend rodando na porta ${PORT}`);
});
