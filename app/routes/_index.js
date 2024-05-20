import React, { useState } from 'react';

export function meta() {
    return [
        { title: 'Hydrogen' },
        { description: 'A custom storefront powered by Hydrogen' },
    ];
}

export const loader = async ({context}) => {
  const rag = context.env.RAG_API_URL;
  console.log(rag);
  return
};

export default function Index({context}) {
  const rag = context.env.RAG_API_URL;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages([...messages, userMessage]);
    setInput('');

    try {
      const response = await fetch('http://localhost:8888/llm-query/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: input }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.text();
      const botMessage = { sender: 'bot', text: data };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = { sender: 'bot', text: 'Sorry, something went wrong.' };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
    };
    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Chat with our bot</h1>
      <div
        style={{
          border: '1px solid #ccc',
          padding: '10px',
          borderRadius: '5px',
          marginBottom: '10px',
          height: '300px',
          overflowY: 'scroll',
        }}
      >
        {messages.map((message, index) => (
          <div key={index} style={{ textAlign: message.sender === 'user' ? 'right' : 'left' }}>
            <p
              style={{
                display: 'inline-block',
                padding: '10px',
                borderRadius: '10px',
                backgroundColor: message.sender === 'user' ? '#daf8cb' : '#f1f0f0',
              }}
            >
              {message.text}
            </p>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button onClick={sendMessage} style={{ padding: '10px 20px', marginLeft: '10px' }}>
          Send
        </button>
      </div>
    </div>
    );
}