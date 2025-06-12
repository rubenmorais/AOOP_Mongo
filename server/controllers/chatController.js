import Movie from '../models/Movie.js';
import EmbeddedMovie from '../models/EmbeddedMovie.js';

const parseUserMessage = (message) => {
  const lowerMessage = message.toLowerCase();
  
  const genreMap = {
    'comédia': 'Comedy', 'comedy': 'Comedy', 'comedia': 'Comedy',
    'drama': 'Drama', 'dramatico': 'Drama', 'dramático': 'Drama',
    'ação': 'Action', 'action': 'Action', 'acção': 'Action', 'acao': 'Action',
    'terror': 'Horror', 'horror': 'Horror', 'medo': 'Horror', 'susto': 'Horror',
    'romance': 'Romance', 'romântico': 'Romance', 'romantico': 'Romance', 'amor': 'Romance',
    'ficção científica': 'Sci-Fi', 'sci-fi': 'Sci-Fi', 'ficção': 'Sci-Fi', 'ficao': 'Sci-Fi',
    'thriller': 'Thriller', 'suspense': 'Thriller', 'tensão': 'Thriller', 'tensao': 'Thriller',
    'aventura': 'Adventure', 'adventure': 'Adventure',
    'animação': 'Animation', 'animation': 'Animation', 'animacao': 'Animation', 'desenho': 'Animation',
    'documentário': 'Documentary', 'documentary': 'Documentary', 'documentario': 'Documentary',
    'família': 'Family', 'family': 'Family', 'familia': 'Family', 'criança': 'Family', 'crianca': 'Family',
    'fantasia': 'Fantasy', 'fantasy': 'Fantasy', 'mágico': 'Fantasy', 'magico': 'Fantasy',
    'crime': 'Crime', 'policial': 'Crime', 'criminoso': 'Crime',
    'musical': 'Musical', 'música': 'Musical', 'musica': 'Musical',
    'mistério': 'Mystery', 'mystery': 'Mystery', 'misterio': 'Mystery', 'enigma': 'Mystery',
    'guerra': 'War', 'war': 'War', 'militar': 'War', 'batalha': 'War',
    'western': 'Western', 'faroeste': 'Western',
    'biografia': 'Biography', 'biography': 'Biography', 'biográfico': 'Biography'
  };

  const intentKeywords = {
    recommendations: [
      'recomend', 'suger', 'indica', 'que filme', 'o que ver', 'o que assistir',
      'bom filme', 'filme bom', 'ver hoje', 'assistir', 'aconselha', 'dica',
      'sugestão', 'sugestao', 'quero ver', 'procuro', 'encontrar filme'
    ],
    popular: [
      'popular', 'melhor', 'melhores', 'top', 'bem avaliado', 'famoso', 
      'conhecido', 'sucesso', 'hit', 'mais visto', 'blockbuster', 'nota alta'
    ],
    recent: [
      'recente', 'novo', 'novos', 'lançamento', 'lancamento', 'último', 'ultimo', 
      'atual', 'este ano', 'ano passado', '2024', '2023', '2022', '2021', '2020'
    ],
    classic: [
      'clássico', 'classico', 'antigo', 'vintage', 'cult', 'anos 80', 'anos 90', 
      'retro', 'década', 'decada', 'velho', 'tradicional', '80s', '90s'
    ]
  };

  const detectedGenres = [];
  Object.entries(genreMap).forEach(([pt, en]) => {
    if (lowerMessage.includes(pt)) {
      detectedGenres.push(en);
    }
  });

  const isAskingForRecommendations = intentKeywords.recommendations.some(keyword => 
    lowerMessage.includes(keyword)
  );

  const wantsPopular = intentKeywords.popular.some(keyword => 
    lowerMessage.includes(keyword)
  );

  const wantsRecent = intentKeywords.recent.some(keyword => 
    lowerMessage.includes(keyword)
  );

  const wantsClassic = intentKeywords.classic.some(keyword => 
    lowerMessage.includes(keyword)
  );

  let detectedMood = null;
  const moodKeywords = {
    happy: ['alegre', 'feliz', 'divertido', 'engraçado', 'rir', 'gargalhar', 'comédia'],
    sad: ['triste', 'chorar', 'melancólico', 'melancolico', 'drama', 'pesado'],
    exciting: ['emocionante', 'adrenalina', 'tensão', 'tensao', 'ação', 'acção', 'aventura'],
    scary: ['medo', 'susto', 'terror', 'assombração', 'assombracao']
  };

  Object.entries(moodKeywords).forEach(([mood, keywords]) => {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      detectedMood = mood;
    }
  });

  const yearMatch = lowerMessage.match(/\b(19|20)\d{2}\b/);
  const year = yearMatch ? parseInt(yearMatch[0]) : null;

  const ratingMatch = lowerMessage.match(/nota (?:mínima\s*de\s*)?(\d+(?:[.,]\d+)?)/);
  const minRating = ratingMatch ? parseFloat(ratingMatch[1].replace(',', '.')) : null;

  return {
    genres: [...new Set(detectedGenres)],
    isAskingForRecommendations,
    wantsPopular,
    wantsRecent,
    wantsClassic,
    mood: detectedMood,
    year,
    minRating,
    originalMessage: message
  };
};

