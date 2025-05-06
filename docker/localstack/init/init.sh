#!/bin/bash

echo "Aguardando LocalStack inicializar..."
sleep 10  # Espera simples de 10 segundos

echo "LocalStack está pronto!"

# Criar tópico SNS
echo "Criando tópico SNS..."
TOPIC_ARN=$(awslocal sns create-topic \
  --name status-file \
  --region us-east-1 \
  --query 'TopicArn' \
  --output text)

echo "Tópico SNS criado com ARN: $TOPIC_ARN"

# Criar arquivo temporário para a função Lambda
echo "Preparando função Lambda..."
mkdir -p /tmp/lambda
cat > /tmp/lambda/index.js << 'EOF'
exports.handler = async (event) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Status processed successfully',
            event: event
        })
    };
};
EOF

# Criar arquivo ZIP da função Lambda
cd /tmp/lambda
zip function.zip index.js

# Criar função Lambda
echo "Criando função Lambda..."
LAMBDA_ARN=$(awslocal lambda create-function \
  --function-name process-file-status \
  --runtime nodejs18.x \
  --handler index.handler \
  --role arn:aws:iam::000000000000:role/lambda-role \
  --zip-file fileb://function.zip \
  --region us-east-1 \
  --query 'FunctionArn' \
  --output text)

echo "Função Lambda criada com ARN: $LAMBDA_ARN"

# Configurar permissão para o SNS invocar a Lambda
echo "Configurando permissão Lambda..."
awslocal lambda add-permission \
  --function-name process-file-status \
  --statement-id sns-invoke \
  --action lambda:InvokeFunction \
  --principal sns.amazonaws.com \
  --source-arn "$TOPIC_ARN" \
  --region us-east-1

# Criar inscrição SNS -> Lambda
echo "Criando inscrição SNS -> Lambda..."
awslocal sns subscribe \
  --topic-arn "$TOPIC_ARN" \
  --protocol lambda \
  --notification-endpoint "$LAMBDA_ARN" \
  --region us-east-1

echo "Verificando recursos criados..."
echo "Tópicos SNS:"
awslocal sns list-topics --region us-east-1
echo "Funções Lambda:"
awslocal lambda list-functions --region us-east-1

echo "Configuração concluída com sucesso!" 