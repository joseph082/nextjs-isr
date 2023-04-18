// import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs';
// const supabase = createMiddlewareSupabaseClient();
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(
  process.env.WEST_SUPABASE_DATABASE_URL,
  process.env.WEST_SUPABASE_DATABASE_KEY
);

export const config = {
  runtime: 'experimental-edge',
};

export default async function handler(req) {
  // return res.status(200).send(await supabase.storage.from('pdfs').list(''));
  const { data, error } = await supabase.from('Job').select();
  // const pdfs = { pdfs: await supabase.storage.from('pdfs').list('') };
  return new Response(JSON.stringify({ data }, null, 2), {
    status: 200,
    headers: {
      'content-type': 'application/json',
    },
  });
}
