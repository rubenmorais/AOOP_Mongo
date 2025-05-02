import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import MovieDetails from '../components/MovieDetails';

const MoviePage = () => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  
  useEffect(() => {
    const fetchMovieDetails = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/movies/${id}`);
        setMovie(response.data);
      } catch (err) {
        console.error('Erro ao buscar detalhes do filme:', err);
        if (err.response && err.response.status === 404) {
          setError('Filme não encontrado');
        } else {
          setError('Falha ao carregar os detalhes do filme. Por favor, tente novamente.');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchMovieDetails();
  }, [id]);
  
  if (loading) {
    return (
      <div className="container">
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container">
        <div className="error-container">
          <h1>Ocorreu um erro</h1>
          <p>{error}</p>
          <a href="/" className="error-button">Voltar para a página inicial</a>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container">
      {movie && <MovieDetails movie={movie} />}
    </div>
  );
};

export default MoviePage;