const generateContextualResponse = (parsed, movieCount) => {
  const { genres, wantsPopular, wantsRecent, wantsClassic, mood, year } = parsed;
  
  if (movieCount === 0) {
    return `Não encontrei filmes que correspondam aos teus critérios. 
Experimenta ser mais específico ou pergunta sobre outros géneros! 
Por exemplo: "filmes de comédia" ou "ação popular".`;
  }

  let response = "";
  
  if (wantsPopular) {
    response = "🔥 Aqui estão os filmes mais populares";
  } else if (wantsRecent) {
    response = "🆕 Encontrei estes lançamentos recentes";
  } else if (wantsClassic) {
    response = "🎭 Aqui tens alguns clássicos imperdíveis";
  } else if (mood === 'happy') {
    response = "😄 Perfeito para uma boa gargalhada";
  } else if (mood === 'sad') {
    response = "😢 Para um momento mais reflexivo";
  } else if (mood === 'exciting') {
    response = "⚡ Para uma dose de adrenalina";
  } else if (mood === 'scary') {
    response = "👻 Para uma noite de sustos";
  } else {
    response = "🎬 Encontrei estas excelentes opções";
  }

  if (genres.length > 0) {
    const genreText = genres.length === 1 ? 
      `de ${genres[0].toLowerCase()}` : 
      `de ${genres.slice(0, -1).join(', ').toLowerCase()} e ${genres[genres.length - 1].toLowerCase()}`;
    response += ` ${genreText}`;
  }

  if (year) {
    response += ` de ${year}`;
  }

  response += ":";
  return response;
};

export const processChatMessage = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ 
        error: 'Mensagem é obrigatória',
        response: 'Por favor, escreve uma pergunta sobre filmes! 🎬'
      });
    }

    const parsed = parseUserMessage(message);
    
    const greetings = ['olá', 'ola', 'oi', 'hey', 'bom dia', 'boa tarde', 'boa noite', 'hello'];
    const thanks = ['obrigado', 'obrigada', 'valeu', 'thanks', 'thank you'];
    
    if (greetings.some(greeting => parsed.originalMessage.toLowerCase().includes(greeting))) {
      return res.json({
        response: "Olá! 👋 Sou o teu assistente de filmes. Posso recomendar filmes de qualquer género! Experimenta perguntar:\n• 'Quero ver uma comédia'\n• 'Filmes de ação populares'\n• 'Algo triste para chorar'\n• 'Lançamentos recentes'",
        movies: []
      });
    }

    if (thanks.some(thank => parsed.originalMessage.toLowerCase().includes(thank))) {
      return res.json({
        response: "De nada! 😊 Precisa de mais recomendações? Estou aqui para ajudar!",
        movies: []
      });
    }

    if (!parsed.isAskingForRecommendations && parsed.genres.length === 0 && !parsed.mood && !parsed.wantsPopular && !parsed.wantsRecent) {
      return res.json({
        response: "Posso ajudar-te a encontrar o filme perfeito! 🎯 Diz-me:\n• Que género prefers? (comédia, drama, ação, terror...)\n• Queres algo popular ou clássico?\n• Tens algum ano em mente?\n• Como te sentes hoje?",
        movies: []
      });
    }

    let query = {};
    let sortCriteria = {};

    query.title = { $exists: true, $ne: null };
    query.year = { $exists: true, $type: "number" };

    if (parsed.genres.length > 0) {
      query.genres = { $in: parsed.genres };
    }

    if (parsed.year) {
      query.year = parsed.year;
    } else if (parsed.wantsRecent) {
      query.year = { $gte: 2015 };
    } else if (parsed.wantsClassic) {
      query.year = { $lte: 2005 };
    }

    // Filtrar por rating - mais flexível
    let minRatingFilter = parsed.minRating || 5.5; 
    if (parsed.wantsPopular) {
      minRatingFilter = Math.max(minRatingFilter, 7.0);
      query['imdb.votes'] = { $gte: 1000 }
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
    } else {
      sortCriteria = { 'imdb.rating': -1, year: -1 };
    }

    let movies = await Movie.find(query)
      .sort(sortCriteria)
      .limit(12)
      .select('title year poster genres imdb.rating imdb.votes plot runtime rated')
      .lean();


    if (movies.length === 0 && parsed.genres.length > 0) {
      console.log('Tentando busca mais flexível...');
      const flexibleQuery = {
        title: { $exists: true },
        genres: { $in: parsed.genres }
      };
      
      movies = await Movie.find(flexibleQuery)
        .sort({ year: -1 })
        .limit(8)
        .select('title year poster genres imdb.rating imdb.votes plot runtime rated')
        .lean();
      
      console.log(`Busca flexível encontrou ${movies.length} filmes`);
    }

    if (movies.length === 0) {
      console.log('Busca geral de fallback...');
      const fallbackQuery = { title: { $exists: true } };
      
      if (parsed.wantsRecent) fallbackQuery.year = { $gte: 2010 };
      if (parsed.wantsClassic) fallbackQuery.year = { $lte: 2010 };
      
      movies = await Movie.find(fallbackQuery)
        .sort(sortCriteria)
        .limit(6)
        .select('title year poster genres imdb.rating imdb.votes plot runtime rated')
        .lean();
    }

    const response = generateContextualResponse(parsed, movies.length);

    res.json({
      response,
      movies: movies.map(movie => ({
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
      }))
    });

  } catch (err) {
    console.error('Erro no processamento do chat:', err);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      response: 'Desculpa, ocorreu um erro técnico. Tenta novamente em alguns segundos! 🔧'
    });
  }
};

