import React, { useState, useRef, useEffect } from 'react';
import MovieCard from './MovieCard';
const ChatBot = ({ onClose }) => {
    const [messages, setMessages] = useState([
        { 
            from: 'bot',
            text: '🎬 Olá! Sou o seu assistente de filmes. Posso recomendar filmes de comédia, drama, ação, terror e muito mais! O que você gostaria de assistir hoje?',
            movies: []
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setMessages(prev => [...prev, { from: 'user', text: userMessage, movies: [] }]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat/message', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: userMessage })
        });

        const data = await response.json();

        setMessages(prev => [...prev, { 
            from: 'bot', 
            text: data.response || 'Desculpa, não consegui processar a tua pergunta.',
            movies: data.movies || []
        }]);

        } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        setMessages(prev => [...prev, { 
            from: 'bot', 
            text: 'Desculpa, ocorreu um erro. Tenta novamente!',
            movies: []
        }]);
        } finally {
        setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
        }
    };

    return (
        <div className="chat-modal">
            <div className="chat-header">
                <span>🎬 Chat</span>
                <button onClick={onClose} className="chat-close-btn">✖</button>
            </div>
            <div className="chat-body" style={{ overflowY: 'auto', maxHeight: '400px' }}>
            {messages.map((msg, i) => (
            <div key={i} className={`chat-message ${msg.from}`}>
                <p>{msg.text}</p>
                {/* Aqui renderiza os filmes se existirem */}
                {msg.movies.length > 0 && (
                <div className="movies-list" style={{ marginTop: '10px' }}>
                    {msg.movies.map(movie => (
                    <MovieCard key={movie._id} movie={movie} />
                    ))}
                </div>
                )}
            </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
        <div className="chat-input-area">
            <input 
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escreva a sua pergunta..."
            />
            <button onClick={handleSend}>Enviar</button>
        </div>
        </div>
    );
};

export default ChatBot;