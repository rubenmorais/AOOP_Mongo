import mongoose from 'mongoose';

const embeddedMovie = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  plot_embedding: [Number],
});

const EmbeddedMovie = mongoose.model('EmbeddedMovie', embeddedMovie, 'embedded_movies');

export default EmbeddedMovie;
