import * as crypto from 'crypto';
import * as path from 'path';

// Tạo tên file duy nhất
export function uniqueFilename(origName: string): string {
  const ext = path.extname(origName);
  const hash = crypto
    .createHash('md5')
    .update(Date.now().toString())
    .digest('hex');
  return `${hash}${ext}`;
}
