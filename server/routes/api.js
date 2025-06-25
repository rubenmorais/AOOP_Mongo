import express from 'express';
import { getAllMovies, getMovieDetails, searchMovies } from '../controllers/movieController.js';
import { getMovieComments, addComment, updateComment, deleteComment } from '../controllers/commentController.js';
import { processChatMessage, getEmbeddingBasedRecommendationsHandler } from '../controllers/chatController.js';

const router = express.Router();

router.get('/movies', getAllMovies);
router.get('/movies/search', searchMovies);
router.get('/movies/:id', getMovieDetails);

router.get('/movies/:movieId/comments', getMovieComments);
router.post('/movies/:movieId/comments', addComment);
router.put('/comments/:commentId', updateComment);
router.delete('/comments/:commentId', deleteComment);

router.post('/chat/message', processChatMessage);
router.post('/recommendations', getEmbeddingBasedRecommendationsHandler);
export default router;