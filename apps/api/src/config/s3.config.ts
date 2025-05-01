import { InternalServerErrorException } from '@nestjs/common';
import { S3 } from 'aws-sdk';

export class S3Config {
  private static instance: S3;
  private static bucketName: string;

  public static getInstance(): S3 {
    if (!this.instance) {
      const isDevelopment = process.env.NODE_ENV !== 'production';

      const config: S3.ClientConfiguration = {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'test',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'test',
        region: process.env.AWS_REGION || 'us-east-1',
      };

      if (isDevelopment) {
        config.endpoint = process.env.AWS_ENDPOINT || 'http://localhost:4566';
        config.s3ForcePathStyle = true;
      }

      this.instance = new S3(config);
    }

    return this.instance;
  }

  public static getBucketName(): string {
    if (!this.bucketName) {
      this.bucketName = process.env.AWS_BUCKET_NAME || 'csv-uploads';
    }
    return this.bucketName;
  }

  public static async ensureBucketExists(): Promise<void> {
    const s3 = this.getInstance();
    const bucketName = this.getBucketName();

    try {
      await s3.headBucket({ Bucket: bucketName }).promise();
    } catch (error) {
      if (error.code === 'NotFound' || error.code === 'NoSuchBucket') {
        await s3.createBucket({ Bucket: bucketName }).promise();
      } else {
        throw new InternalServerErrorException('Error to Create a new Bucket!');
      }
    }
  }

  public static async saveObject(
    key: string,
    data: any,
    contentType: string = 'application/json',
  ): Promise<string> {
    const s3 = this.getInstance();
    const bucketName = this.getBucketName();

    await s3
      .putObject({
        Bucket: bucketName,
        Key: key,
        Body: typeof data === 'string' ? data : JSON.stringify(data),
        ContentType: contentType,
      })
      .promise();

    return `s3://${bucketName}/${key}`;
  }
}
