import * as dotenv from 'dotenv';

// Load file .env
dotenv.config();

// Tạo một đối tượng cấu hình

// Lấy các giá trị từ biến môi trường
export const nodeEnv = process.env.NODE_ENV || 'development';
export const port = parseInt(process.env.PORT) || 3000;
export const apiKey = process.env.API_KEY;
export const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
export const accessTokenTTL = process.env.ACCESS_TOKEN_TTL || '15m';
export const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
export const refreshTokenTTL = process.env.REFRESH_TOKEN_TTL || '7d';
export const throttleTTL = parseInt(process.env.THROTTLE_TTL) || 60;
export const throttleLimit = parseInt(process.env.THROTTLE_LIMIT) || 10;

console.log('nodeEnv:', nodeEnv);

validateEnvVar();

function validateEnvVar() {
  if (!apiKey) {
    throw new Error('API_KEY must be provided');
  }
  if (!accessTokenSecret) {
    throw new Error('ACCESS_TOKEN_SECRET must be provided');
  }
  if (!refreshTokenSecret) {
    throw new Error('REFRESH_TOKEN_SECRET must be provided');
  }
}
