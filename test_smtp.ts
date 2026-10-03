import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSmtp(email: string) {
  console.log(`Sending test magic link to ${email}...`);
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
  });

  if (error) {
    console.error('SMTP Test Failed! ❌');
    console.error('Error details:', error);
  } else {
    console.log('SMTP Test API Call Succeeded! ✅');
    console.log('Please check your inbox to see if the email actually arrived.');
  }
}

const emailArg = process.argv[2];
if (!emailArg) {
  console.error('Please provide an email address as an argument.');
  console.error('Usage: npx tsx test_smtp.ts <your-email>');
  process.exit(1);
}

testSmtp(emailArg);
