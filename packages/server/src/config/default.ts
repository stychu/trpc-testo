import path from 'path';

require('dotenv').config({ path: path.join(__dirname, '../../.env') });

export const defaultConfig: { port: number; origin: string; } = {
  port: 8000,
  origin: process.env.ORIGIN as unknown as string,
} as const;
