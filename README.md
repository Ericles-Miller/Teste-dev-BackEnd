# Desafio Backend - Node.js com TypeScript

## Objetivo
Criar uma aplicação backend em Node.js utilizando TypeScript que permita:

- O upload de uma planilha com **100 mil linhas**.
- Processar e armazenar os dados em um banco de dados PostgreSQL.
- Disponibilizar uma **API avançada** para acesso a esses dados.

---

## Descrição do Desafio
Desenvolver uma aplicação que atenda aos seguintes requisitos **funcionais** e **não funcionais**, aplicando boas práticas de desenvolvimento e fornecendo explicações detalhadas sobre o código e as escolhas técnicas realizadas.

---

## Requisitos Funcionais

### 1. Upload de Arquivo
- **Endpoint de Upload**:
  - Permitir o upload de uma planilha em formato especificado (ex: CSV ou XLSX).
  - A planilha conterá 100 mil linhas de dados a serem processados.
  - **Swagger**: O upload deve ser possível pela interface interativa da documentação Swagger.

- **Processamento Assíncrono**:
  - Processar o arquivo utilizando **filas** (ex: BullMQ) para garantir que o upload não bloqueie a thread principal.
  - O usuário deve receber uma resposta imediatamente após o envio do arquivo.

- **Feedback de Status**:
  - Implementar uma forma de verificar o status do processamento (ex: "em andamento", "concluído", "erro").
  - O feedback pode ser fornecido por polling em um endpoint específico ou via websockets.

### 2. API de Dados
- **Endpoints**:
  - Listar, filtrar, ordenar e buscar dados armazenados.
  - Retornar dados de forma paginada.

- **Paginação Eficiente**:
  - Utilizar paginação baseada em **cursor** ou **keyset pagination** para garantir performance em grandes volumes de dados.

- **Filtragem e Ordenação Avançadas**:
  - Permitir filtros pelos campos: `GivenName`, `City`, `TropicalZodiac`, `Occupation`, `Vehicle`, `CountryFull`.
  - Suportar múltiplos critérios de ordenação.

- **Informação Adicional no Response**:
  - Incluir a quantidade de registros retornados na página atual.

---

## Requisitos Não Funcionais

### 1. Persistência de Dados
- Banco de dados: **PostgreSQL**.
- Modelagem eficiente com uso de índices e tipos de dados apropriados.

### 2. Processamento Assíncrono e Filas
- Utilizar **BullMQ**, RabbitMQ ou Kafka para gerenciamento do processamento.
- Controlar concorrência para evitar problemas como **race conditions**.

### 3. Escalabilidade e Performance
- **Performance**:
  - Otimizar o tempo de resposta das rotas.
  - Retornar um contador do tempo de execução em cada operação.

- **Escalabilidade**:
  - Documentar como a aplicação pode ser escalada horizontalmente.

- **Cache**:
  - Considerar o uso de cache (ex: Redis) para consultas frequentes.

### 4. Documentação e Boas Práticas
- **Explicação do Código**:
  - Fornecer explicações detalhadas e comentários para esclarecer partes complexas.

- **README**:
  - Incluir instruções claras para configuração e execução do projeto.

- **Documentação da API**:
  - Utilizar **Swagger** para documentar e interagir com os endpoints.

- **Padrões de Código**:
  - Seguir princípios **SOLID** e **DRY**.
  - Usar ferramentas como **ESLint** e **Prettier**.

---

## Diferenciais
- **Deploy via Vercel**:
  - Demonstrar a entrega da aplicação hospedada na plataforma Vercel.
  
- **Logs e Monitoramento**:
  - Implementar logs estruturados para facilitar identificação de problemas.

---

## Instruções de Entrega
1. Disponibilizar o código em um repositório público ou privado no GitHub.
2. Incluir:
   - Instruções claras de instalação e configuração no `README.md`.
   - Scripts para inicialização e deploy local.
   - Documentação detalhada no Swagger.

---

## Dicas
- Utilize variáveis de ambiente para configurações sensíveis com o auxílio de bibliotecas como **dotenv**.
- Estruture o projeto de forma modular para facilitar manutenção e escalabilidade.
- Garanta a clareza do código e da documentação para demonstrar domínio técnico.

---

## Avaliação
O desafio será avaliado com base em:
1. **Desempenho**:
   - Tempo de processamento do upload e resposta da API.
2. **Justificativas Técnicas**:
   - Decisões arquiteturais e tecnológicas.
3. **Criatividade e Inovação**:
   - Funcionalidades extras que agreguem valor.
4. **Documentação**:
   - Qualidade e clareza do `README.md` e dos comentários no código.

Boa sorte!
