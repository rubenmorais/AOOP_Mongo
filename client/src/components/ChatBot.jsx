import React, { useState, useRef, useEffect } from 'react';
import MovieCardChat from './MovieCardChat';

const ChatBot = ({ onClose }) => {
    const [messages, setMessages] = useState([
        { 
            from: 'bot',
            text: '🎬 Olá! Sou o teu assistente de filmes. Posso recomendar-te filmes de comédia, drama, ação, terror e muito mais! O que gostarias de ver hoje?',
            movies: []
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showQuickQuestions, setShowQuickQuestions] = useState(true);
    const messagesEndRef = useRef(null);

    const quickQuestions = [
        { text: "Filmes de comédia para rir", emoji: "😄" },
        { text: "Filmes de ação populares", emoji: "⚡" },
        { text: "Dramas para chorar", emoji: "😢" },
        { text: "Filmes de terror", emoji: "👻" },
        { text: "Filmes curtos para o jantar", emoji: "⏰" },
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleQuickQuestion = (questionText) => {
        setShowQuickQuestions(false);
        handleSendMessage(questionText);
    };

    const handleSendMessage = async (messageText) => {
        const userMessage = messageText || input.trim();
        if (!userMessage || isLoading) return;

        setMessages(prev => [...prev, { from: 'user', text: userMessage, movies: [] }]);
        setInput('');
        setIsLoading(true);
        setShowQuickQuestions(false);

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

    const handleSend = () => {
        handleSendMessage();
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
                <span>🎬 Assistente de Filmes</span>
                <button onClick={onClose} className="chat-close-btn" aria-label="Fechar chat">✖</button>
            </div>
            
            <div className="chat-body">
                {messages.map((msg, i) => (
                    <div key={i} className={`chat-message ${msg.from}`}>
                        <div className="message-content">
                           <p style={{whiteSpace: 'pre-line'}}>{msg.text}</p>
                            {msg.movies.length > 0 && (
                                <div className="movies-container">
                                    <div className="movies-count">
                                        {msg.movies.length} filme{msg.movies.length !== 1 ? 's' : ''} encontrado{msg.movies.length !== 1 ? 's' : ''}:
                                    </div>
                                    <div className="movies-list">
                                        {msg.movies.map(movie => (
                                            <MovieCardChat key={movie._id} movie={movie} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {showQuickQuestions && (
                    <div className="quick-questions-container">
                        <div className="quick-questions-title">
                            💡 Sugestões rápidas:
                        </div>
                        <div className="quick-questions-grid">
                            {quickQuestions.map((question, index) => (
                                <button
                                    key={index}
                                    className="quick-question-btn"
                                    onClick={() => handleQuickQuestion(question.text)}
                                    disabled={isLoading}
                                >
                                    <span className="quick-question-emoji">{question.emoji}</span>
                                    <span className="quick-question-text">{question.text}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                
                {isLoading && (
                    <div className="chat-message bot">
                        <div className="message-content">
                            <div className="typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                )}
                
                <div ref={messagesEndRef} />
            </div>
            
            <div className="chat-input-area">
                <input 
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Que tipo de filme procuras?"
                    disabled={isLoading}
                    className={isLoading ? 'input-disabled' : ''}
                />
                <button 
                    onClick={handleSend} 
                    disabled={!input.trim() || isLoading}
                    className={!input.trim() || isLoading ? 'button-disabled' : ''}
                >
                    {isLoading ? '...' : 'Enviar'}
                </button>
            </div>
        </div>
    );
};

export default ChatBot;