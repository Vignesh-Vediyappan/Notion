#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 Notion-Style Web App Setup');
console.log('==============================\n');

async function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setup() {
  try {
    // Check if .env.local already exists
    const envPath = path.join(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      const overwrite = await question('.env.local already exists. Overwrite? (y/N): ');
      if (overwrite.toLowerCase() !== 'y') {
        console.log('Setup cancelled.');
        process.exit(0);
      }
    }

    console.log('Please provide your Supabase credentials:');
    console.log('(You can find these in your Supabase dashboard under Settings > API)\n');

    const supabaseUrl = await question('Supabase Project URL: ');
    const supabaseAnonKey = await question('Supabase Anon Key: ');

    if (!supabaseUrl || !supabaseAnonKey) {
      console.log('❌ Both URL and Anon Key are required.');
      process.exit(1);
    }

    // Create .env.local file
    const envContent = `NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseAnonKey}
`;

    fs.writeFileSync(envPath, envContent);

    console.log('\n✅ Environment variables configured!');
    console.log('\n📋 Next steps:');
    console.log('1. Run the database schema in your Supabase SQL Editor:');
    console.log('   - Copy the contents of database-schema.sql');
    console.log('   - Paste and run in Supabase SQL Editor');
    console.log('\n2. Install dependencies:');
    console.log('   npm install');
    console.log('\n3. Start the development server:');
    console.log('   npm run dev');
    console.log('\n4. Open http://localhost:3000 in your browser');
    console.log('\n🎉 Happy coding!');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

setup(); 