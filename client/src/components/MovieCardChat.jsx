import React from 'react';
import { Link } from 'react-router-dom';

const MovieCardChat = ({ movie }) => {
  const fallbackImage = '/no-poster.jpg';

  return (
    <Link to={`/movie/${movie._id}`} className="movie-card-chat hover:shadow-md transition p-2 rounded-lg flex gap-3 bg-white">
      <img
        src={movie.poster || fallbackImage}
        alt={movie.title}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = fallbackImage;
        }}
        className="w-16 h-24 object-cover rounded"
      />
      <div className="flex flex-col justify-between text-sm">
        <h4 className="font-semibold">{movie.title}</h4>
        <p className="text-gray-500">{movie.year}</p>
        {movie.rating && !isNaN(movie.rating) && (
        <div className="text-yellow-500 font-medium text-sm">
            ★ {parseFloat(movie.rating).toFixed(1)}
        </div>
        )}
      </div>
    </Link>
  );
};

export default MovieCardChat;