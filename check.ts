import WebSocket from 'ws';
(globalThis as any).WebSocket = WebSocket;
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://yrrtrgedefzlkeqfcjyj.supabase.co',
  'sb_publishable_QIcLkhskwfm1HXuFEbrcVg_vqXfY1kx'
);

async function run() {
  const tables = ['periods', 'goals', 'non_goals', 'projects', 'tasks'];
  for (const table of tables) {
    console.log(`Checking table: ${table}...`);
    const { data, error } = await supabase.from(table).select('*');
    if (error) {
      console.error(`[Error on ${table}]`, error);
    } else {
      console.log(`[Success on ${table}] rows:`, data.length);
    }
  }
}

run();
