export const isValidMovieQuery = (message) => {
  const lowerMessage = message.toLowerCase().trim();
  
  // Verificar se é muito curta (menos de 3 caracteres)
  if (lowerMessage.length < 3) {
    return false;
  }
  
  // Verificar se tem muitos caracteres consecutivos iguais 
  const hasSpam = /(.)\1{4,}/.test(lowerMessage); 
  if (hasSpam) {
    return false;
  }
  
  // Verificar se tem uma proporção alta de caracteres sem sentido
  const randomChars = lowerMessage.match(/[^a-záàâãéêíóôõúçñ\s\d]/g);
  const randomCharRatio = randomChars ? randomChars.length / lowerMessage.length : 0;
  if (randomCharRatio > 0.3) { 
    return false;
  }
  
  // Verificar se tem pelo menos algumas palavras válidas relacionadas com filmes 
  const movieKeywords = [
    // Géneros
    'comédia', 'comedy', 'comedia', 'humor', 'engraçado', 'diversão',
    'drama', 'dramático', 'dramatico', 'trágico', 'emocionante', 'sério',
    'ação', 'action', 'acção', 'acao', 'intenso', 'aventura',
    'terror', 'horror', 'medo', 'susto', 'sobrenatural', 'monstro',
    'romance', 'romântico', 'romantico', 'amor', 'relacionamento',
    'ficção', 'ficao', 'sci-fi', 'futuro', 'tecnologia',
    'thriller', 'suspense', 'tensão', 'tensao', 'psicológico', 'mistério',
    'animação', 'animation', 'animacao', 'desenho',
    'documentário', 'documentary', 'documentario',
    'família', 'family', 'familia', 'criança', 'crianca', 'infantil',
    'fantasia', 'fantasy', 'mágico', 'magico', 'imaginário', 'mitologia',
    'crime', 'policial', 'criminoso', 'investigação', 'assassinato',
    'musical', 'música', 'musica', 'canto', 'dança',
    'guerra', 'war', 'militar', 'batalha', 'conflito',
    'western', 'faroeste', 'cowboy',
    'biografia', 'biography', 'biográfico',
    
    // Palavras relacionadas com filmes
    'filme', 'filmes', 'movie', 'movies', 'cinema', 'ver', 'assistir', 'watch',
    'recomend', 'suger', 'indica', 'dica', 'sugestão', 'sugestao',
    'popular', 'melhor', 'melhores', 'top', 'famoso', 'conhecido',
    'recente', 'novo', 'novos', 'lançamento', 'lancamento',
    'clássico', 'classico', 'antigo', 'vintage', 'cult',
    'parecido', 'similar', 'semelhante', 'como', 'tipo', 'estilo',
    'gostei', 'baseado', 'inspirado',

    // Palavras relacionadas com avaliações e qualidade
    'nota', 'rating', 'avaliação', 'avaliacao', 'pontuação', 'pontuacao',
    'mínima', 'minima', 'máxima', 'maxima', 'acima', 'abaixo',
    'qualidade', 'bom', 'boa', 'excelente', 'ótimo', 'otimo',

    // Palavras comuns
    'que', 'quero', 'posso', 'pode', 'tenho', 'tem', 'para', 'por', 'com', 'sem',
    'bom', 'boa', 'melhor', 'pior', 'grande', 'pequeno', 'novo', 'velho',
    'hoje', 'ontem', 'amanhã', 'agora', 'depois', 'antes',
    'ano', 'anos', 'tempo', 'hora', 'dia', 'noite', 'manhã', 'tarde',
    'casa', 'trabalho', 'escola', 'universidade',
    'português', 'inglês', 'americano', 'brasileiro',
    
    // Cumprimentos e palavras sociais
    'olá', 'ola', 'hey', 'oi', 'bom', 'boa', 'dia', 'tarde', 'noite',
    'obrigado', 'obrigada', 'valeu', 'thanks', 'thank', 'por favor', 'please',
    'desculpa', 'sorry', 'sim', 'não', 'nao', 'yes', 'no',
    
    // Anos e números
    '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015',
    '2010', '2000', '1990', '1980', '1970', '1960',
    'um', 'uma', 'dois', 'duas', 'três', 'tres', 'quatro', 'cinco',

    // Palavras relacionadas com duração
    'curto', 'curtos', 'rápido', 'rapido', 'breve', 'breves', 'rapidinho',
    'longo', 'longos', 'épico', 'epico', 'extenso', 'extensos', 'demorado',
    'jantar', 'almoço', 'almoco', 'lanche', 'intervalo', 'pausa',
    'maratona', 'sessão', 'sessao', 'tempo', 'duração', 'duracao',
    'minutos', 'horas', 'hora'
  ];
  
  // Verificar se tem pelo menos uma palavra reconhecível
  const hasValidWords = movieKeywords.some(keyword => 
    lowerMessage.includes(keyword)
  );
  
  // Verificar se parece ser uma sequência aleatória de caracteres
  const words = lowerMessage.split(/\s+/);
  const longRandomWords = words.filter(word => {
    // Palavra muito longa sem vogais ou com padrão estranho
    if (word.length > 8 && !/[aeiouáàâãéêíóôõú]/.test(word)) {
      return true;
    }
    // Palavra com muitas consoantes consecutivas
    if (/[bcdfghjklmnpqrstvwxyz]{4,}/.test(word)) {
      return true;
    }
    return false;
  });
  
  // Se tem muitas palavras que parecem aleatórias
  if (longRandomWords.length > words.length * 0.5) {
    return false;
  }
  
  return hasValidWords;
};