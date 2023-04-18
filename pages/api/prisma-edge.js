// import { prisma } from '../../prisma/db';
// import { PrismaClient } from '@prisma/client/edge';
import { prisma } from '../../prisma/db';

export const config = {
  runtime: 'experimental-edge',
};

export default async function handler(req) {
  return new Response(JSON.stringify({ jobs: await prisma.job.findMany() }, null, 2), {
    status: 200,
    headers: {
      'content-type': 'application/json',
    },
  });
}
