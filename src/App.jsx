import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Relatorio from './Relatorio';

// Componentes internos
function Totem({ gerarSenha }) {
  return (
    <div>
      <button onClick={() => gerarSenha('SP')}>Senha Prioritária (SP)</button>
      <button onClick={() => gerarSenha('SG')}>Senha Geral (SG)</button>
      <button onClick={() => gerarSenha('SE')}>Retirada de Exames (SE)</button>
    </div>
  );
}

function Painel({ ultimasSenhas }) {
  return (
    <div>
      <h2>Últimas 5 Senhas:</h2>
      <ul>
        {ultimasSenhas.map((s, i) => (
          <li key={i}>{s.numero} - Guichê {s.guiche}</li>
        ))}
      </ul>
    </div>
  );
}

function Atendente({ chamarProxima, senhaAtual, finalizarAtendimento }) {
  return (
    <div>
      <button onClick={chamarProxima}>Chamar Próxima</button>
      <div>Senha Atual: {senhaAtual ? `${senhaAtual.numero} - Guichê ${senhaAtual.guiche}` : 'Nenhuma'}</div>
      <button onClick={finalizarAtendimento} disabled={!senhaAtual}>Finalizar Atendimento</button>
    </div>
  );
}

function Home() {
  const [filaSP, setFilaSP] = useState([]);
  const [filaSE, setFilaSE] = useState([]);
  const [filaSG, setFilaSG] = useState([]);
  const [senhaAtual, setSenhaAtual] = useState(null);
  const [ultimasSenhas, setUltimasSenhas] = useState([]);
  const [guicheAtual, setGuicheAtual] = useState(1);
  const [ordem, setOrdem] = useState('SP');
  const [senhas, setSenhas] = useState([]);
  const [contadorPorDia, setContadorPorDia] = useState({});
  const navigate = useNavigate();

  const hojeYYMMDD = () => {
    const now = new Date();
    return now.toISOString().slice(2, 10).replace(/-/g, '');
  };

  const estaDentroDoExpediente = () => {
    const hora = new Date().getHours();
    return hora >= 7 && hora < 17;
  };

  const gerarSenha = (tipo) => {
    if (!estaDentroDoExpediente()) {
      alert("Fora do expediente (07h às 17h).");
      return;
    }

    if (Math.random() < 0.05) {
      console.log("Senha abandonada.");
      return;
    }

    const dia = hojeYYMMDD();
    const chave = dia + tipo;
    const novaSeq = (contadorPorDia[chave] || 1).toString().padStart(2, '0');
    const numero = `${dia}-${tipo}${novaSeq}`;

    const novaSenha = {
      numero,
      tipo,
      emitidaEm: new Date(),
      atendidaEm: null,
      guiche: null
    };

    setSenhas([...senhas, novaSenha]);
    setContadorPorDia({ ...contadorPorDia, [chave]: (contadorPorDia[chave] || 1) + 1 });

    if (tipo === 'SP') setFilaSP([...filaSP, novaSenha]);
    else if (tipo === 'SE') setFilaSE([...filaSE, novaSenha]);
    else setFilaSG([...filaSG, novaSenha]);
  };

  const chamarProxima = () => {
    if (!estaDentroDoExpediente()) {
      alert("Atendimentos encerrados.");
      return;
    }

    let proximaSenha = null;
    const proximaOrdem = { SP: 'SE', SE: 'SG', SG: 'SP' };

    const tentarFila = () => {
      if (ordem === 'SP' && filaSP.length > 0) {
        proximaSenha = filaSP.shift();
        setFilaSP([...filaSP]);
      } else if (ordem === 'SE' && filaSE.length > 0) {
        proximaSenha = filaSE.shift();
        setFilaSE([...filaSE]);
      } else if (ordem === 'SG' && filaSG.length > 0) {
        proximaSenha = filaSG.shift();
        setFilaSG([...filaSG]);
      } else {
        setOrdem(proximaOrdem[ordem]);
        return chamarProxima();
      }
    };

    tentarFila();

    if (proximaSenha) {
      const atualizada = {
        ...proximaSenha,
        guiche: guicheAtual,
        atendidaEm: new Date()
      };

      setSenhaAtual(atualizada);
      setUltimasSenhas([atualizada, ...ultimasSenhas].slice(0, 5));
      setGuicheAtual((prev) => (prev % 2) + 1);
      setOrdem(proximaOrdem[ordem]);

      setSenhas((prev) =>
        prev.map((s) => (s.numero === proximaSenha.numero ? atualizada : s))
      );
    }
  };

  const finalizarAtendimento = () => {
    setSenhaAtual(null);
  };

  const gerarRelatorio = (tipo) => {
    const hoje = new Date();
    const isHoje = (data) =>
      data && data.getDate() === hoje.getDate() && data.getMonth() === hoje.getMonth() && data.getFullYear() === hoje.getFullYear();

    const isMes = (data) =>
      data && data.getMonth() === hoje.getMonth() && data.getFullYear() === hoje.getFullYear();

    const filtro = tipo === 'diario' ? isHoje : isMes;

    const emitidas = senhas.filter((s) => filtro(s.emitidaEm));
    const atendidas = emitidas.filter((s) => s.atendidaEm !== null);

    const resumo = {
      emitidas: emitidas.length,
      atendidas: atendidas.length,
      porTipo: ['SP', 'SE', 'SG'].map((tipo) => ({
        tipo,
        emitidas: emitidas.filter((s) => s.tipo === tipo).length,
        atendidas: atendidas.filter((s) => s.tipo === tipo && s.atendidaEm !== null).length
      }))
    };

    navigate('/relatorio', { state: { tipo, dados: resumo } });
  };

  return (
    <div className="app-container">
      <div className="component-box">
        <h2>Emissão de Senha</h2>
        <Totem gerarSenha={gerarSenha} />
      </div>
      <div className="component-box">
        <h2>Últimas Chamadas</h2>
        <Painel ultimasSenhas={ultimasSenhas} />
      </div>
      <div className="component-box">
        <h2>Atendente</h2>
        <Atendente
          chamarProxima={chamarProxima}
          senhaAtual={senhaAtual}
          finalizarAtendimento={finalizarAtendimento}
        />
      </div>
      <div className="component-box">
        <h2>Relatórios</h2>
        <button onClick={() => gerarRelatorio('diario')}>Relatório Diário</button>
        <button onClick={() => gerarRelatorio('mensal')}>Relatório Mensal</button>
      </div>
    </div>
  );
}

// Define as rotas aqui
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/relatorio" element={<Relatorio />} />
      </Routes>
    </Router>
  );
}

export default App;
