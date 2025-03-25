import * as dotenv from 'dotenv';

// Load file .env
dotenv.config();

// Tạo cấu hình nhóm
export const nodeEnv = process.env.NODE_ENV || 'development';
export const port = parseInt(process.env.PORT) || 3000;

export const apiKey = process.env.API_KEY;

export const tokens = {
  user: {
    accessToken: {
      secret: process.env.ACCESS_TOKEN_SECRET,
      ttl: process.env.ACCESS_TOKEN_TTL || '15m',
    },
    refreshToken: {
      secret: process.env.REFRESH_TOKEN_SECRET,
      ttl: process.env.REFRESH_TOKEN_TTL || '7d',
    },
  },
  member: {
    accessToken: {
      secret: process.env.ACCESS_TOKEN_SECRET_FOR_MEMBER,
      ttl: process.env.ACCESS_TOKEN_TTL_FOR_MEMBER || '1d',
    },
    refreshToken: {
      secret: process.env.REFRESH_TOKEN_SECRET_FOR_MEMBER,
      ttl: process.env.REFRESH_TOKEN_TTL_FOR_MEMBER || '30d',
    },
  },
};

export const throttle = {
  ttl: parseInt(process.env.THROTTLE_TTL) || 60,
  limit: parseInt(process.env.THROTTLE_LIMIT) || 10,
};

console.log('nodeEnv:', nodeEnv);

validateEnvVar();

function validateEnvVar() {
  if (!apiKey) {
    throw new Error('API_KEY must be provided');
  }
  if (!tokens.user.accessToken.secret) {
    throw new Error('USER_ACCESS_TOKEN_SECRET must be provided');
  }
  if (!tokens.user.refreshToken.secret) {
    throw new Error('USER_REFRESH_TOKEN_SECRET must be provided');
  }
  if (!tokens.member.accessToken.secret) {
    throw new Error('MEMBER_ACCESS_TOKEN_SECRET must be provided');
  }
  if (!tokens.member.refreshToken.secret) {
    throw new Error('MEMBER_REFRESH_TOKEN_SECRET must be provided');
  }
}
