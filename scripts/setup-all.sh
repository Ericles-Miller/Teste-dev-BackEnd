#!/bin/bash

echo "Iniciando configuração do ambiente..."

# 1. Criar função Lambda
echo "Criando função Lambda..."
./create-lambda.sh

# 2. Criar tópico SNS
echo "Criando tópico SNS..."
docker run --network host --rm \
  -e AWS_ACCESS_KEY_ID=test \
  -e AWS_SECRET_ACCESS_KEY=test \
  amazon/aws-cli \
  --endpoint-url=http://localhost:4566 \
  sns create-topic \
  --name status-file \
  --region us-east-1

# 3. Configurar inscrição SNS -> Lambda
echo "Configurando inscrição SNS -> Lambda..."
./setup-sns-lambda.sh

echo "Configuração concluída com sucesso!" 