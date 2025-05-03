import Comment from '../models/Comment.js';  
import mongoose from 'mongoose';


export const getMovieComments = async (req, res) => {
  try {
    const { movieId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(movieId)) {
      return res.status(400).json({ error: 'ID de filme inválido' });
    }

    const comments = await Comment.find({ movie_id: movieId }).sort({ date: -1 });
   
    res.json({ comments });
  } catch (err) {
    console.error('Erro ao buscar comentários:', err);
    res.status(500).json({ error: 'Falha ao buscar comentários' });
  }
};

export const addComment = async (req, res) => {
  try {
    const { movieId } = req.params;
    const { username, content, rating } = req.body;
    
    if (!username || !content) {
      return res.status(400).json({ error: 'Nome e texto do comentário são obrigatórios' });
    }
    
    if (!mongoose.Types.ObjectId.isValid(movieId)) {
      return res.status(400).json({ error: 'ID de filme inválido' });
    }
    
    const newComment = new Comment({
      name: username,
      movie_id: movieId,
      text: content,
      date: new Date(),
      rating: Number(rating) || 5,
    });
    
    const savedComment = await newComment.save();
    
    res.status(201).json({
      _id: savedComment._id,
      movieId: savedComment.movie_id,
      username: savedComment.name,
      content: savedComment.text,
      rating: savedComment.rating,
      createdAt: savedComment.date,
    });
    
    console.log(`Novo comentário adicionado para o filme ${movieId}`);
  } catch (err) {
    console.error('Erro ao adicionar comentário:', err);
    res.status(500).json({ error: 'Falha ao adicionar comentário' });
  }
};
export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content, rating } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ error: 'ID de comentário inválido' });
    }
    
    const comment = await Comment.findById(commentId);
    
    if (!comment) {
      return res.status(404).json({ error: 'Comentário não encontrado' });
    }
    
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { text: content, rating: Number(rating) || 5 },
      { new: true }
    );
    
    res.json({
      _id: updatedComment._id,
      movieId: updatedComment.movie_id,
      username: updatedComment.name,
      text: updatedComment.text,
      content: updatedComment.text,
      rating: updatedComment.rating,
      createdAt: updatedComment.date
    });
    
    console.log(`Comentário ${commentId} atualizado`);
  } catch (err) {
    console.error('Erro ao atualizar comentário:', err);
    res.status(500).json({ error: 'Falha ao atualizar comentário' });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ error: 'ID de comentário inválido' });
    }
    
    const comment = await Comment.findById(commentId);
    
    if (!comment) {
      return res.status(404).json({ error: 'Comentário não encontrado' });
    }
    
    await Comment.findByIdAndDelete(commentId);
    
    res.json({ message: 'Comentário excluído com sucesso' });
    
    console.log(`Comentário ${commentId} excluído`);
  } catch (err) {
    console.error('Erro ao apagar comentário:', err);
    res.status(500).json({ error: 'Falha ao apagar comentário' });
  }
};