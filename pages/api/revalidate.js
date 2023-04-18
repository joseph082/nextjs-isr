// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
  await res.revalidate(req.query.path || '/');
  // await res.revalidate('/');
  // await res.revalidate('/profile');
  return res.status(200).json({ revalidated: true });
}
