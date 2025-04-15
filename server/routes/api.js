
import express from 'express';
import { getAllMovies, getMovieDetails, searchMovies } from '../controllers/movieController.js';

const router = express.Router();

router.get('/movies', getAllMovies);

router.get('/movies/search', searchMovies);

router.get('/movies/:id', getMovieDetails);

export default router;