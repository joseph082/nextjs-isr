// import { prisma } from '../../prisma/db';

// import { PrismaClient } from '@prisma/client';
import { prisma } from '../../prisma/db';

// export const config = {
//   runtime: 'experimental-edge',
// };

// const prisma = new PrismaClient();
export default async function handler(req, res) {
  return (
    res
      .status(200)
      // .type('application/json')
      .send(JSON.stringify(await prisma.job.findMany(), null, 2))
  );
}
