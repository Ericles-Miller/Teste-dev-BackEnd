
# Processamento de Dados com Upload Assíncrono

## Arquitetura

Este projeto implementa uma arquitetura distribuída para processamento de grandes arquivos CSV, com os seguintes componentes:

1. **API (NestJS)**
   - Recebe o arquivo CSV via endpoint de upload
   - Processa o arquivo em streaming
   - Envia os dados para fila RabbitMQ em batches
   - Gerencia status via Redis

2. **Worker (RabbitMQ Consumer)**
   - Processa as mensagens da fila
   - Armazena os dados no S3
   - Persiste as informações no PostgreSQL

3. **Infraestrutura**
   - PostgreSQL para armazenamento persistente
   - RabbitMQ para filas e mensageria
   - Redis para cache e status
   - S3 (AWS ou LocalStack) para armazenamento de arquivos

## Ambientes

O sistema suporta dois ambientes:

1. **Desenvolvimento**
   - Usa LocalStack para simular o S3 da AWS localmente
   - Facilita o desenvolvimento sem custos de infraestrutura na nuvem

2. **Produção**
   - Usa o S3 da AWS diretamente
   - Requer configuração de credenciais AWS válidas

## Configuração

1. **Variáveis de Ambiente**

   Crie um arquivo `.env` baseado no `.env.example`:

   ```bash
   cp .env.example .env
   ```

   Configure as variáveis de acordo com seu ambiente:

   - Para desenvolvimento: `NODE_ENV=development`
   - Para produção: `NODE_ENV=production`

2. **Configurações AWS/S3**

   - Para desenvolvimento (LocalStack):
     ```
     AWS_ENDPOINT=http://localhost:4566
     AWS_ACCESS_KEY_ID=test
     AWS_SECRET_ACCESS_KEY=test
     ```

   - Para produção:
     ```
     # Remova ou comente a linha AWS_ENDPOINT
     AWS_ACCESS_KEY_ID=sua_chave_de_acesso_real
     AWS_SECRET_ACCESS_KEY=sua_chave_secreta_real
     ```

## Fluxo de Dados

1. **Upload de Arquivo**
   - O arquivo CSV é enviado via API
   - O arquivo é temporariamente salvo em `./uploads`
   - Validações iniciais são aplicadas (formato, cabeçalhos)

2. **Processamento em Stream**
   - O arquivo é lido em streaming
   - Dados são agrupados em batches (1000 registros por padrão)
   - Cada batch é enviado para o RabbitMQ
   - Status do processamento é atualizado no Redis

3. **Processamento Assíncrono**
   - Worker consome mensagens do RabbitMQ
   - Cada batch é salvo no S3 (AWS ou LocalStack)
   - Dados são inseridos no PostgreSQL
   - Status final é atualizado no Redis

4. **Estrutura no S3**
   ```
   bucket/
   └── uploads/
       └── {uploadId}/
           ├── batch-1704121345678.json
           ├── batch-1704121346789.json
           └── batch-1704121347890.json
   ```

## Execução

1. **Iniciar Dependências**
   ```bash
   docker-compose up -d
   ```

2. **Iniciar API**
   ```bash
   npm run start:api
   ```

3. **Iniciar Worker**
   ```bash
   npm run start:worker
   ```

## Monitoramento

- Status do processamento pode ser consultado via endpoint específico
- Logs detalhados em cada etapa do processamento
- Interface do RabbitMQ disponível em `http://localhost:15672`

## Escalabilidade

- Adicione mais instâncias do worker para maior capacidade de processamento
- Configure mais CPU/memória para o RabbitMQ em caso de alta demanda
- Utilize réplicas do PostgreSQL para balanceamento de carga

## Segurança

- Em produção, use IAM roles com permissões mínimas necessárias
- Proteja os endpoints com autenticação e autorização
- Implemente criptografia para dados sensíveis