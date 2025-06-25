export const parseUserMessage = (message) => {
  const lowerMessage = message.toLowerCase();
  
  const genreMap = {
    'comédia': 'Comedy', 'comedy': 'Comedy', 'comedia': 'Comedy', 'humor': 'Comedy', 'engraçado': 'Comedy', 'diversão': 'Comedy',
    'drama': 'Drama', 'dramático': 'Drama', 'dramatico': 'Drama', 'trágico': 'Drama', 'emocionante': 'Drama', 'sério': 'Drama',
    'ação': 'Action', 'action': 'Action', 'acção': 'Action', 'acao': 'Action', 'intenso': 'Action', 'aventura': 'Action',
    'terror': 'Horror', 'horror': 'Horror', 'medo': 'Horror', 'susto': 'Horror', 'sobrenatural': 'Horror', 'monstro': 'Horror',
    'romance': 'Romance', 'romântico': 'Romance', 'romantico': 'Romance', 'amor': 'Romance', 'relacionamento': 'Romance', 'apaixonado': 'Romance',
    'ficção científica': 'Sci-Fi', 'sci-fi': 'Sci-Fi', 'ficção': 'Sci-Fi', 'ficao': 'Sci-Fi', 'futuro': 'Sci-Fi', 'tecnologia': 'Sci-Fi',
    'thriller': 'Thriller', 'suspense': 'Thriller', 'tensão': 'Thriller', 'tensao': 'Thriller', 'psicológico': 'Thriller', 'mistério': 'Thriller',
    'aventura': 'Adventure', 'adventure': 'Adventure', 'exploração': 'Adventure', 'viagem': 'Adventure',
    'animação': 'Animation', 'animation': 'Animation', 'animacao': 'Animation', 'desenho': 'Animation', 'filme de animação': 'Animation',
    'documentário': 'Documentary', 'documentary': 'Documentary', 'documentario': 'Documentary', 'real': 'Documentary', 'verdadeiro': 'Documentary',
    'família': 'Family', 'family': 'Family', 'familia': 'Family', 'criança': 'Family', 'crianca': 'Family', 'infantil': 'Family',
    'fantasia': 'Fantasy', 'fantasy': 'Fantasy', 'mágico': 'Fantasy', 'magico': 'Fantasy', 'imaginário': 'Fantasy', 'mitologia': 'Fantasy',
    'crime': 'Crime', 'policial': 'Crime', 'criminoso': 'Crime', 'investigação': 'Crime', 'assassinato': 'Crime',
    'musical': 'Musical', 'música': 'Musical', 'musica': 'Musical', 'canto': 'Musical', 'dança': 'Musical', 'performance': 'Musical',
    'mistério': 'Mystery', 'mystery': 'Mystery', 'misterio': 'Mystery', 'enigma': 'Mystery', 'intriga': 'Mystery', 'segredo': 'Mystery',
    'guerra': 'War', 'war': 'War', 'militar': 'War', 'batalha': 'War', 'conflito': 'War', 'soldado': 'War',
    'western': 'Western', 'faroeste': 'Western', 'cowboy': 'Western', 'pioneiro': 'Western', 'duelo': 'Western',
    'biografia': 'Biography', 'biography': 'Biography', 'biográfico': 'Biography', 'real': 'Biography', 'história real': 'Biography'
  };

  const intentKeywords = {
    recommendations: [
      'recomend', 'suger', 'indica', 'que filme', 'o que ver', 'o que assistir', 
      'bom filme', 'filme bom', 'ver hoje', 'assistir', 'aconselha', 'dica', 
      'sugestão', 'sugestao', 'quero ver', 'procuro', 'encontrar filme', 
      'filme ideal', 'filme perfeito', 'filmes curtos', 'filmes longos', 'filme curto', 'filme longo',
      'filmes rápidos', 'filmes breves', 'filmes épicos', 'filmes extensos',
      'que posso ver', 'o que posso ver', 'que posso assistir', 'o que posso assistir',
      'que recomendas', 'o que recomendas', 'que recomenda', 'o que recomenda',
      'que me recomendas', 'o que me recomendas', 'que me recomenda', 'o que me recomenda',
      'que me sugere', 'o que me sugere', 'que me sugere', 'o que me sugere',
      'que me indica', 'o que me indica', 'que me indica', 'o que me indica'
    ],
    similar: [
      'parecido', 'similar', 'semelhante', 'como', 'tipo', 'estilo', 'gostei de', 
      'baseado em', 'inspirado em', 'no estilo de', 'no mesmo género', 'algo como',
      'parecido a', 'similar a', 'semelhante a', 'como', 'tipo de', 'estilo de',
      'que se pareça com', 'que seja como', 'que seja similar a', 'que seja semelhante a',
      'que seja parecido com', 'que seja do mesmo tipo', 'que seja do mesmo estilo'
    ],
    popular: [
      'popular', 'melhor', 'melhores', 'top', 'bem avaliado', 'famoso', 
      'conhecido', 'sucesso', 'hit', 'mais visto', 'blockbuster', 'nota alta'
    ],
    recent: [
      'recente', 'novo', 'novos', 'lançamento', 'lancamento', 'último', 'ultimo', 
      'atual', 'este ano', 'ano passado'
    ],
    classic: [
      'clássico', 'classico', 'antigo', 'vintage', 'cult', 'retro', 'década', 
      'decada', 'velho', 'tradicional'
    ],
    duration: [
      'curto', 'rápido', 'breve', 'pouco tempo', 'jantar', 'lanche', 'intervalo',
      'longo', 'épico', 'extenso', 'demorado'
    ]
  };

  // Detectar filmes específicos mencionados
  const movieTitlePatterns = [
    /(?:filmes?\s+)?(?:parecidos?\s+com|similares?\s+a|como|tipo|baseado\s+em|inspirado\s+em|no\s+estilo\s+de)\s+["']?([^,.!?]+)["']?(?:[,.!?]?|$)/i,
    /(?:gostei\s+de\s+ver|gostei\s+de|vi\s+o\s+filme|assisti\s+o\s+filme|assisti)\s+["']?([^,.!?]+)["']?(?:[,.!?]?|$)/i,
    /(?:que\s+recomendas|que\s+recomenda|recomendas|recomenda)\s+(?:para\s+ver\s+depois\s+de|após\s+ver|depois\s+de\s+ver|após\s+assistir|depois\s+de\s+assistir)\s+["']?([^,.!?]+)["']?(?:[,.!?]?|$)/i,
    /(?:que\s+posso\s+ver|o\s+que\s+posso\s+ver|que\s+posso\s+assistir|o\s+que\s+posso\s+assistir)\s+(?:parecido\s+a|similar\s+a|semelhante\s+a|como|tipo\s+de|estilo\s+de)\s+["']?([^,.!?]+)["']?(?:[,.!?]?|$)/i
  ];

  let referencedMovie = null;
  for (const pattern of movieTitlePatterns) {
    const match = message.match(pattern);
    if (match) {
      referencedMovie = match[1].trim();
      break;
    }
  }

  // Detetar géneros
  const detectedGenres = [];
  Object.entries(genreMap).forEach(([pt, en]) => {
    if (lowerMessage.includes(pt)) {
      detectedGenres.push(en);
    }
  });

  // Detetar preferências de duração
  let durationPreference = null;
  if (lowerMessage.includes('curto') || lowerMessage.includes('rápido') || 
      lowerMessage.includes('jantar') || lowerMessage.includes('breve') ||
      lowerMessage.includes('pouco tempo') || lowerMessage.includes('rapidinho')) {
    durationPreference = 'short';
  } else if (lowerMessage.includes('longo') || lowerMessage.includes('épico') || 
             lowerMessage.includes('extenso') || lowerMessage.includes('demorado') ||
             lowerMessage.includes('maratona')) {
    durationPreference = 'long';
  }

  // Detetar intenções
  const isAskingForRecommendations = intentKeywords.recommendations.some(keyword => 
    lowerMessage.includes(keyword)
  ) || durationPreference !== null

  const wantsSimilar = intentKeywords.similar.some(keyword => 
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

  // Detetar mood 
  let detectedMood = null;
  const moodKeywords = {
    happy: [
      'alegre', 'feliz', 'divertido', 'engraçado', 'rir', 'gargalhar', 'comédia', 
      'quero rir', 'para rir', 'dar risada', 'risada', 'humor', 'engraçada',
      'diversão', 'divertir', 'alegria', 'bom humor', 'animado', 'descontraído'
    ],
    sad: [
      'triste', 'chorar', 'melancólico', 'melancolico', 'drama', 'pesado',
      'quero chorar', 'para chorar', 'lágrimas', 'lagrimas', 'emocionante',
      'tocante', 'emocionar', 'sentimental', 'dramático', 'dramatico'
    ],
    exciting: [
      'emocionante', 'adrenalina', 'tensão', 'tensao', 'ação', 'acção', 'aventura',
      'excitante', 'intenso', 'empolgante', 'agitado', 'dinâmico', 'dinamico',
      'acelerar coração', 'acelerar o coração', 'eletrizante'
    ],
    scary: [
      'medo', 'susto', 'terror', 'assombração', 'assombracao', 'assustador',
      'quero medo', 'para assustar', 'arrepiar', 'calafrios', 'horripilante',
      'sinistro', 'macabro', 'sombrio', 'tenebroso'
    ],
    philosophical: [
      'filosofia', 'filosófico', 'filosofico', 'reflexão', 'reflexao', 'pensativo', 
      'profundo', 'refletir', 'pensar', 'intelectual', 'cerebral', 'complexo',
      'existencial', 'contemplativo', 'introspectivo'
    ]
  };

  // Verificar mood com prioridade para expressões específicas
  Object.entries(moodKeywords).forEach(([mood, keywords]) => {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      if (!detectedMood || 
          (mood === 'happy' && (lowerMessage.includes('quero rir') || lowerMessage.includes('para rir'))) ||
          (mood === 'sad' && (lowerMessage.includes('quero chorar') || lowerMessage.includes('para chorar'))) ||
          (mood === 'scary' && (lowerMessage.includes('quero medo') || lowerMessage.includes('para assustar')))) {
        detectedMood = mood;
      }
    }
  });

  // Detetar décadas
  const decadeMatch = lowerMessage.match(/anos?\s*(\d{2})/);
  let decade = null;
  if (decadeMatch) {
    const yearSuffix = parseInt(decadeMatch[1]);
    if (yearSuffix >= 20 && yearSuffix <= 30) {
      decade = 2000 + yearSuffix; // 2020s, 2030s
    } else if (yearSuffix >= 60 && yearSuffix <= 99) {
      decade = 1900 + yearSuffix; // 1960s-1990s
    }
  }

  // Detetar anos específicos
  const yearMatch = lowerMessage.match(/\b(19|20)\d{2}\b/);
  const year = yearMatch ? parseInt(yearMatch[0]) : null;

  // Detetar rating mínimo
  const ratingMatch = lowerMessage.match(/nota (?:mínima\s*de\s*)?(\d+(?:[.,]\d+)?)/);
  const minRating = ratingMatch ? parseFloat(ratingMatch[1].replace(',', '.')) : null;

  // Se detetou mood, marcar como pedindo recomendações
  if (detectedMood && !isAskingForRecommendations) {
    const moodBasedRecommendation = true;
  }

  return {
    genres: [...new Set(detectedGenres)],
    isAskingForRecommendations: isAskingForRecommendations || detectedMood !== null,
    wantsSimilar,
    wantsPopular,
    wantsRecent,
    wantsClassic,
    mood: detectedMood,
    year,
    decade,
    minRating,
    durationPreference,
    referencedMovie,
    originalMessage: message
  };
};