import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container">
      <div className="error-container">
        <h1>404 - Página não encontrada</h1>
        <p>A página procura não existe.</p>
        <Link to="/" className="error-button">Voltar para a página inicial</Link>
      </div>
    </div>
  );
};

export default NotFound;