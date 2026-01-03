import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // @ts-ignore
  if (!(global as any).prisma) {
    (global as any).prisma = new PrismaClient();
  }
  // @ts-ignore
  prisma = (global as any).prisma;
}

export default prisma; 