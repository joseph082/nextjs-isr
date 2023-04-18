import { PrismaClient } from '@prisma/client';
import { PrismaClient as PrismaClientEdge } from '@prisma/client/edge';

// ts
const globalForPrisma = global;
//  as unknown as {
//   prisma: PrismaClient | undefined
// }

// $ npx prisma generate --data-proxy

// export const prismaEdge =
//   globalForPrisma.prismaEdge ??
//   new PrismaClientEdge({
//     log: ['query'],
//   });

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClientEdge({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
  // globalForPrisma.prismaEdge = prismaEdge;
}
