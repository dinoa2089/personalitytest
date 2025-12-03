/**
 * Fetch remaining character images using movie/poster pages
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const https = require('https');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const BUCKET_NAME = 'famous-images';

// Remaining characters - try movie/franchise pages
const charactersToFetch = [
  { id: 'q-bond', name: 'Q', wiki: 'Desmond_Llewelyn' }, // Classic Q
  { id: 'captain-america', name: 'Captain America', wiki: 'Captain_America' }, // Try character page
  { id: 'samwise-gamgee', name: 'Samwise Gamgee', wiki: 'The_Lord_of_the_Rings:_The_Fellowship_of_the_Ring' },
  { id: 'king-tchaka', name: 'King T\'Chaka', wiki: 'Black_Panther_(film)' },
  { id: 'indiana-jones', name: 'Indiana Jones', wiki: 'Raiders_of_the_Lost_Ark' },
  { id: 'belle', name: 'Belle', wiki: 'Beauty_and_the_Beast_(2017_film)' },
  { id: 'harvey-specter', name: 'Harvey Specter', wiki: 'Harvey_Specter' },
  { id: 'spencer-reid', name: 'Spencer Reid', wiki: 'Spencer_Reid' },
  { id: 'marge-simpson', name: 'Marge Simpson', wiki: 'The_Simpsons' },
  { id: 'tchalla', name: 'T\'Challa', wiki: 'T%27Challa' },
];

function getWikiImageUrl(wikiTitle) {
  return new Promise((resolve, reject) => {
    const apiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiTitle)}`;
    
    https.get(apiUrl, {
      headers: {
        'User-Agent': 'PersonalityTestApp/1.0 (contact@example.com)',
        'Accept': 'application/json',
      }
    }, (response) => {
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.originalimage && json.originalimage.source) {
            let imageUrl = json.originalimage.source;
            if (json.thumbnail && json.thumbnail.source) {
              imageUrl = json.thumbnail.source.replace(/\/\d+px-/, '/500px-');
            }
            resolve(imageUrl);
          } else if (json.thumbnail && json.thumbnail.source) {
            let imageUrl = json.thumbnail.source.replace(/\/\d+px-/, '/500px-');
            resolve(imageUrl);
          } else {
            reject(new Error('No image found'));
          }
        } catch (e) {
          reject(e);
        }
      });
      response.on('error', reject);
    }).on('error', reject);
  });
}

function downloadImage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'PersonalityTestApp/1.0 (contact@example.com)',
        'Accept': 'image/*',
      }
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
      response.on('error', reject);
    }).on('error', reject);
  });
}

function getExtension(url) {
  const match = url.match(/\.(jpg|jpeg|png|gif|webp|svg)/i);
  return match ? `.${match[1].toLowerCase()}` : '.jpg';
}

async function processOne(character) {
  try {
    console.log(`🔍 ${character.name} (${character.wiki})...`);
    
    const imageUrl = await getWikiImageUrl(character.wiki);
    console.log(`   Found: ${imageUrl.substring(0, 60)}...`);
    
    const imageData = await downloadImage(imageUrl);
    
    const ext = getExtension(imageUrl);
    const fileName = `${character.id}${ext}`;
    
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, imageData, {
        contentType: `image/${ext.slice(1) === 'jpg' ? 'jpeg' : ext.slice(1)}`,
        upsert: true,
      });
    
    if (error) throw error;
    
    const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName);
    console.log(`   ✅ Uploaded!`);
    return { id: character.id, url: urlData.publicUrl };
  } catch (err) {
    console.log(`   ❌ ${err.message}`);
    return null;
  }
}

async function main() {
  console.log('🎬 Fetching remaining character images\n');
  
  let existing = {};
  try {
    existing = JSON.parse(fs.readFileSync(path.join(__dirname, 'image-urls.json')));
  } catch (e) {}
  
  let successCount = 0;
  
  for (const character of charactersToFetch) {
    const result = await processOne(character);
    if (result) {
      existing[result.id] = result.url;
      successCount++;
    }
    await new Promise(r => setTimeout(r, 500));
  }
  
  fs.writeFileSync(path.join(__dirname, 'image-urls.json'), JSON.stringify(existing, null, 2));
  
  console.log(`\n✅ Updated: ${successCount}/${charactersToFetch.length}`);
}

main().catch(console.error);



