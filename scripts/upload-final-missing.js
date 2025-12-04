/**
 * Upload the final 17 missing images
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

// All remaining missing people
const missingPeople = [
  { name: "Marilyn Manson", wiki: "Marilyn_Manson" },
  { name: "Adolf Hitler", wiki: "Adolf_Hitler" },
  { name: "Louis C.K.", wiki: "Louis_C.K." },
  { name: "Ralph Nader", wiki: "Ralph_Nader" },
  { name: "Jeff Sessions", wiki: "Jeff_Sessions" },
  { name: "Mike Pence", wiki: "Mike_Pence" },
  { name: "Bernard Law Montgomery", wiki: "Bernard_Montgomery" },
  { name: "Douglas MacArthur", wiki: "Douglas_MacArthur" },
  { name: "Mary Tyler Moore", wiki: "Mary_Tyler_Moore" },
  { name: "Bishop Fulton Sheen", wiki: "Fulton_J._Sheen" },
  { name: "Ann Landers", wiki: "Ann_Landers" },
  { name: "Mitt Romney", wiki: "Mitt_Romney" },
  { name: "Werner Erhard", wiki: "Werner_Erhard" },
  { name: "Gary Larson", wiki: "Gary_Larson" },
  { name: "J. Edgar Hoover", wiki: "J._Edgar_Hoover" },
  { name: "Rush Limbaugh", wiki: "Rush_Limbaugh" },
  { name: "Timothy Leary", wiki: "Timothy_Leary" },
];

function getWikiImageUrl(wikiTitle) {
  return new Promise((resolve, reject) => {
    const apiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiTitle)}`;
    
    https.get(apiUrl, {
      headers: { 'User-Agent': 'PersonalityTestApp/1.0', 'Accept': 'application/json' }
    }, (response) => {
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.thumbnail && json.thumbnail.source) {
            resolve(json.thumbnail.source.replace(/\/\d+px-/, '/500px-'));
          } else if (json.originalimage && json.originalimage.source) {
            resolve(json.originalimage.source);
          } else {
            reject(new Error('No image'));
          }
        } catch (e) { reject(e); }
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
      if (response.statusCode !== 200) { reject(new Error(`HTTP ${response.statusCode}`)); return; }
      const chunks = [];
      response.on('data', chunk => chunks.push(chunk));
      response.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

function nameToId(name) {
  return name.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function getExtension(url) {
  const match = url.match(/\.(jpg|jpeg|png|gif|webp|svg)/i);
  return match ? `.${match[1].toLowerCase()}` : '.jpg';
}

async function processOne(person) {
  const id = nameToId(person.name);
  try {
    const imageUrl = await getWikiImageUrl(person.wiki);
    const imageData = await downloadImage(imageUrl);
    const ext = getExtension(imageUrl);
    const fileName = `${id}${ext}`;
    
    await supabase.storage.from(BUCKET_NAME).upload(fileName, imageData, {
      contentType: `image/${ext.slice(1) === 'jpg' ? 'jpeg' : ext.slice(1)}`,
      upsert: true,
    });
    
    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName);
    console.log(`✅ ${person.name}`);
    return { id, name: person.name, url: data.publicUrl };
  } catch (err) {
    console.log(`❌ ${person.name}: ${err.message}`);
    return null;
  }
}

async function main() {
  console.log(`🚀 Uploading ${missingPeople.length} final missing images\n`);
  
  let existing = {};
  try {
    existing = JSON.parse(fs.readFileSync(path.join(__dirname, 'image-urls.json')));
  } catch (e) {}
  
  let success = 0, fail = 0;
  
  for (const person of missingPeople) {
    const result = await processOne(person);
    if (result) {
      existing[result.id] = result.url;
      success++;
    } else {
      fail++;
    }
    await new Promise(r => setTimeout(r, 300));
  }
  
  fs.writeFileSync(path.join(__dirname, 'image-urls.json'), JSON.stringify(existing, null, 2));
  
  console.log(`\n✅ Success: ${success} | ❌ Failed: ${fail}`);
  console.log(`Total images now: ${Object.keys(existing).length}`);
}

main().catch(console.error);




