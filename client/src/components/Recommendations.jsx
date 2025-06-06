import React from 'react';
import MovieCard from './MovieCard'; 
import '../Recommendations.css';

const Recommendations = ({ movies }) => {
  if (!movies || movies.length === 0) return null;

  return (
    <div className="recommendations-container">
      <h2 className="recommendations-title">Recomendações</h2>
      <div className="recommendations-list">
        {movies.map((movie) => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
