import { createClient } from '@supabase/supabase-js';
const supabase = createClient(
  process.env.WEST_SUPABASE_DATABASE_URL,
  process.env.WEST_SUPABASE_DATABASE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false } }
);

export default async function handler(req, res) {
  const { data, error } = await supabase.from('Job').select();
  return res.status(200).send(JSON.stringify({ data }, null, 2));
}
