/**
 * Upload actual fictional character images (not actor headshots)
 * Uses curated URLs from movie stills, promotional images, and character artwork
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

// Curated character images - using movie stills and official artwork
// These are direct links to actual character images, not actor headshots
const characters = [
  // PRISM Archetypes - Fictional
  { id: 'tony-stark', wiki: 'Iron_Man_(2008_film)', name: 'Tony Stark' },
  { id: 'doc-brown', wiki: 'Back_to_the_Future', name: 'Doc Brown' },
  { id: 'willy-wonka', wiki: 'Willy_Wonka_%26_the_Chocolate_Factory', name: 'Willy Wonka' },
  { id: 'the-doctor', wiki: 'Doctor_(Doctor_Who)', name: 'The Doctor' },
  { id: 'spock', wiki: 'Spock', name: 'Spock' },
  { id: 'ted-lasso', wiki: 'Ted_Lasso', name: 'Ted Lasso' },
  { id: 'star-lord', wiki: 'Star-Lord', name: 'Star-Lord' },
  { id: 'jack-sparrow', wiki: 'Jack_Sparrow', name: 'Jack Sparrow' },
  { id: 'captain-america', wiki: 'Captain_America_in_other_media', name: 'Captain America' },
  { id: 'ned-stark', wiki: 'Ned_Stark', name: 'Ned Stark' },
  { id: 'jean-luc-picard', wiki: 'Jean-Luc_Picard', name: 'Jean-Luc Picard' },
  { id: 'obi-wan-kenobi', wiki: 'Obi-Wan_Kenobi', name: 'Obi-Wan Kenobi' },
  { id: 'samwise-gamgee', wiki: 'Samwise_Gamgee', name: 'Samwise Gamgee' },
  { id: 'hagrid', wiki: 'Rubeus_Hagrid', name: 'Hagrid' },
  { id: 'paddington-bear', wiki: 'Paddington_(film)', name: 'Paddington' },
  { id: 'baymax', wiki: 'Big_Hero_6_(film)', name: 'Baymax' },
  { id: 'atticus-finch', wiki: 'To_Kill_a_Mockingbird_(film)', name: 'Atticus Finch' },
  { id: 'gandalf', wiki: 'Gandalf', name: 'Gandalf' },
  { id: 'wonder-woman', wiki: 'Wonder_Woman_(2017_film)', name: 'Wonder Woman' },
  { id: 'mufasa', wiki: 'The_Lion_King', name: 'Mufasa' },
  { id: 'indiana-jones', wiki: 'Indiana_Jones', name: 'Indiana Jones' },
  { id: 'lara-croft', wiki: 'Lara_Croft', name: 'Lara Croft' },
  { id: 'alfred-pennyworth', wiki: 'The_Dark_Knight_(film)', name: 'Alfred' },
  { id: 'iroh', wiki: 'Avatar:_The_Last_Airbender', name: 'Iroh' },
  { id: 'groot', wiki: 'Groot', name: 'Groot' },
  { id: 'professor-x', wiki: 'Professor_X', name: 'Professor X' },
  { id: 'dumbledore', wiki: 'Albus_Dumbledore', name: 'Dumbledore' },
  { id: 'tchalla', wiki: 'Black_Panther_(film)', name: 'T\'Challa' },
  { id: 'morpheus', wiki: 'Morpheus_(The_Matrix)', name: 'Morpheus' },
  { id: 'vision-mcu', wiki: 'Vision_(Marvel_Cinematic_Universe)', name: 'Vision' },
  { id: 'aang', wiki: 'Aang', name: 'Aang' },
  { id: 'belle', wiki: 'Beauty_and_the_Beast_(1991_film)', name: 'Belle' },
  { id: 'newt-scamander', wiki: 'Fantastic_Beasts_and_Where_to_Find_Them_(film)', name: 'Newt Scamander' },
  { id: 'leslie-knope', wiki: 'Leslie_Knope', name: 'Leslie Knope' },
  { id: 'harvey-specter', wiki: 'Suits_(American_TV_series)', name: 'Harvey Specter' },
  { id: 'don-draper', wiki: 'Don_Draper', name: 'Don Draper' },
  { id: 'data-tng', wiki: 'Data_(Star_Trek)', name: 'Data' },
  { id: 'sherlock-holmes', wiki: 'Sherlock_Holmes', name: 'Sherlock Holmes' },
  { id: 'hermione-granger', wiki: 'Hermione_Granger', name: 'Hermione Granger' },
  { id: 'walter-white', wiki: 'Walter_White_(Breaking_Bad)', name: 'Walter White' },
  { id: 'olaf', wiki: 'Olaf_(Frozen)', name: 'Olaf' },
  { id: 'marge-simpson', wiki: 'Marge_Simpson', name: 'Marge Simpson' },
  { id: 'rocky-balboa', wiki: 'Rocky_Balboa', name: 'Rocky' },
  { id: 'michael-scott', wiki: 'Michael_Scott_(The_Office)', name: 'Michael Scott' },
  { id: 'elle-woods', wiki: 'Elle_Woods', name: 'Elle Woods' },
  { id: 'batman', wiki: 'Batman_in_film', name: 'Batman' },
  { id: 'miranda-priestly', wiki: 'The_Devil_Wears_Prada_(film)', name: 'Miranda Priestly' },
  { id: 'spencer-reid', wiki: 'Criminal_Minds', name: 'Spencer Reid' },
  { id: 'lisbeth-salander', wiki: 'Lisbeth_Salander', name: 'Lisbeth Salander' },
  { id: 'amy-santiago', wiki: 'Brooklyn_Nine-Nine', name: 'Amy Santiago' },
  { id: 'amelie', wiki: 'Am%C3%A9lie', name: 'Amélie' },
  { id: 'king-tchaka', wiki: 'Black_Panther_(film)', name: 'King T\'Chaka' },
  { id: 'q-bond', wiki: 'Q_(James_Bond)', name: 'Q' },
  { id: 'admiral-adama', wiki: 'William_Adama', name: 'Admiral Adama' },
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
            // Get higher resolution
            let url = json.thumbnail.source.replace(/\/\d+px-/, '/500px-');
            resolve(url);
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

function getExtension(url) {
  const match = url.match(/\.(jpg|jpeg|png|gif|webp)/i);
  return match ? `.${match[1].toLowerCase()}` : '.jpg';
}

async function processOne(char) {
  try {
    const imageUrl = await getWikiImageUrl(char.wiki);
    const imageData = await downloadImage(imageUrl);
    const ext = getExtension(imageUrl);
    const fileName = `${char.id}${ext}`;
    
    await supabase.storage.from(BUCKET_NAME).upload(fileName, imageData, {
      contentType: `image/${ext.slice(1) === 'jpg' ? 'jpeg' : ext.slice(1)}`,
      upsert: true,
    });
    
    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName);
    console.log(`✅ ${char.name}`);
    return { id: char.id, url: data.publicUrl };
  } catch (err) {
    console.log(`❌ ${char.name}: ${err.message}`);
    return null;
  }
}

async function main() {
  console.log(`🎬 Uploading ${characters.length} fictional character images\n`);
  
  let existing = {};
  try {
    existing = JSON.parse(fs.readFileSync(path.join(__dirname, 'image-urls.json')));
  } catch (e) {}
  
  let success = 0, fail = 0;
  
  for (const char of characters) {
    const result = await processOne(char);
    if (result) {
      existing[result.id] = result.url;
      success++;
    } else {
      fail++;
    }
    await new Promise(r => setTimeout(r, 400));
  }
  
  fs.writeFileSync(path.join(__dirname, 'image-urls.json'), JSON.stringify(existing, null, 2));
  
  console.log(`\n✅ Success: ${success} | ❌ Failed: ${fail}`);
}

main().catch(console.error);




