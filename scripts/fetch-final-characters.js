/**
 * Final attempt for remaining characters
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const https = require('https');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const BUCKET_NAME = 'famous-images';

// Last two - try actor pages as fallback
const charactersToFetch = [
  { id: 'spencer-reid', name: 'Spencer Reid', wiki: 'Matthew_Gray_Gubler' }, // Actor
  { id: 'tchalla', name: 'T\'Challa', wiki: 'Chadwick_Boseman' }, // Actor - has iconic Black Panther image
];

function getWikiImageUrl(wikiTitle) {
  return new Promise((resolve, reject) => {
    const apiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiTitle)}`;
    
    https.get(apiUrl, {
      headers: {
        'User-Agent': 'PersonalityTestApp/1.0',
        'Accept': 'application/json',
      }
    }, (response) => {
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.thumbnail && json.thumbnail.source) {
            resolve(json.thumbnail.source.replace(/\/\d+px-/, '/500px-'));
          } else {
            reject(new Error('No image'));
          }
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function downloadImage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: { 'User-Agent': 'PersonalityTestApp/1.0', 'Accept': 'image/*' }
    }, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        downloadImage(response.headers.location).then(resolve).catch(reject);
        return;
      }
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }
      const chunks = [];
      response.on('data', chunk => chunks.push(chunk));
      response.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

function getExtension(url) {
  const match = url.match(/\.(jpg|jpeg|png|gif|webp)/i);
  return match ? `.${match[1].toLowerCase()}` : '.jpg';
}

async function processOne(character) {
  try {
    console.log(`🔍 ${character.name}...`);
    const imageUrl = await getWikiImageUrl(character.wiki);
    const imageData = await downloadImage(imageUrl);
    const ext = getExtension(imageUrl);
    const fileName = `${character.id}${ext}`;
    
    await supabase.storage.from(BUCKET_NAME).upload(fileName, imageData, {
      contentType: `image/${ext.slice(1) === 'jpg' ? 'jpeg' : ext.slice(1)}`,
      upsert: true,
    });
    
    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName);
    console.log(`   ✅ Done`);
    return { id: character.id, url: data.publicUrl };
  } catch (err) {
    console.log(`   ❌ ${err.message}`);
    return null;
  }
}

async function main() {
  let existing = JSON.parse(fs.readFileSync(path.join(__dirname, 'image-urls.json')));
  
  for (const character of charactersToFetch) {
    const result = await processOne(character);
    if (result) existing[result.id] = result.url;
    await new Promise(r => setTimeout(r, 500));
  }
  
  fs.writeFileSync(path.join(__dirname, 'image-urls.json'), JSON.stringify(existing, null, 2));
  console.log('\nDone!');
}

main().catch(console.error);



