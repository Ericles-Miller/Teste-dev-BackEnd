#!/bin/bash

echo "Aguardando LocalStack inicializar..."
sleep 10

echo "LocalStack está pronto!"

# Criar tópico SNS
echo "Verificando/Criando tópico SNS..."
TOPIC_ARN=$(awslocal sns list-topics --region us-east-1 --query 'Topics[?contains(TopicArn, `status-file`)].TopicArn' --output text)
if [ -z "$TOPIC_ARN" ]; then
    TOPIC_ARN=$(awslocal sns create-topic --name status-file --region us-east-1 --query 'TopicArn' --output text)
    echo "Tópico SNS criado com ARN: $TOPIC_ARN"
else
    echo "Tópico SNS já existe com ARN: $TOPIC_ARN"
fi

echo "Verificando recursos criados..."
echo "Tópicos SNS:"
awslocal sns list-topics --region us-east-1
echo "Inscrições SNS:"
awslocal sns list-subscriptions --region us-east-1

echo "Configuração concluída com sucesso!" 