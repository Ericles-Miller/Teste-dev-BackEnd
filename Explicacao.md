# Explicação do Projeto

## Configuração do LocalStack

### Executando o Script de Inicialização

Para configurar o LocalStack com o tópico SNS necessário, siga estes passos:

1. Primeiro, certifique-se de que o container do LocalStack está rodando:
```bash
docker ps | grep localstack
```

2. Entre no container do LocalStack:
```bash
docker exec -it localstack bash
```

3. Dentro do container, execute os seguintes comandos para configurar o SNS:

```bash
# Criar o tópico SNS
awslocal sns create-topic --name status-file --region us-east-1

# Verificar se o tópico foi criado
awslocal sns list-topics --region us-east-1

# Verificar as inscrições
awslocal sns list-subscriptions --region us-east-1
```

Alternativamente, você pode executar todos os comandos de uma vez:
```bash
docker exec -it localstack bash -c "awslocal sns create-topic --name status-file --region us-east-1 && awslocal sns list-topics --region us-east-1 && awslocal sns list-subscriptions --region us-east-1"
```

Após a execução, você deverá ver a confirmação de que o tópico foi criado e as informações sobre as inscrições.

docker run --network host --rm -e AWS_ACCESS_KEY_ID=test -e AWS_SECRET_ACCESS_KEY=test amazon/aws-cli --endpoint-url=http://localhost:4566 sns create-topic --name status-file --region us-east-1

docker exec localstack /docker-entrypoint-initaws.d/init.sh