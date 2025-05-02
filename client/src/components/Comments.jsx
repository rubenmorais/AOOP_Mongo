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
  const [editingComment, setEditingComment] = useState(null);
  const [editFormData, setEditFormData] = useState({
    content: '',
    rating: 5
  });

  useEffect(() => {
    fetchComments();
  }, [movieId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/movies/${movieId}/comments`);
      setComments(response.data.comments);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar comentários:', err);
      setError('Falha ao carregar comentários. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewComment({
      ...newComment,
      [name]: value
    });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/movies/${movieId}/comments`, newComment);
      
      setComments((prevComments) => [response.data, ...prevComments]);
      
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

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    if (!editingComment) return;
    
    try {
      setLoading(true);
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/comments/${editingComment._id}`, 
        editFormData
      );
      
      // Update the comments state with the edited comment
      setComments((prevComments) => 
        prevComments.map((comment) => 
          comment._id === editingComment._id 
            ? { 
                ...comment, 
                text: response.data.content, 
                rating: response.data.rating 
              } 
            : comment
        )
      );
      
      setEditingComment(null);
      setEditFormData({ content: '', rating: 5 });
      
      setError(null);
    } catch (err) {
      console.error('Erro ao editar comentário:', err);
      setError('Falha ao editar comentário. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Tem certeza que deseja apagar este comentário?')) {
      return;
    }
    
    try {
      setLoading(true);
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/comments/${commentId}`);
      
      setComments((prevComments) => 
        prevComments.filter((comment) => comment._id !== commentId)
      );
      
      setError(null);
    } catch (err) {
      console.error('Erro ao apagar comentário:', err);
      setError('Falha ao apagar comentário. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (comment) => {
    setEditingComment(comment);
    setEditFormData({
      content: comment.text,
      rating: comment.rating
    });
  };

  const cancelEditing = () => {
    setEditingComment(null);
    setEditFormData({ content: '', rating: 5 });
  };

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

      {/* Formulário para editar comentário */}
      {editingComment && (
        <form className="comment-form edit-form" onSubmit={handleEditSubmit}>
          <h3>Editar Comentário</h3>
          
          <div className="form-group">
            <label htmlFor="edit-rating">Classificação:</label>
            <select
              id="edit-rating"
              name="rating"
              value={editFormData.rating}
              onChange={handleEditInputChange}
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
            <label htmlFor="edit-content">Comentário:</label>
            <textarea
              id="edit-content"
              name="content"
              value={editFormData.content}
              onChange={handleEditInputChange}
              rows="4"
              required
            ></textarea>
          </div>
          
          <div className="edit-buttons">
            <button type="submit" className="comment-button">
              Salvar Alterações
            </button>
            <button 
              type="button" 
              className="comment-button cancel-button"
              onClick={cancelEditing}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

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
                <span className="comment-author">{comment.username || comment.name}</span>
                <span className="comment-date">
                  {new Date(comment.createdAt || comment.date).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <div className="comment-rating">
                {renderStars(comment.rating)}
              </div>
              <p className="comment-content">{comment.content || comment.text}</p>
              
              <div className="comment-actions">
                <button 
                  className="action-button edit-button"
                  onClick={() => startEditing(comment)}
                  disabled={editingComment !== null}
                >
                  Editar
                </button>
                <button 
                  className="action-button delete-button"
                  onClick={() => handleDeleteComment(comment._id)}
                  disabled={editingComment !== null}
                >
                  Excluir
                </button>
              </div>
            </div>
          ))          
        )}
      </div>
    </div>
  );
};

export default Comments;