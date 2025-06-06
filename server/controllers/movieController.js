import Movie from '../models/Movie.js';
import EmbeddedMovie from '../models/EmbeddedMovie.js';

export const getAllMovies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const movies = await Movie.find({})
      .sort({ year: -1 })
      .skip(skip)
      .limit(limit)
      .select('title year poster genres imdb.rating');
    
    const total = await Movie.countDocuments();
    
    res.json({
      movies,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (err) {
    console.error('Erro ao buscar filmes:', err);
    res.status(500).json({ error: 'Erro ao buscar filmes' });
  }
};

export const getMovieDetails = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({ error: 'Filme não encontrado' });
    }

    const embedded = await EmbeddedMovie.findById(movie._id);
    if (!embedded || !embedded.plot_embedding) {
      return res.json({ movie, recommendations: [] });
    }


    const currentEmbedding = embedded.plot_embedding;

    const similar = await EmbeddedMovie.aggregate([
      {
        $search: {
          index: 'plot_vector_index',
          knnBeta: {
            vector: currentEmbedding,
            path: 'plot_embedding',
            k: 6
          }
        }
      },
      {
        $match: {
          movieId: { $ne: movie._id }
        }
      },
      {
        $limit: 5
      }
    ]);

    const similarMovieIds = similar.map(doc => doc._id);

    const recommendedMovies = await Movie.find({
      _id: { $in: similarMovieIds }
    }).select('title year poster genres imdb.rating');

    res.json({ movie, recommendations: recommendedMovies });
  } catch (err) {
    console.error('Erro ao buscar detalhes do filme:', err);
    res.status(500).json({ error: 'Erro ao buscar detalhes do filme' });
  }
};

export const searchMovies = async (req, res) => {
  try {
    const searchTerm = req.query.title;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    if (!searchTerm) {
      return res.status(400).json({ error: 'Termo de pesquisa é obrigatório' });
    }
    
    const searchRegex = new RegExp(searchTerm, 'i');
    
    const movies = await Movie.find({ title: searchRegex })
      .sort({ year: -1 })
      .skip(skip)
      .limit(limit)
      .select('title year poster genres imdb.rating');
    
    const total = await Movie.countDocuments({ title: searchRegex });
    
    res.json({
      movies,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (err) {
    console.error('Erro na pesquisa de filmes:', err);
    res.status(500).json({ error: 'Erro ao pesquisar filmes' });
  }
};