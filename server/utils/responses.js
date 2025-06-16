// Função para gerar resposta quando não entende
export const generateDontUnderstandResponse = () => {
  const responses = [
    "Desculpa, não consegui perceber o que queres! 🤔\nPodes perguntar algo como:\n• 'Quero ver uma comédia'\n• 'Filmes de ação populares'\n• 'Algo parecido com Inception'",
    
    "Hmm, não entendi bem a tua pergunta! 😅\nTenta algo como:\n• 'Recomenda-me um filme de terror'\n• 'Filmes de 1995'\n• 'Comédias para rir'",
    
    "Não consegui entender! Podes ser mais específico? 🎬\nExemplos:\n• 'Filmes curtos para o jantar'\n• 'Dramas bem avaliados'\n• 'Animações para crianças'",
    
    "Não percebi bem! 🤷‍♂️\nTenta perguntar sobre:\n• Géneros (comédia, ação, drama...)\n• Filmes populares ou recentes\n• Algo similar a um filme que gostaste"
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
};

export const generateContextualResponse = (parsed, movieCount, referencedMovie = null) => {
  const { genres, wantsPopular, wantsRecent, wantsClassic, mood, year, decade, durationPreference, wantsSimilar } = parsed;
  
  if (movieCount === 0) {
    return `Não encontrei filmes que correspondam aos teus critérios. 
            Experimenta ser mais específico ou pergunta sobre outros géneros! 
            Por exemplo: "filmes de comédia" ou "ação popular".`;
  }

  let response = "";
  
  if (referencedMovie && wantsSimilar) {
    response = `🎯 Baseando-me em "${referencedMovie.title}" (${referencedMovie.year}), aqui estão filmes similares`;
  } else if (durationPreference === 'short') {
    response = "⏱️ Filmes curtos perfeitos para o jantar";
  } else if (durationPreference === 'long') {
    response = "🎬 Filmes épicos para uma sessão longa";
  } else if (wantsPopular) {
    response = "🔥 Aqui estão os filmes mais populares";
  } else if (wantsRecent) {
    response = "🆕 Encontrei estes lançamentos recentes";
  } else if (wantsClassic) {
    response = "🎭 Aqui tens alguns clássicos imperdíveis";
  } else if (decade) {
    response = `📼 Filmes dos anos ${decade.toString().slice(-2)}`;
  } else if (mood === 'happy') {
    response = "😄 Perfeito para uma boa gargalhada";
  } else if (mood === 'sad') {
    response = "😢 Para um momento mais reflexivo";
  } else if (mood === 'exciting') {
    response = "⚡ Para uma dose de adrenalina";
  } else if (mood === 'scary') {
    response = "👻 Para uma noite de sustos";
  } else if (mood === 'philosophical') {
    response = "🤔 Para refletir sobre a vida";
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