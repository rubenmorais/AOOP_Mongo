# Plataforma de Filmes com MongoDB

Este repositório apresenta uma plataforma de filmes desenvolvida com base na base de dados `sample_mflix` do MongoDB. Através desta aplicação, é possível visualizar todos os filmes disponíveis na base de dados, consultar comentários e adicionar novos comentários a qualquer filme.

Além disso, a plataforma oferece um chat inteligente onde é possível pedir recomendações de filmes com base em diferentes critérios, como género, ano, duração ou até mesmo a partir de outros filmes.

## Funcionalidades

- Listagem de todos os filmes presentes na base de dados `sample_mflix`
- Visualização de comentários associados a cada filme
- Adição de novos comentários
- Recomendação de filmes através do chat:
  - Por género
  - Por ano
  - Por duração
  - Com base noutros filmes

## Requisitos

- Node.js 
- MongoDB Atlas (ou instância local do MongoDB)

## Configuração dos ficheiros `.env`

Antes de correr a aplicação, é necessário criar os seguintes ficheiros `.env`:

### No `client` (`AOOP_Mongo/client/.env`)
```env
REACT_APP_API_URL=http://localhost:5000
```

### No `server` (`AOOP_Mongo/server/.env`)
```env
PORT=5000
MONGO_URI=<a tua string de ligação MongoDB>
```

## Como correr o projecto

1. Clonar o repositório:

```bash
git clone https://github.com/rubenmorais/AOOP_Mongo.git
```

2. Criar os ficheiros `.env` como indicado acima.

3. Aceder às pastas do `client` e do `server` e instalar as dependências:

```bash
cd AOOP_Mongo/client
npm install
npm start
```

Noutra janela do terminal:

```bash
cd AOOP_Mongo/server
npm install
npm start
```

A aplicação ficará disponível localmente e pronta a utilizar.

---

