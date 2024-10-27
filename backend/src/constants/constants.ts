export const jwtSecret =
  process.env.JWT_SECRET ||
  'DO NOT USE THIS VALUE. INSTEAD, CREATE A COMPLEX SECRET AND KEEP IT SAFE OUTSIDE OF THE SOURCE CODE.';

export const refreshSecret =
  process.env.REFRESH_SECRET ||
  'DO NOT USE THIS VALUE. INSTEAD, CREATE A Refresh SECRET AND KEEP IT SAFE OUTSIDE OF THE SOURCE CODE.';

export const saltRounds = process.env.JWT_SALT || 10;

export const DATABASE_URI =
  process.env.DATABASE_URI || 'mongodb://localhost:27017/test_database';

export const REDIS_HOST = process.env.REDIS_HOST || 'localhost';

export const REDIS_PORT = parseInt(process.env.REDIS_PORT) || 6379;
