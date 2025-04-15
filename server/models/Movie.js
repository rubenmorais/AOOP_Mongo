import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title: String,
  year: Number,
  runtime: Number,
  plot: String,
  poster: String,
  genres: [String],
  cast: [String],
  directors: [String],
  rated: String,
  imdb: {
    rating: Number,
    votes: Number,
    id: Number
  },
  countries: [String],
  fullplot: String,
  languages: [String],
  released: Date,
  writers: [String],
  type: String
});

const Movie = mongoose.model('Movie', movieSchema, 'movies');

export default Movie;