#!/bin/bash

# Obter ARN do tópico SNS
TOPIC_ARN=$(docker run --network host --rm \
  -e AWS_ACCESS_KEY_ID=test \
  -e AWS_SECRET_ACCESS_KEY=test \
  amazon/aws-cli \
  --endpoint-url=http://localhost:4566 \
  sns list-topics \
  --region us-east-1 \
  --query 'Topics[0].TopicArn' \
  --output text)

# Obter ARN da função Lambda
LAMBDA_ARN=$(docker run --network host --rm \
  -e AWS_ACCESS_KEY_ID=test \
  -e AWS_SECRET_ACCESS_KEY=test \
  amazon/aws-cli \
  --endpoint-url=http://localhost:4566 \
  lambda list-functions \
  --region us-east-1 \
  --query 'Functions[?FunctionName==`process-file-status`].FunctionArn' \
  --output text)

# Criar inscrição SNS -> Lambda
echo "Criando inscrição SNS -> Lambda..."
docker run --network host --rm \
  -e AWS_ACCESS_KEY_ID=test \
  -e AWS_SECRET_ACCESS_KEY=test \
  amazon/aws-cli \
  --endpoint-url=http://localhost:4566 \
  sns subscribe \
  --topic-arn "$TOPIC_ARN" \
  --protocol lambda \
  --notification-endpoint "$LAMBDA_ARN" \
  --region us-east-1

echo "Configuração concluída!" 