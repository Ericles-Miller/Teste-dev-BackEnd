docker run --network host --rm -e AWS_ACCESS_KEY_ID=test -e AWS_SECRET_ACCESS_KEY=test amazon/aws-cli --endpoint-url=http://localhost:4566 sns create-topic --name status-file --region us-east-1

docker exec localstack /docker-entrypoint-initaws.d/init.sh