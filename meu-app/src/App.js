import React, { useState, useEffect } from 'react';
import './App.css';
function App() {
  const [input, setInput] = useState('');
  const [botResponse, setBotResponse] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMessages = async () => {
    try {
      const res = await fetch('http://localhost:4000/messages');
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error('Erro ao buscar mensagens:', err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleSendMessage = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('http://localhost:4000/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userMessage: input }),
      });

      const data = await res.json();
      setBotResponse(data.botResponse || '');

      // Atualiza histórico
      fetchMessages();
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isLoading && (
        <div className="overlay">
          <div className="loader"></div>
        </div>
      )}
      <h1>Chat com n8n + Flowise</h1>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Digite algo"
      />
      <button 
        onClick={handleSendMessage}
        disabled={isLoading} // Desabilita botão durante loading
      >
        {isLoading ? 'Processando...' : 'Enviar'}
      </button>

      <p>Bot disse: {botResponse}</p>

      <h2>Histórico de Mensagens</h2>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>
            <strong>Você:</strong> {msg.user_message} <br />
            <strong>Bot:</strong> {msg.bot_response}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
