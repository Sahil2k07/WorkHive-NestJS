import * as z from 'zod';

export const postJobSchema = z.object({
  title: z.string().trim(),
  description: z.string().trim(),
  requirements: z.array(z.string().trim()),
  salary: z.union([z.string().trim(), z.number()]),
  location: z.string().trim(),
  jobType: z.string().trim(),
  experience: z.union([z.string().trim(), z.number()]),
  position: z.union([z.string().trim(), z.number()]),
  companyId: z.string().trim(),
});

export type PostJobDto = z.infer<typeof postJobSchema>;

export const updateJobSchema = z.object({
  title: z.string().trim(),
  description: z.string().trim(),
  requirements: z.array(z.string().trim()),
  salary: z.union([z.string().trim(), z.number()]),
  experienceLevel: z.union([z.string().trim(), z.number()]),
  location: z.string().trim(),
  jobType: z.string().trim(),
  position: z.union([z.string().trim(), z.number()]),
});

export type UpdateJobDto = z.infer<typeof updateJobSchema>;
