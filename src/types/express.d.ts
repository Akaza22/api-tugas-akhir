// src/types/express/index.d.ts
import { User } from '../models';
import { Multer } from 'multer';

declare global {
  namespace Express {
    interface Request {
      user?: InstanceType<typeof User> & {
        role: { name: string };
      };
      files?: { [fieldname: string]: Express.Multer.File[]; } | Express.Multer.File[] | undefined;
      file?: Express.Multer.File;
    }
  }
}

export {};
