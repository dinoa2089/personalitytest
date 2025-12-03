require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const https = require('https');
const fs = require('fs');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function upload() {
  const apiUrl = "https://en.wikipedia.org/api/rest_v1/page/summary/Conan_O'Brien";
  
  const json = await new Promise((resolve, reject) => {
    https.get(apiUrl, { headers: { 'User-Agent': 'App/1.0' } }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
  
  const imageUrl = json.thumbnail.source.replace(/\/\d+px-/, '/500px-');
  
  const imageData = await new Promise((resolve, reject) => {
    https.get(imageUrl, { headers: { 'User-Agent': 'App/1.0' } }, res => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
  
  await supabase.storage.from('famous-images').upload('conan-obrien.jpg', imageData, { contentType: 'image/jpeg', upsert: true });
  
  const existing = JSON.parse(fs.readFileSync('./scripts/image-urls.json'));
  existing['conan-obrien'] = 'https://eqkcmlxxuubibzoqliee.supabase.co/storage/v1/object/public/famous-images/conan-obrien.jpg';
  fs.writeFileSync('./scripts/image-urls.json', JSON.stringify(existing, null, 2));
  
  console.log("✅ Conan O'Brien uploaded");
}

upload().catch(console.error);



