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

# Como depurar os serviços API e RMQ Process

Este guia explica como configurar e utilizar o modo de depuração para os serviços API e RMQ Process.

## Pré-requisitos

- Node.js instalado
- VSCode (Visual Studio Code)
- Serviços necessários (PostgreSQL, RabbitMQ, Redis, etc.) em execução via Docker Compose

## Passo a passo para depuração

### 1. Iniciar os serviços de infraestrutura

Primeiro, inicie os serviços de infraestrutura usando o Docker Compose:

```bash
docker-compose up -d
```

### 2. Iniciar o serviço em modo debug

Para iniciar a API em modo debug:
```bash
npm run start:debug:api
```

Para iniciar o serviço RMQ Process em modo debug:
```bash
npm run start:debug:rmq-process
```

### 3. Configurar o VSCode para depuração

Crie ou edite o arquivo `.vscode/launch.json` com as seguintes configurações:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "attach",
      "name": "Debug API",
      "port": 9229,
      "restart": true,
      "sourceMaps": true,
      "outFiles": ["${workspaceFolder}/dist/**/*.js"]
    },
    {
      "type": "node",
      "request": "attach",
      "name": "Debug RMQ Process",
      "port": 9230,
      "restart": true,
      "sourceMaps": true,
      "outFiles": ["${workspaceFolder}/dist/**/*.js"]
    }
  ]
}
```

### 4. Iniciar a sessão de depuração no VSCode

1. Abra o VSCode e navegue até a aba de depuração (ícone de "bug" na barra lateral)
2. Selecione "Debug API" ou "Debug RMQ Process" na lista suspensa, dependendo do serviço que você deseja depurar
3. Clique no botão de "Play" para iniciar a sessão de depuração

### 5. Definir pontos de interrupção (breakpoints)

1. Abra os arquivos fonte onde deseja depurar
2. Clique à esquerda do número da linha para definir um ponto de interrupção (aparecerá um círculo vermelho)
3. Quando a execução atingir essa linha, o código pausará e você poderá inspecionar variáveis, a pilha de chamadas, etc.

### 6. Depuração com Hot Reload

Ambos os comandos de debug incluem a flag `--watch`, que permite o hot reload. Isso significa que você pode fazer alterações no código e elas serão aplicadas automaticamente sem precisar reiniciar o processo.

### 7. Desconectar a depuração

Para encerrar a sessão de depuração:
1. Clique no botão "Stop" (quadrado vermelho) na barra de ferramentas de depuração do VSCode
2. Para parar o processo Node.js, pressione Ctrl+C no terminal onde o processo está em execução

## Recursos adicionais

- As configurações de depuração para API usam a porta 9229
- As configurações de depuração para RMQ Process usam a porta 9230
- Você pode inspecionar variáveis, avaliar expressões e observar o fluxo de execução durante a depuração

## Solução de problemas comuns

### O depurador não se conecta

- Verifique se o serviço foi iniciado com o comando de depuração correto
- Confirme se não há outro processo usando a mesma porta
- Verifique se o firewall não está bloqueando as conexões

### Breakpoints não são atingidos

- Verifique se os arquivos de origem no editor correspondem aos arquivos sendo executados
- Confirme se a compilação TypeScript gerou os source maps corretamente
- Tente recompilar o projeto antes de iniciar a depuração