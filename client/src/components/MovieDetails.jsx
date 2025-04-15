import React from 'react';
import { Link } from 'react-router-dom';
import Comments from './Comments';

const MovieDetails = ({ movie }) => {
  const fallbackImage = '/no-poster.jpg';
  
  return (
    <div className="movie-details-container">
      <Link to="/" className="back-button">← Voltar para a lista</Link>
      
      <div className="movie-details">
        <div className="movie-poster">
          <img 
            src={movie.poster || fallbackImage} 
            alt={movie.title}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = fallbackImage;
            }}
          />
        </div>
        
        <div className="movie-details-info">
          <h1>
            {movie.title} 
            {movie.year && <span className="year">({movie.year})</span>}
          </h1>
          
          <div className="movie-meta">
            {movie.rated && <span className="movie-rated">{movie.rated}</span>}
            {movie.runtime && <span>{movie.runtime} min</span>}
            {movie.released && (
              <span>
                {new Date(movie.released).toLocaleDateString('pt-BR')}
              </span>
            )}
          </div>
          
          {movie.genres && movie.genres.length > 0 && (
            <div>
              <h2>Gêneros</h2>
              <p>{movie.genres.join(', ')}</p>
            </div>
          )}
          
          {(movie.fullplot || movie.plot) && (
            <div className="movie-plot">
              <h2>Sinopse</h2>
              <p>{movie.fullplot || movie.plot}</p>
            </div>
          )}
          
          {movie.directors && movie.directors.length > 0 && (
            <div>
              <h2>Direção</h2>
              <p>{movie.directors.join(', ')}</p>
            </div>
          )}
          
          {movie.writers && movie.writers.length > 0 && (
            <div>
              <h2>Roteiro</h2>
              <p>{movie.writers.join(', ')}</p>
            </div>
          )}
          
          {movie.cast && movie.cast.length > 0 && (
            <div>
              <h2>Elenco Principal</h2>
              <p>{movie.cast.join(', ')}</p>
            </div>
          )}
          
          {movie.countries && movie.countries.length > 0 && (
            <div>
              <h2>País</h2>
              <p>{movie.countries.join(', ')}</p>
            </div>
          )}
          
          {movie.languages && movie.languages.length > 0 && (
            <div>
              <h2>Idiomas</h2>
              <p>{movie.languages.join(', ')}</p>
            </div>
          )}
          
          {movie.imdb && movie.imdb.rating && (
            <div>
              <h2>IMDB</h2>
              <div className="movie-rating-details">
                <span className="rating-value">{movie.imdb.rating.toFixed(1)}/10</span>
                {movie.imdb.votes && (
                  <span className="rating-votes">
                    ({movie.imdb.votes.toLocaleString()} votos)
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <Comments movieId={movie._id} />
    </div>
  );
};

export default MovieDetails;