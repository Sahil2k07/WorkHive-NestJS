import * as z from 'zod';

export const registerCompanySchema = z.object({
  name: z.string().trim(),
});

export type RegisterCompanyDto = z.infer<typeof registerCompanySchema>;

export const updateCompanySchema = z
  .object({
    name: z.string().trim().optional(),
    description: z.string().trim().optional(),
    website: z.string().trim().optional(),
    location: z.string().trim().optional(),
  })
  .passthrough();

export type UpdateCompanyDto = z.infer<typeof updateCompanySchema>;
