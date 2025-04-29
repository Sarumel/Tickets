import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Relatorio() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const dados = state?.dados || null;
  const tipo = state?.tipo || 'desconhecido';

  if (!dados) {
    return (
      <div>
        <h2>Nenhum dado disponível para o relatório.</h2>
        <button onClick={() => navigate('/')}>Voltar</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>📊 Relatório {tipo.toUpperCase()}</h2>
      <p>Total Emitidas: {dados.emitidas}</p>
      <p>Total Atendidas: {dados.atendidas}</p>
      <h3>Por Tipo:</h3>
      <ul>
        {dados.porTipo.map((tipo, i) => (
          <li key={i}>
            {tipo.tipo} — Emitidas: {tipo.emitidas}, Atendidas: {tipo.atendidas}
          </li>
        ))}
      </ul>
      <button onClick={() => navigate('/')}>⬅ Voltar</button>
    </div>
  );
}

export default Relatorio;
