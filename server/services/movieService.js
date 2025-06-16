import Movie from '../models/Movie.js';
import EmbeddedMovie from '../models/EmbeddedMovie.js';

export const findReferencedMovie = async (movieTitle) => {
  if (!movieTitle) return null;

  console.log('Procurando filme:', movieTitle);

  // Limpar o título mantendo caracteres especiais importantes
  const cleanTitle = movieTitle
    .replace(/[^\w\s:.-]/g, '') // Remove caracteres especiais exceto : . -
    .trim();
  
  console.log('Título limpo:', cleanTitle);
  
  // Buscar por título exato
  let movie = await Movie.findOne({
    title: { $regex: new RegExp(`^${cleanTitle}$`, 'i') }
  });

  // Se não encontrar, buscar por correspondência parcial
  if (!movie) {
    console.log('Título exato não encontrado, tentando busca parcial...');
    // Dividir o título em palavras para busca mais flexível
    const words = cleanTitle.split(/\s+/);
    const searchTerms = words.filter(word => word.length > 2); // Ignorar palavras muito curtas
    
    if (searchTerms.length > 0) {
      console.log('Termos de busca:', searchTerms);
      const searchQuery = searchTerms.map(term => ({
        title: { $regex: new RegExp(term, 'i') }
      }));
      
      movie = await Movie.findOne({
        $and: searchQuery
      });
    }
  }

  // Validar se o filme encontrado tem os campos necessários
  if (movie) {
    console.log('Filme encontrado:', {
      title: movie.title,
      year: movie.year,
      _id: movie._id
    });

    // Verificar se o filme tem os campos necessários
    if (!movie.title || !movie.year) {
      console.log('Filme encontrado não tem todos os campos necessários');
      return null;
    }
  } else {
    console.log('Nenhum filme encontrado');
  }

  return movie;
};

export const buildMovieQuery = (parsed) => {
  let query = {};
  let sortCriteria = {};

  query.title = { $exists: true, $ne: null };
  query.year = { $exists: true, $type: "number" };

  // Filtrar por mood primeiro (isto é o que estava em falta!)
  if (parsed.mood) {
    switch (parsed.mood) {
      case 'happy':
        // Para rir - comédias e filmes alegres
        query.genres = { $in: ['Comedy', 'Family', 'Animation', 'Musical'] };
        break;
      case 'sad':
        // Para chorar - dramas e filmes emocionais
        query.genres = { $in: ['Drama', 'Romance', 'Biography'] };
        break;
      case 'exciting':
        // Para adrenalina - ação e aventura
        query.genres = { $in: ['Action', 'Adventure', 'Thriller'] };
        break;
      case 'scary':
        // Para medo - terror e suspense
        query.genres = { $in: ['Horror', 'Thriller', 'Mystery'] };
        break;
      case 'philosophical':
        // Para reflexão - dramas e sci-fi
        query.genres = { $in: ['Drama', 'Sci-Fi', 'Mystery', 'Biography'] };
        break;
    }
  }
  // Se não tem mood mas tem géneros específicos, usar os géneros
  else if (parsed.genres.length > 0) {
    query.genres = { $in: parsed.genres };
  }

  // Filtrar por ano ou década
  if (parsed.year) {
    query.year = parsed.year;
  } else if (parsed.decade) {
    query.year = { $gte: parsed.decade, $lte: parsed.decade + 9 };
  } else if (parsed.wantsRecent) {
    query.year = { $gte: 2015 };
  } else if (parsed.wantsClassic) {
    query.year = { $lte: 2005 };
  }

  // Filtrar por duração
  if (parsed.durationPreference === 'short') {
    query.runtime = { $lte: 120 }; // 2 horas ou menos
  } else if (parsed.durationPreference === 'long') {
    query.runtime = { $gte: 150 }; // 2.5 horas ou mais
  }

  // Filtrar por rating - ajustar baseado no mood
  let minRatingFilter = parsed.minRating || 5.5;
  
  // Para mood específicos, queremos garantir qualidade
  if (parsed.mood) {
    minRatingFilter = Math.max(minRatingFilter, 6.0);
  }
  
  if (parsed.wantsPopular) {
    minRatingFilter = Math.max(minRatingFilter, 7.0);
    query['imdb.votes'] = { $gte: 1000 };
  }
  
  query.$or = [
    { 'imdb.rating': { $gte: minRatingFilter } },
    { 'imdb.rating': { $exists: false } }
  ];

  // Definir ordenação
  if (parsed.wantsPopular) {
    sortCriteria = { 'imdb.rating': -1, 'imdb.votes': -1 };
  } else if (parsed.wantsRecent) {
    sortCriteria = { year: -1, 'imdb.rating': -1 };
  } else if (parsed.durationPreference === 'short') {
    sortCriteria = { runtime: 1, 'imdb.rating': -1 };
  } else {
    sortCriteria = { 'imdb.rating': -1, year: -1 };
  }

  return { query, sortCriteria };
};

