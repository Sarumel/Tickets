# Sistema de Controle de Atendimento

## 📋 Descrição do Projeto

O sistema foi desenvolvido para gerenciar filas de atendimento em laboratórios médicos, utilizando emissão e controle de senhas. A aplicação organiza a ordem dos atendimentos com base em tipos de prioridade e garante um fluxo eficiente de clientes durante o horário de expediente.

🕖 **Horário de Funcionamento:**  
O sistema opera exclusivamente das **07h00 às 17h00**.  
Fora desse horário, a emissão e o atendimento de senhas são bloqueados automaticamente.

---

## 🚀 | Funcionalidades Principais

- Emissão de senhas por tipo de atendimento:
  - **SP**: Senha Prioritária
  - **SG**: Senha Geral
  - **SE**: Senha para Retirada de Exames
 
- Chamada de senhas em ordem de prioridade controlada:
  - Alternância obrigatória entre SP e SG/SE.
    
- Gerenciamento de atendimento:
  - Todos os guichês podem atender qualquer tipo de senha.
    
- Controle de tempo médio (TM) de atendimento específico por tipo de senha.
- Descarte automático de senhas não atendidas (**aproximadamente 5%**).
  
- Geração de relatórios diários e mensais:
  - Senhas emitidas e atendidas (geral e por prioridade).
  - Tempo médio de atendimento detalhado.

---

## ⚙️ | Regras de Funcionamento

- O sistema **só permite emissão e atendimento entre 07h00 e 17h00**.
- Após 17h00, senhas não atendidas são descartadas.
- Numeração de senha no padrão: `YYMMDD-PPSQ`
  - **YY**: Ano (2 dígitos)
  - **MM**: Mês (2 dígitos)
  - **DD**: Dia (2 dígitos)
  - **PP**: Tipo de senha
  - **SQ**: Sequência diária

- Exibição no painel:
  - Apenas as **últimas 5 senhas chamadas** são exibidas.

---

## 🧩 | Agentes do Sistema

- **AS (Agente Sistema)**: Emite senhas e gerencia comandos.
- **AA (Agente Atendente)**: Chama próxima senha e realiza atendimento.
- **AC (Agente Cliente)**: Solicita senha no totem e aguarda ser chamado.

---

## 🛠️ | Tecnologias Utilizadas

- **Banco de Dados**: MySQL 8.0
- **Frontend**: React

---

## 📊 | Relatórios Gerados

- Quantidade geral de senhas emitidas.
- Quantidade geral de senhas atendidas.
- Quantidade de senhas por prioridade (emitidas e atendidas).
- Relatório detalhado:
  - Numeração da senha
  - Tipo de senha
  - Data/hora de emissão
  - Data/hora de atendimento
  - Guichê de atendimento (caso aplicável)
- Relatório de variação do Tempo Médio (TM) de atendimento.

---

## ⚡ | Observações Importantes

- A cada atendimento, é alternada a prioridade da senha chamada.
- Atendimento prioriza: **SP > SE > SG**.
- Tempo de atendimento possui variações aleatórias dependendo do tipo de senha.

---

> Desenvolvido por **Ana Beatriz, Samuel Alexandre** - UNINASSAU - 2025.
