import { parseUserMessage } from '../utils/messageParser.js';
import { isValidMovieQuery } from '../utils/validation.js';
import { generateDontUnderstandResponse, generateContextualResponse } from '../utils/responses.js';
import { 
  findReferencedMovie, 
  searchMovies, 
  getEmbeddingBasedRecommendations, 
  formatMoviesForResponse 
} from '../services/movieService.js';
import EmbeddedMovie from '../models/EmbeddedMovie.js';
import Movie from '../models/Movie.js';

export const processChatMessage = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ 
        error: 'Mensagem é obrigatória',
        response: 'Por favor, escreve uma pergunta sobre filmes! 🎬'
      });
    }

    if (!isValidMovieQuery(message)) {
      return res.json({
        response: generateDontUnderstandResponse(),
        movies: []
      });
    }

    const parsed = parseUserMessage(message);
    console.log('Parsed message:', JSON.stringify(parsed, null, 2));
    
    // Respostas para cumprimentos e agradecimentos
    const greetings = ['olá', 'ola', 'hey', 'bom dia', 'boa tarde', 'boa noite', 'hello', "boas"];
    const thanks = ['obrigado', 'obrigada', 'thanks', 'thank you'];
    
    if (greetings.some(greeting => parsed.originalMessage.toLowerCase().includes(greeting))) {
      return res.json({
        response: "Olá! 👋 Sou o teu assistente de filmes. Posso recomendar filmes de qualquer género! Experimenta perguntar:\n• 'Quero ver uma comédia'\n• 'Filmes de ação populares'\n• 'Algo parecido com Inception'\n• 'Filmes curtos para o jantar'",
        movies: []
      });
    }

    if (thanks.some(thank => parsed.originalMessage.toLowerCase().includes(thank))) {
      return res.json({
        response: "De nada! 😊 Precisa de mais recomendações? Estou aqui para ajudar!",
        movies: []
      });
    }

    // Verificar se é uma query válida para filmes
    if (!parsed.isAskingForRecommendations && 
        !parsed.wantsSimilar && 
        !parsed.wantsPopular && 
        !parsed.wantsRecent && 
        !parsed.wantsClassic && 
        parsed.genres.length === 0 && 
        !parsed.referencedMovie && 
        !parsed.mood && 
        !parsed.year && 
        !parsed.decade &&
        !parsed.minRating &&
        !parsed.durationPreference) {
      
      return res.json({
        response: generateDontUnderstandResponse(),
        movies: []
      });
    }

    // Se menciona um filme específico, tentar recomendações baseadas nele
    if (parsed.referencedMovie && parsed.wantsSimilar) {
      console.log('Looking for referenced movie:', parsed.referencedMovie);
      
      const referencedMovie = await findReferencedMovie(parsed.referencedMovie);
      
      if (referencedMovie) {
        console.log('Found referenced movie:', referencedMovie.title, referencedMovie.year);
        return getEmbeddingBasedRecommendationsHandler(req, res, referencedMovie);
      } else {
        console.log('Referenced movie not found:', parsed.referencedMovie);
        // Se não encontrou o filme específico, tentar buscar por gênero
        const genreQuery = {
          genres: { $in: ['Drama', 'Thriller', 'Mystery'] }, 
          'imdb.rating': { $gte: 6.0 }
        };
        
        const alternativeMovies = await Movie.find(genreQuery)
          .sort({ 'imdb.rating': -1 })
          .limit(12)
          .select('title year poster genres imdb.rating imdb.votes plot runtime rated')
          .lean();

        return res.json({
          response: `Não consegui encontrar o filme "${parsed.referencedMovie}" na base de dados. 😕\n\nMas aqui estão alguns filmes de drama e suspense que podem te interessar:`,
          movies: formatMoviesForResponse(alternativeMovies)
        });
      }
    }

    const movies = await searchMovies(parsed);
    console.log(`Found ${movies.length} movies`);

    const response = generateContextualResponse(parsed, movies.length);

    res.json({
      response,
      movies: formatMoviesForResponse(movies)
    });

  } catch (err) {
    console.error('Erro no processamento do chat:', err);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      response: 'Desculpa, ocorreu um erro técnico. Tenta novamente em alguns segundos! 🔧'
    });
  }
};

export const getEmbeddingBasedRecommendationsHandler = async (req, res, providedMovie = null) => {
  try {
    const { message, movieId } = req.body;
    
    let seedMovie = providedMovie;
    
    if (!seedMovie) {
      if (movieId) {
        seedMovie = await Movie.findById(movieId);
      } else {
        const parsed = parseUserMessage(message);
        
        if (parsed.referencedMovie) {
          console.log('Searching for movie in embedding handler:', parsed.referencedMovie);
          seedMovie = await findReferencedMovie(parsed.referencedMovie);
        }
        
        if (!seedMovie && parsed.genres.length > 0) {
          console.log('No specific movie found, looking for seed by genre:', parsed.genres);
          const seedQuery = {
            genres: { $in: parsed.genres },
            title: { $exists: true },
            'imdb.rating': { $gte: 7.0 }
          };

          if (parsed.year) {
            seedQuery.year = { $gte: parsed.year - 3, $lte: parsed.year + 3 };
          }

          seedMovie = await Movie.findOne(seedQuery)
            .sort({ 'imdb.votes': -1, 'imdb.rating': -1 });
        }
      }
    }

    if (!seedMovie) {
      console.log('Nenhum filme seed encontrado, usando método tradicional');
      return processChatMessage(req, res);
    }

    console.log('Filme seed encontrado:', seedMovie.title, seedMovie.year);

    const recommendedMovies = await getEmbeddingBasedRecommendations(seedMovie);
    
    if (!recommendedMovies || recommendedMovies.length === 0) {
      console.log('Fallback para método tradicional - no embedding recommendations');
      return processChatMessage(req, res);
    }

    const genreText = seedMovie.genres?.slice(0, 2).join(' e ') || 'similares';
    
    res.json({
      response: `🎯 Baseando-me em "${seedMovie.title}" (${seedMovie.year}), aqui estão filmes de ${genreText} com histórias similares:`,
      movies: formatMoviesForResponse(recommendedMovies),
      seedMovie: {
        title: seedMovie.title,
        year: seedMovie.year
      }
    });

  } catch (err) {
    console.error('Erro nas recomendações por embedding:', err);
    return processChatMessage(req, res);
  }
};

export const getHybridRecommendations = async (req, res) => {
  try {
    const { message } = req.body;
    const parsed = parseUserMessage(message);

    // Se menciona um filme específico e quer similares, usar embeddings
    if (parsed.referencedMovie && parsed.wantsSimilar) {
      const embeddedCount = await EmbeddedMovie.countDocuments();
      if (embeddedCount > 0) {
        console.log('Tentar recomendações por embedding para filme específico...');
        return getEmbeddingBasedRecommendationsHandler(req, res);
      }
    }
    
    // Se tem géneros específicos, tentar embeddings
    if (parsed.genres.length > 0) {
      const embeddedCount = await EmbeddedMovie.countDocuments();
      if (embeddedCount > 0) {
        console.log('Tentar recomendações por embedding...');
        return getEmbeddingBasedRecommendationsHandler(req, res);
      }
    }
    
    console.log('Usar método tradicional de recomendações');
    return processChatMessage(req, res);
    
  } catch (err) {
    console.error('Erro nas recomendações híbridas:', err);
    return processChatMessage(req, res);
  }
};