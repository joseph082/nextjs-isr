// import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs';
// const supabase = createMiddlewareSupabaseClient();
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.SUPABASE_DATABASE_URL, process.env.SUPABASE_DATABASE_KEY);

export const config = {
  runtime: 'experimental-edge',
};

export default async function handler(req) {
  // return res.status(200).send(await supabase.storage.from('pdfs').list(''));
  const { data, error } = await supabase.from('Job').select();
  return new Response(
    JSON.stringify({ pdfs: await supabase.storage.from('pdfs').list(''), data }, null, 2),
    {
      status: 200,
      headers: {
        'content-type': 'application/json',
      },
    }
  );
}