export const getEmbeddingBasedRecommendations = async (req, res) => {
  try {
    const { message, movieId } = req.body;
    
    let seedMovie;
    
    if (movieId) {
      seedMovie = await Movie.findById(movieId);
    } else {
      const parsed = parseUserMessage(message);
      
      if (parsed.genres.length === 0) {
        return res.json({
          response: "Para recomendações mais precisas, menciona um género que gostas! 🎯",
          movies: []
        });
      }

      const seedQuery = {
        genres: { $in: parsed.genres },
        title: { $exists: true }
      };

      if (parsed.year) {
        seedQuery.year = { $gte: parsed.year - 3, $lte: parsed.year + 3 };
      }

      seedMovie = await Movie.findOne(seedQuery)
        .sort({ 'imdb.votes': -1, 'imdb.rating': -1 });
    }

    if (!seedMovie) {
      console.log('Nenhum filme seed encontrado, usando método tradicional');
      return processChatMessage(req, res);
    }

    console.log('Filme seed encontrado:', seedMovie.title);

    const embedded = await EmbeddedMovie.findById(seedMovie._id);
    
    if (!embedded || !embedded.plot_embedding || !Array.isArray(embedded.plot_embedding)) {
      console.log('Embedding não encontrado para:', seedMovie.title);
      return processChatMessage(req, res);
    }

    console.log('Embedding encontrado, fazendo busca vetorial...');

    try {
      const similarMovies = await EmbeddedMovie.aggregate([
        {
          $search: {
            index: 'plot_vector_index',
            knnBeta: {
              vector: embedded.plot_embedding,
              path: 'plot_embedding',
              k: 20
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
        { $limit: 15 }
      ]);

      if (similarMovies.length === 0) {
        console.log('Nenhum filme similar encontrado via embedding');
        return processChatMessage(req, res);
      }

      const similarMovieIds = similarMovies.map(doc => doc._id);
      
      const recommendedMovies = await Movie.find({
        _id: { $in: similarMovieIds }
      }).select('title year poster genres imdb.rating imdb.votes plot runtime rated')
        .sort({ 'imdb.rating': -1 })
        .limit(10)
        .lean();

      const filteredMovies = recommendedMovies.filter(movie => 
        movie.imdb?.rating >= 5.0 || !movie.imdb?.rating
      );

      const genreText = seedMovie.genres?.slice(0, 2).join(' e ') || 'similares';
      
      res.json({
        response: `Baseando-me em "${seedMovie.title}" (${seedMovie.year}), aqui estão filmes de ${genreText} com histórias similares: 🎬✨`,
        movies: filteredMovies.map(movie => ({
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
        })),
        seedMovie: {
          title: seedMovie.title,
          year: seedMovie.year
        }
      });

    } catch (searchError) {
      console.error('Erro na busca vetorial:', searchError);
      console.log('Fallback para método tradicional');
      return processChatMessage(req, res);
    }

  } catch (err) {
    console.error('Erro nas recomendações por embedding:', err);
    return processChatMessage(req, res);
  }
};

export const getHybridRecommendations = async (req, res) => {
  try {
    const { message } = req.body;
    const parsed = parseUserMessage(message);

    if (parsed.genres.length > 0) {
      const embeddedCount = await EmbeddedMovie.countDocuments();
      if (embeddedCount > 0) {
        console.log('Tentando recomendações por embedding...');
        return getEmbeddingBasedRecommendations(req, res);
      }
    }
    
    console.log('Usando método tradicional de recomendações');
    return processChatMessage(req, res);
    
  } catch (err) {
    console.error('Erro nas recomendações híbridas:', err);
    return processChatMessage(req, res);
  }
};