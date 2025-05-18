
import React, { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

const socket: Socket = io(import.meta.env.VITE_APP_BACK_URL, {
  transports: ['websocket'],
}); // Cambia al host correcto si es necesario

const App: React.FC = () => {
  const [messages, setMessages] = useState<{ message: string }[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    // Escuchar mensajes entrantes
    socket.on('msg', (data: { message: string }) => {
      setMessages(prev => [...prev, data]);
    });

    // Limpieza
    return () => {
      socket.off('msg');
    };
  }, []);

  const sendMessage = () => {
    if (input.trim() !== '') {
      socket.emit('msg', { message: input });
      setMessages(prev => [...prev, { message: `Tú: ${input}` }]);
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div style={styles.container}>
      <h2 style={{ color: '#000' }}>🟢 Chat en Tiempo Real</h2>
      <div style={styles.chatBox}>
        {messages.map((msg, i) => (
          <div key={i} style={styles.message}>
            {msg.message}
          </div>
        ))}
      </div>
      <div style={styles.inputArea}>
        <input
          style={styles.input}
          type="text"
          value={input}
          placeholder="Escribe un mensaje..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button style={styles.button} onClick={sendMessage}>Enviar</button>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '500px',
    margin: '50px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f9f9f9',
  },
  chatBox: {
    minHeight: '300px',
    maxHeight: '300px',
    overflowY: 'auto',
    border: '1px solid #ddd',
    padding: '10px',
    marginBottom: '10px',
    backgroundColor: '#fff',
    color: '#333',
  },
  message: {
    padding: '5px 10px',
    margin: '5px 0',
    backgroundColor: '#e1f5fe',
    borderRadius: '5px',
  },
  inputArea: {
    display: 'flex',
    gap: '10px',
  },
  input: {
    flex: 1,
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px 20px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#07524B',
    color: 'white',
    cursor: 'pointer',
  },
};

export default App;
