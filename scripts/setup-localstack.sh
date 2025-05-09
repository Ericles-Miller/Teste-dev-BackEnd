#!/bin/bash

echo "Iniciando LocalStack..."
docker run -d \
  --name localstack \
  -p 4566:4566 \
  -p 4510-4559:4510-4559 \
  -e SERVICES=sns,s3,lambda \
  -e DEBUG=1 \
  -e AWS_DEFAULT_REGION=us-east-1 \
  -e AWS_ACCESS_KEY_ID=test \
  -e AWS_SECRET_ACCESS_KEY=test \
  localstack/localstack:latest

echo "Aguardando LocalStack iniciar..."
sleep 10

echo "Criando tópico SNS..."
docker run --network host --rm \
  -e AWS_ACCESS_KEY_ID=test \
  -e AWS_SECRET_ACCESS_KEY=test \
  amazon/aws-cli \
  --endpoint-url=http://localhost:4566 \
  sns create-topic \
  --name status-file \
  --region us-east-1

echo "Criando bucket S3..."
docker run --network host --rm \
  -e AWS_ACCESS_KEY_ID=test \
  -e AWS_SECRET_ACCESS_KEY=test \
  amazon/aws-cli \
  --endpoint-url=http://localhost:4566 \
  s3 mb s3://upload-bucket \
  --region us-east-1

echo "Configuração concluída!" 