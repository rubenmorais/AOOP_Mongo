// client/src/components/Comments.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Comments = ({ movieId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState({
    username: '',
    content: '',
    rating: 5
  });

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/movies/${movieId}/comments`);
        setComments(response.data.comments);
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar comentários:', err);
        setError('Falha ao carregar comentários. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [movieId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewComment({
      ...newComment,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await axios.post(`/api/movies/${movieId}/comments`, newComment);
      
      // Adicionar o novo comentário no topo da lista
      setComments([response.data, ...comments]);
      
      // Limpar o formulário
      setNewComment({
        username: '',
        content: '',
        rating: 5
      });
      
      setError(null);
    } catch (err) {
      console.error('Erro ao adicionar comentário:', err);
      setError('Falha ao adicionar comentário. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Função para exibir estrelas com base na classificação
  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, index) => (
      <span key={index} className={index < rating ? "star filled" : "star"}>
        ★
      </span>
    ));
  };

  return (
    <div className="comments-section">
      <h2>Comentários</h2>

      {/* Formulário para adicionar comentário */}
      <form className="comment-form" onSubmit={handleSubmit}>
        <h3>Adicionar Comentário</h3>
        
        <div className="form-group">
          <label htmlFor="username">Nome:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={newComment.username}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="rating">Classificação:</label>
          <select
            id="rating"
            name="rating"
            value={newComment.rating}
            onChange={handleInputChange}
            required
          >
            <option value="5">5 - Excelente</option>
            <option value="4">4 - Muito Bom</option>
            <option value="3">3 - Bom</option>
            <option value="2">2 - Regular</option>
            <option value="1">1 - Mau</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="content">Comentário:</label>
          <textarea
            id="content"
            name="content"
            value={newComment.content}
            onChange={handleInputChange}
            rows="4"
            required
          ></textarea>
        </div>
        
        <button type="submit" className="comment-button">
          Adicionar Comentário
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {/* Lista de comentários */}
      <div className="comments-list">
        <h3>Comentários</h3>
        
        {loading && comments.length === 0 ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        ) : comments.length === 0 ? (
          <p>Ainda não existem comentários.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="comment">
              <div className="comment-header">
                <span className="comment-author">{comment.username}</span>
                <span className="comment-date">
                  {new Date(comment.createdAt).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <div className="comment-rating">
                {renderStars(comment.rating)}
              </div>
              <p className="comment-content">{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Comments;