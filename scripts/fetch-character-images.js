/**
 * Fetch actual character images (not actor headshots)
 * Using movie/show promotional images and character pages
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

// Fictional characters with their character-specific Wikipedia pages or movie pages
const charactersToFetch = [
  // Characters with their own Wikipedia pages (usually have character images)
  { id: 'doc-brown', name: 'Doc Brown', wiki: 'Emmett_Brown' },
  { id: 'willy-wonka', name: 'Willy Wonka', wiki: 'Willy_Wonka' },
  { id: 'the-doctor', name: 'The Doctor', wiki: 'Fifteenth_Doctor' },
  { id: 'q-bond', name: 'Q', wiki: 'Q_(James_Bond)' },
  { id: 'spock', name: 'Spock', wiki: 'Spock' },
  { id: 'ted-lasso', name: 'Ted Lasso', wiki: 'Ted_Lasso_(character)' },
  { id: 'star-lord', name: 'Star-Lord', wiki: 'Star-Lord' },
  { id: 'jack-sparrow', name: 'Jack Sparrow', wiki: 'Jack_Sparrow' },
  { id: 'captain-america', name: 'Captain America', wiki: 'Captain_America_(Marvel_Cinematic_Universe)' },
  { id: 'admiral-adama', name: 'Admiral Adama', wiki: 'William_Adama' },
  { id: 'ned-stark', name: 'Ned Stark', wiki: 'Ned_Stark' },
  { id: 'jean-luc-picard', name: 'Jean-Luc Picard', wiki: 'Jean-Luc_Picard' },
  { id: 'obi-wan-kenobi', name: 'Obi-Wan Kenobi', wiki: 'Obi-Wan_Kenobi' },
  { id: 'samwise-gamgee', name: 'Samwise Gamgee', wiki: 'Samwise_Gamgee' },
  { id: 'hagrid', name: 'Hagrid', wiki: 'Rubeus_Hagrid' },
  { id: 'paddington-bear', name: 'Paddington Bear', wiki: 'Paddington_Bear' },
  { id: 'baymax', name: 'Baymax', wiki: 'Baymax' },
  { id: 'atticus-finch', name: 'Atticus Finch', wiki: 'Atticus_Finch' },
  { id: 'wonder-woman', name: 'Wonder Woman', wiki: 'Wonder_Woman_(DC_Extended_Universe)' },
  { id: 'king-tchaka', name: 'King T\'Chaka', wiki: 'Black_Panther_(Marvel_Cinematic_Universe)' },
  { id: 'indiana-jones', name: 'Indiana Jones', wiki: 'Indiana_Jones' },
  { id: 'lara-croft', name: 'Lara Croft', wiki: 'Lara_Croft' },
  { id: 'alfred-pennyworth', name: 'Alfred Pennyworth', wiki: 'Alfred_Pennyworth' },
  { id: 'iroh', name: 'Iroh', wiki: 'Iroh' },
  { id: 'groot', name: 'Groot', wiki: 'Groot' },
  { id: 'professor-x', name: 'Professor X', wiki: 'Professor_X' },
  { id: 'dumbledore', name: 'Dumbledore', wiki: 'Albus_Dumbledore' },
  { id: 'tchalla', name: 'T\'Challa', wiki: 'Black_Panther_(Marvel_Cinematic_Universe)' },
  { id: 'morpheus', name: 'Morpheus', wiki: 'Morpheus_(The_Matrix)' },
  { id: 'vision-mcu', name: 'Vision', wiki: 'Vision_(Marvel_Cinematic_Universe)' },
  { id: 'aang', name: 'Aang', wiki: 'Aang' },
  { id: 'belle', name: 'Belle', wiki: 'Belle_(Beauty_and_the_Beast)' },
  { id: 'newt-scamander', name: 'Newt Scamander', wiki: 'Newt_Scamander' },
  { id: 'leslie-knope', name: 'Leslie Knope', wiki: 'Leslie_Knope' },
  { id: 'miranda-priestly', name: 'Miranda Priestly', wiki: 'The_Devil_Wears_Prada_(film)' },
  { id: 'harvey-specter', name: 'Harvey Specter', wiki: 'Suits_(American_TV_series)' },
  { id: 'don-draper', name: 'Don Draper', wiki: 'Don_Draper' },
  { id: 'data-tng', name: 'Data', wiki: 'Data_(Star_Trek)' },
  { id: 'lisbeth-salander', name: 'Lisbeth Salander', wiki: 'Lisbeth_Salander' },
  { id: 'spencer-reid', name: 'Spencer Reid', wiki: 'Criminal_Minds' },
  { id: 'amy-santiago', name: 'Amy Santiago', wiki: 'Brooklyn_Nine-Nine' },
  { id: 'michael-scott', name: 'Michael Scott', wiki: 'Michael_Scott_(The_Office)' },
  { id: 'elle-woods', name: 'Elle Woods', wiki: 'Elle_Woods' },
  { id: 'sherlock-holmes', name: 'Sherlock Holmes', wiki: 'Sherlock_Holmes' },
  { id: 'hermione-granger', name: 'Hermione Granger', wiki: 'Hermione_Granger' },
  { id: 'walter-white', name: 'Walter White', wiki: 'Walter_White_(Breaking_Bad)' },
  { id: 'mufasa', name: 'Mufasa', wiki: 'Mufasa' },
  { id: 'olaf', name: 'Olaf', wiki: 'Olaf_(Frozen)' },
  { id: 'marge-simpson', name: 'Marge Simpson', wiki: 'Marge_Simpson' },
  { id: 'gandalf', name: 'Gandalf', wiki: 'Gandalf' },
  { id: 'rocky-balboa', name: 'Rocky Balboa', wiki: 'Rocky_Balboa' },
];

// Fetch image URL from Wikipedia API
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
          // Prefer original image for better quality
          if (json.originalimage && json.originalimage.source) {
            // Get a reasonable size version
            let imageUrl = json.originalimage.source;
            // If it's too large, try to get a 500px version
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

// Download image
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
    
    // Get image URL from Wikipedia API
    const imageUrl = await getWikiImageUrl(character.wiki);
    console.log(`   Found: ${imageUrl.substring(0, 60)}...`);
    
    // Download image
    const imageData = await downloadImage(imageUrl);
    
    // Upload to Supabase
    const ext = getExtension(imageUrl);
    const fileName = `${character.id}${ext}`;
    
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, imageData, {
        contentType: `image/${ext.slice(1) === 'jpg' ? 'jpeg' : ext.slice(1)}`,
        upsert: true, // Overwrite existing
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
  console.log('🎬 Fetching CHARACTER images (not actor headshots)\n');
  
  // Load existing
  let existing = {};
  try {
    existing = JSON.parse(fs.readFileSync(path.join(__dirname, 'image-urls.json')));
  } catch (e) {}
  
  let successCount = 0;
  let failCount = 0;
  
  for (const character of charactersToFetch) {
    const result = await processOne(character);
    if (result) {
      existing[result.id] = result.url;
      successCount++;
    } else {
      failCount++;
    }
    
    // Small delay
    await new Promise(r => setTimeout(r, 500));
  }
  
  // Save results
  fs.writeFileSync(path.join(__dirname, 'image-urls.json'), JSON.stringify(existing, null, 2));
  
  console.log('\n' + '='.repeat(50));
  console.log(`✅ Updated: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
}

main().catch(console.error);