export const searchMovies = async (parsed) => {
  const { query, sortCriteria } = buildMovieQuery(parsed);

  console.log('Query sendo executada:', JSON.stringify(query, null, 2));

  let movies = await Movie.find(query)
    .sort(sortCriteria)
    .limit(12)
    .select('title year poster genres imdb.rating imdb.votes plot runtime rated')
    .lean();

  // Busca mais flexível se não encontrar resultados
  if (movies.length === 0 && parsed.genres.length > 0) {
    const flexibleQuery = {
      title: { $exists: true },
      genres: { $in: parsed.genres }
    };
    
    movies = await Movie.find(flexibleQuery)
      .sort({ 'imdb.rating': -1 })
      .limit(8)
      .select('title year poster genres imdb.rating imdb.votes plot runtime rated')
      .lean();
  }

  // Busca ainda mais flexível para mood sem géneros específicos
  if (movies.length === 0 && parsed.mood) {
    let fallbackGenres = [];
    switch (parsed.mood) {
      case 'happy':
        fallbackGenres = ['Comedy', 'Family', 'Animation', 'Musical', 'Adventure'];
        break;
      case 'sad':
        fallbackGenres = ['Drama', 'Romance', 'Biography', 'War'];
        break;
      case 'exciting':
        fallbackGenres = ['Action', 'Adventure', 'Thriller', 'Crime'];
        break;
      case 'scary':
        fallbackGenres = ['Horror', 'Thriller', 'Mystery', 'Crime'];
        break;
      case 'philosophical':
        fallbackGenres = ['Drama', 'Sci-Fi', 'Mystery', 'Biography', 'Documentary'];
        break;
    }
    
    const fallbackQuery = {
      title: { $exists: true },
      genres: { $in: fallbackGenres },
      'imdb.rating': { $gte: 5.0 }
    };
    
    movies = await Movie.find(fallbackQuery)
      .sort({ 'imdb.rating': -1 })
      .limit(12)
      .select('title year poster genres imdb.rating imdb.votes plot runtime rated')
      .lean();
  }

  // Fallback geral
  if (movies.length === 0) {
    const fallbackQuery = { title: { $exists: true } };
    
    if (parsed.wantsRecent) fallbackQuery.year = { $gte: 2010 };
    if (parsed.wantsClassic) fallbackQuery.year = { $lte: 2010 };
    
    movies = await Movie.find(fallbackQuery)
      .sort(sortCriteria)
      .limit(6)
      .select('title year poster genres imdb.rating imdb.votes plot runtime rated')
      .lean();
  }

  return movies;
};

export const getEmbeddingBasedRecommendations = async (seedMovie) => {
  const embedded = await EmbeddedMovie.findById(seedMovie._id);
  
  if (!embedded || !embedded.plot_embedding || !Array.isArray(embedded.plot_embedding)) {
    return null;
  }

  try {
    const similarMovies = await EmbeddedMovie.aggregate([
      {
        $search: {
          index: 'plot_vector_index',
          knnBeta: {
            vector: embedded.plot_embedding,
            path: 'plot_embedding',
            k: 25
          }
        }
      },
      {
        $match: {
          _id: { $ne: seedMovie._id }
        }
      },
      {
        $project: {
          _id: 1,
          score: { $meta: "searchScore" }
        }
      },
      { $limit: 20 }
    ]);

    if (similarMovies.length === 0) {
      return null;
    }

    const similarMovieIds = similarMovies.map(doc => doc._id);
    
    const recommendedMovies = await Movie.find({
      _id: { $in: similarMovieIds }
    }).select('title year poster genres imdb.rating imdb.votes plot runtime rated')
      .sort({ 'imdb.rating': -1 })
      .limit(12)
      .lean();

    const filteredMovies = recommendedMovies.filter(movie => 
      movie.imdb?.rating >= 5.0 || !movie.imdb?.rating
    );

    return filteredMovies;

  } catch (searchError) {
    console.error('Erro na busca vetorial:', searchError);
    return null;
  }
};

export const formatMovieForResponse = (movie) => ({
  _id: movie._id,
  title: movie.title,
  year: movie.year,
  poster: movie.poster || '/placeholder-movie.jpg',
  genres: movie.genres || [],
  rating: movie.imdb?.rating || 'N/A',
  votes: movie.imdb?.votes || 0,
  plot: movie.plot ? 
    (movie.plot.length > 150 ? movie.plot.substring(0, 150) + '...' : movie.plot) : 
    'Sem sinopse disponível.',
  runtime: movie.runtime || 'N/A',
  rated: movie.rated || 'N/A'
});

export const formatMoviesForResponse = (movies) => {
  return movies.map(formatMovieForResponse);
};