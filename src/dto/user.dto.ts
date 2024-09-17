import * as z from 'zod';

export const signupSchema = z
  .object({
    name: z.string().trim(),
    email: z.string().trim().email({ message: 'Invalid Email' }),
    phoneNumber: z.string().trim(),
    password: z.string().trim(),
    role: z.enum(['Recruiter', 'Student']),
  })
  .passthrough();

export type SignupDto = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.string().trim().email({ message: 'Invalid Email' }),
  password: z.string().trim(),
  role: z.enum(['Student', 'Recruiter']),
});

export type LoginDto = z.infer<typeof loginSchema>;

export const updateProfileSchema = z
  .object({
    email: z.string().trim().email({ message: 'Invalid Email' }),
    name: z.string().trim().optional(),
    phoneNumber: z.string().trim().optional(),
    bio: z.string().trim().optional(),
    skills: z.array(z.string()).optional(),
    resumeOriginalName: z.string().trim().optional(),
  })
  .passthrough();

export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;
