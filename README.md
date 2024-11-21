# Desafio Backend - Node.js com TypeScript

## Objetivo
Criar uma aplicação backend em Node.js utilizando TypeScript que permita o upload de uma planilha com 100 mil linhas, processe e armazene os dados em um banco de dados PostgreSQL, e disponibilize uma API para acesso a esses dados com funcionalidades avançadas.

---

## Requisitos Funcionais

### 1. Upload de Arquivo
- **Endpoint de Upload**:
  - Criar um endpoint para upload de planilhas (formato a ser especificado, como CSV ou XLSX).
  - A planilha conterá 100 mil linhas com dados que deverão ser processados.

- **Processamento Assíncrono**:
  - O processamento do arquivo deve ser assíncrono utilizando filas (ex: BullMQ).
  - Garantir que o upload não bloqueie a thread principal e que o usuário receba uma resposta imediatamente após o envio.

- **Feedback de Status**:
  - Implementar uma forma para que o usuário verifique o status do processamento (ex: em andamento, concluído, erro).
  - Suporte a polling em um endpoint ou via WebSockets.

### 2. API de Dados
- **Endpoints para Acesso aos Dados**:
  - Endpoints para listar, filtrar, ordenar e buscar nos dados armazenados.
  - Implementar paginação eficiente para grandes volumes de dados (ex: cursor ou keyset pagination).

- **Filtragem e Ordenação Avançadas**:
  - Permitir filtragem pelos campos:
    - `GivenName`, `City`, `TropicalZodiac`, `Occupation`, `Vehicle`, `CountryFull`.
  - Suportar múltiplos critérios de ordenação.

- **Informação Adicional no Response**:
  - Incluir a quantidade de registros retornados na página atual.

---

## Requisitos Não Funcionais

### 1. Persistência de Dados
- Banco de Dados:
  - Utilizar PostgreSQL.
  - Modelar o banco de forma eficiente, com índices e tipos de dados apropriados.

### 2. Processamento Assíncrono e Filas
- Utilizar uma tecnologia de filas (ex: BullMQ, RabbitMQ, Kafka).
- Garantir confiabilidade e escalabilidade do processamento.
- Implementar controle de concorrência para evitar problemas como race conditions ou deadlocks.

### 3. Escalabilidade e Performance
- **Otimização de Performance**:
  - Otimizar o tempo de resposta das rotas.
  - Retornar o tempo de execução das operações nas respostas.

- **Escalabilidade**:
  - Documentar como a aplicação pode ser escalada horizontalmente.

- **Uso de Cache**:
  - Implementar cache (ex: Redis) para melhorar a performance em consultas frequentes.

### 4. Documentação e Boas Práticas
- Fornecer explicações detalhadas sobre o código e escolhas técnicas.
- Utilizar ESLint e Prettier para garantir padrões de código consistentes.
- Estruturar o projeto de forma modular e aplicar princípios de design como SOLID e DRY.

---

## Diferenciais
- **Deploy via Vercel**:
  - Entregar a aplicação através da plataforma Vercel será considerado um diferencial.

---

## Entrega

### Repositório Git
- Disponibilizar o código em um repositório público ou privado (conceder acesso se necessário).

### Instruções de Execução
- Incluir um passo-a-passo claro para:
  - Instalar dependências.
  - Configurar variáveis de ambiente.
  - Executar a aplicação.

### Documentação da Aplicação
- Explicações detalhadas sobre o código, arquitetura e justificativas técnicas.
- Descrever como cada parte da aplicação funciona e como os componentes interagem.

---

## Considerações Finais
- **Avaliação de Desempenho**:
  - Desempenho ao lidar com grandes volumes de dados será o foco principal.

- **Justificativas Técnicas**:
  - Justificar escolhas arquiteturais, tecnológicas e bibliotecas.

- **Criatividade e Inovação**:
  - Adicione funcionalidades extras para melhorar eficiência, usabilidade ou manutenibilidade.

---

## Dicas
- **Gerenciamento de Dependências**:
  - Utilize `npm` ou `yarn` e mantenha o `package.json` atualizado.

- **Configurações Sensíveis**:
  - Use variáveis de ambiente (ex: com dotenv) e evite expor informações sensíveis no código.

- **Manutenibilidade**:
  - Estruture o projeto de forma modular para facilitar manutenções futuras.

- **Logs e Monitoramento**:
  - Implementar logs estruturados para facilitar a identificação de problemas.

---

Boa sorte! 🚀
