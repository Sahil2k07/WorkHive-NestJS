import type { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user: {
        email: string;
        id: string;
        role: 'Student' | 'Recruiter';
      };
      files: {
        profilePhoto: File;
        logo: File;
      };
    }
  }
}
