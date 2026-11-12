import { mkdirSync } from 'fs';
import { join } from 'path';

export function getUploadDir(): string {
  const dir = process.env.UPLOAD_DIR?.trim() || join(process.cwd(), 'uploads');
  mkdirSync(dir, { recursive: true });
  return dir;
}
