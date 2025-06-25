// Função para gerar resposta quando não entende
export const generateDontUnderstandResponse = () => {
  const responses = [
    "Desculpa, não consegui perceber o que queres! 🤔<br>Podes perguntar algo como:<br>• 'Quero ver uma comédia'<br>• 'Filmes de ação populares'<br>• 'Algo parecido com Inception'",
    
    "Hmm, não entendi bem a tua pergunta! 😅<br>Tenta algo como:<br>• 'Recomenda-me um filme de terror'<br>• 'Filmes de 1995'<br>• 'Comédias para rir'",
    
    "Não consegui entender! Podes ser mais específico? 🎬<br>Exemplos:<br>• 'Filmes curtos para o jantar'<br>• 'Dramas bem avaliados'<br>• 'Animações para crianças'",
    
    "Não percebi bem! 🤷‍♂️<br>Tenta perguntar sobre:<br>• Géneros (comédia, ação, drama...)<br>• Filmes populares ou recentes<br>• Algo similar a um filme que gostaste"
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