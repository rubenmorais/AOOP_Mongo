import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  const fallbackImage = '/no-poster.jpg';
  
  return (
    <Link to={`/movie/${movie._id}`} className="movie-card">
      <div className="movie-image">
        <img 
          src={movie.poster || fallbackImage} 
          alt={movie.title}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = fallbackImage;
          }}
        />
      </div>
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <p className="movie-year">{movie.year}</p>
        
        {movie.genres && movie.genres.length > 0 && (
          <div className="movie-genres">
            {movie.genres.slice(0, 2).map((genre, index) => (
              <span key={index} className="movie-genre">{genre}</span>
            ))}
          </div>
        )}
        
        {movie.imdb && movie.imdb.rating && (
          <div className="movie-rating">
            <span className="rating-star">★</span>
            <span>{movie.imdb.rating.toFixed(1)}</span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default MovieCard;