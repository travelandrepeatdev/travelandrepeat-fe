import axios from "axios";
import { S3Client } from '@aws-sdk/client-s3';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const accessKeyId = process.env.AWS_BUCKET_ACCESS_KEY_ID || "";
const secretAccessKey = process.env.AWS_BUCKET_SECRET_ACCESS_KEY || "";
const region = process.env.AWS_BUCKET_REGION;
const endpoint = process.env.AWS_BUCKET_ENDPOINT;

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
});

export function setAuthToken(token: string | null) {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common.Authorization;
  }
}

export const awsClient = new S3Client({
  forcePathStyle: true,
  region: region,
  endpoint: endpoint,
  requestChecksumCalculation: "WHEN_REQUIRED",
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  }
});