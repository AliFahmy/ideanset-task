export const jwtSecret =
  process.env.JWT_SECRET ||
  'DO NOT USE THIS VALUE. INSTEAD, CREATE A COMPLEX SECRET AND KEEP IT SAFE OUTSIDE OF THE SOURCE CODE.';

export const refreshSecret =
  process.env.REFRESH_SECRET ||
  'DO NOT USE THIS VALUE. INSTEAD, CREATE A Refresh SECRET AND KEEP IT SAFE OUTSIDE OF THE SOURCE CODE.';

export const saltRounds = process.env.JWT_SALT || 10;
