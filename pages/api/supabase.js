// import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs';
// const supabase = createMiddlewareSupabaseClient();
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.SUPABASE_DATABASE_URL, process.env.SUPABASE_DATABASE_KEY);

// export const config = {
//   runtime: 'experimental-edge',
// };

export default async function handler(req, res) {
  return res.status(200).send(await supabase.storage.from('pdfs').list(''));
}
