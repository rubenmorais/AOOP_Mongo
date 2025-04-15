import express from 'express';
import { getAllMovies, getMovieDetails, searchMovies } from '../controllers/movieController.js';
import { getMovieComments, addComment } from '../controllers/commentController.js';

const router = express.Router();

router.get('/movies', getAllMovies);
router.get('/movies/search', searchMovies);
router.get('/movies/:id', getMovieDetails);

router.get('/movies/:movieId/comments', getMovieComments);
router.post('/movies/:movieId/comments', addComment);

export default router;