import { z } from 'zod';

export const updateOrganizationSchema = z.object({
  name: z
    .string()
    .min(2, 'Organization name must be at least 2 characters long'),
  description: z
    .string()
    .min(10, 'Organization name must be at least 10 characters long')
    .max(300),
});
