import React, { useState } from 'react';

function App() {
  
  const [input, setInput] = useState('');
  const [botResponse, setBotResponse] = useState('');

  const handleSendMessage = async () => {
    console.log('Enviando mensagem para o backend:', input);
    try {
      // Se estiver rodando em Docker Compose, dependendo da config de rede, 
      // "http://backend:4000" pode estar correto ou não.
      // Se for local sem Compose, use "http://localhost:4000".
      const res = await fetch('http://localhost:4000/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userMessage: input }),
      });
      console.log('Resposta bruta do backend (res):', res);

      const data = await res.json();
      console.log('Dados JSON recebidos (data):', data);

      setBotResponse(data.botResponse || '');
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
    }
  };

  return (
    <div>
      <h1>Chat com n8n + Flowise</h1>

      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Digite algo"
      />
      <button onClick={handleSendMessage}>Enviar</button>

      <p>Bot disse: {botResponse}</p>
    </div>
  );
}

export default App;
