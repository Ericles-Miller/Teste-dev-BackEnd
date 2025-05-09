#!/bin/bash

# Criar diretório temporário
mkdir -p temp

# Copiar arquivo da função Lambda
cp lambda/process-file-status/index.js temp/

# Criar arquivo ZIP
cd temp
zip function.zip index.js
cd ..

echo "Criando função Lambda..."
docker run --network host --rm \
  -e AWS_ACCESS_KEY_ID=test \
  -e AWS_SECRET_ACCESS_KEY=test \
  -v "$(pwd)/temp/function.zip:/function.zip" \
  amazon/aws-cli \
  --endpoint-url=http://localhost:4566 \
  lambda create-function \
  --function-name process-file-status \
  --runtime nodejs18.x \
  --handler index.handler \
  --role arn:aws:iam::000000000000:role/lambda-role \
  --zip-file fileb:///function.zip \
  --region us-east-1

# Limpar arquivos temporários
rm -rf temp

echo "Função Lambda criada com sucesso!" 