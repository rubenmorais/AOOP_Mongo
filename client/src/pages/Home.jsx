import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import Pagination from '../components/Pagination';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalMovies, setTotalMovies] = useState(0);
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get('search');
  
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let url = `${process.env.API_URL}/api/movies`;
        const params = { page: currentPage };
        
        if (searchTerm) {
          url = `${process.env.API_URL}/api/movies/search`;
          params.title = searchTerm;
        }
        
        const response = await axios.get(url, { params });
        
        setMovies(response.data.movies);
        setTotalPages(response.data.totalPages);
        setTotalMovies(response.data.total);
      } catch (err) {
        console.error('Erro ao buscar filmes:', err);
        setError('Falha ao carregar os filmes. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMovies();
  }, [currentPage, searchTerm]);
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };
  
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
          <h1>Ocoreu um erro</h1>
          <p>{error}</p>
          <button 
            className="error-button"
            onClick={() => window.location.reload()}
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container">
      <h1 style={{ marginBottom: '20px' }}>
        {searchTerm 
          ? `Resultados para: "${searchTerm}" (${totalMovies} filmes encontrados)`
          : 'Catálogo de Filmes'}
      </h1>
      
      {movies.length === 0 ? (
        <div className="error-container">
          <h2>Nenhum filme encontrado</h2>
          {searchTerm && <p>Tente uma pesquisa diferente</p>}
        </div>
      ) : (
        <>
          <div className="movies-grid">
            {movies.map(movie => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
          
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default Home;