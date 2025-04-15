import Movie from '../models/Movie.js';

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
    
    res.json(movie);
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