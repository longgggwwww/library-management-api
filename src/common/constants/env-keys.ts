import { ConfigService } from '@nestjs/config';

// Tạo một đối tượng cấu hình
const c = new ConfigService();

// Lấy các giá trị từ biến môi trường
export const port = c.get<number>('PORT', 3000);
export const apiKey = c.get<string>('API_KEY');
export const accessTokenSecret = c.get<string>('ACCESS_TOKEN_SECRET'); // Secret cho access token
export const accessTokenTTL = c.get<string>('ACCESS_TOKEN_TTL', '15m'); // Thời gian hết hạn của token
export const refreshTokenSecret = c.get<string>('REFRESH_TOKEN_SECRET'); // Secret cho refresh token
export const refreshTokenTTL = c.get<string>('REFRESH_TOKEN_TTL', '7d');
export const throttleTTL = c.get<number>('THROTTLE_TTL', 10); // Thời gian giới hạn
export const throttleLimit = c.get<number>('THROTTLE_LIMIT', 10); // Số lần truy cập tối đa

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
