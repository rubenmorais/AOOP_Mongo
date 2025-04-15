// server/controllers/commentController.js
import Comment from '../models/Comment.js';

// Buscar comentários para um filme específico
export const getMovieComments = async (req, res) => {
  try {
    const { movieId } = req.params;
    
    const comments = await Comment.find({ movieId })
      .sort({ createdAt: -1 });
    
    res.json({ comments });
  } catch (err) {
    console.error('Erro ao buscar comentários:', err);
    res.status(500).json({ error: 'Erro ao buscar comentários' });
  }
};

// Adicionar um comentário a um filme
export const addComment = async (req, res) => {
  try {
    const { movieId } = req.params;
    const { username, content, rating } = req.body;
    
    // Validação básica
    if (!username || !content || !rating) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }
    
    const newComment = new Comment({
      movieId,
      username,
      content,
      rating: Number(rating)
    });
    
    await newComment.save();
    
    res.status(201).json(newComment);
  } catch (err) {
    console.error('Erro ao adicionar comentário:', err);
    res.status(500).json({ error: 'Erro ao adicionar comentário' });
  }
};