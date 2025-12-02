/**
 * Fetch images using Wikipedia API and upload to Supabase
 * This approach queries Wikipedia's API to get actual image URLs
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

// People we still need images for (with their Wikipedia article titles)
const peopleToFetch = [
  // Fictional characters - use actor/movie pages
  { id: 'doc-brown', name: 'Doc Brown', wiki: 'Christopher_Lloyd' },
  { id: 'willy-wonka', name: 'Willy Wonka', wiki: 'Gene_Wilder' },
  { id: 'the-doctor', name: 'The Doctor', wiki: 'David_Tennant' },
  { id: 'q-bond', name: 'Q', wiki: 'Ben_Whishaw' },
  { id: 'spock', name: 'Spock', wiki: 'Leonard_Nimoy' },
  { id: 'ted-lasso', name: 'Ted Lasso', wiki: 'Jason_Sudeikis' },
  { id: 'star-lord', name: 'Star-Lord', wiki: 'Chris_Pratt' },
  { id: 'jack-sparrow', name: 'Jack Sparrow', wiki: 'Johnny_Depp' },
  { id: 'captain-america', name: 'Captain America', wiki: 'Chris_Evans_(actor)' },
  { id: 'admiral-adama', name: 'Admiral Adama', wiki: 'Edward_James_Olmos' },
  { id: 'ned-stark', name: 'Ned Stark', wiki: 'Sean_Bean' },
  { id: 'jean-luc-picard', name: 'Jean-Luc Picard', wiki: 'Patrick_Stewart' },
  { id: 'obi-wan-kenobi', name: 'Obi-Wan Kenobi', wiki: 'Ewan_McGregor' },
  { id: 'samwise-gamgee', name: 'Samwise Gamgee', wiki: 'Sean_Astin' },
  { id: 'olaf', name: 'Olaf', wiki: 'Josh_Gad' },
  { id: 'hagrid', name: 'Hagrid', wiki: 'Robbie_Coltrane' },
  { id: 'paddington-bear', name: 'Paddington Bear', wiki: 'Ben_Whishaw' },
  { id: 'baymax', name: 'Baymax', wiki: 'Scott_Adsit' },
  { id: 'atticus-finch', name: 'Atticus Finch', wiki: 'Gregory_Peck' },
  { id: 'mufasa', name: 'Mufasa', wiki: 'James_Earl_Jones' },
  { id: 'wonder-woman', name: 'Wonder Woman', wiki: 'Gal_Gadot' },
  { id: 'king-tchaka', name: 'King T\'Chaka', wiki: 'John_Kani' },
  { id: 'indiana-jones', name: 'Indiana Jones', wiki: 'Harrison_Ford' },
  { id: 'lara-croft', name: 'Lara Croft', wiki: 'Alicia_Vikander' },
  { id: 'alfred-pennyworth', name: 'Alfred Pennyworth', wiki: 'Michael_Caine' },
  { id: 'iroh', name: 'Iroh', wiki: 'Mako_(actor)' },
  { id: 'groot', name: 'Groot', wiki: 'Vin_Diesel' },
  { id: 'professor-x', name: 'Professor X', wiki: 'Patrick_Stewart' },
  { id: 'dumbledore', name: 'Dumbledore', wiki: 'Michael_Gambon' },
  { id: 'tchalla', name: 'T\'Challa', wiki: 'Chadwick_Boseman' },
  { id: 'morpheus', name: 'Morpheus', wiki: 'Laurence_Fishburne' },
  { id: 'vision-mcu', name: 'Vision', wiki: 'Paul_Bettany' },
  { id: 'aang', name: 'Aang', wiki: 'Zach_Tyler_Eisen' },
  { id: 'belle', name: 'Belle', wiki: 'Emma_Watson' },
  { id: 'newt-scamander', name: 'Newt Scamander', wiki: 'Eddie_Redmayne' },
  { id: 'leslie-knope', name: 'Leslie Knope', wiki: 'Amy_Poehler' },
  { id: 'miranda-priestly', name: 'Miranda Priestly', wiki: 'Meryl_Streep' },
  { id: 'harvey-specter', name: 'Harvey Specter', wiki: 'Gabriel_Macht' },
  { id: 'don-draper', name: 'Don Draper', wiki: 'Jon_Hamm' },
  { id: 'data-tng', name: 'Data', wiki: 'Brent_Spiner' },
  { id: 'lisbeth-salander', name: 'Lisbeth Salander', wiki: 'Rooney_Mara' },
  { id: 'spencer-reid', name: 'Spencer Reid', wiki: 'Matthew_Gray_Gubler' },
  { id: 'amy-santiago', name: 'Amy Santiago', wiki: 'Melissa_Fumero' },
  
  // Real people
  { id: 'richard-branson', name: 'Richard Branson', wiki: 'Richard_Branson' },
  { id: 'leonardo-da-vinci', name: 'Leonardo da Vinci', wiki: 'Leonardo_da_Vinci' },
  { id: 'tony-robbins', name: 'Tony Robbins', wiki: 'Tony_Robbins' },
  { id: 'dwayne-johnson', name: 'Dwayne Johnson', wiki: 'Dwayne_Johnson' },
  { id: 'richard-simmons', name: 'Richard Simmons', wiki: 'Richard_Simmons' },
  { id: 'angela-merkel', name: 'Angela Merkel', wiki: 'Angela_Merkel' },
  { id: 'warren-buffett', name: 'Warren Buffett', wiki: 'Warren_Buffett' },
  { id: 'colin-powell', name: 'Colin Powell', wiki: 'Colin_Powell' },
  { id: 'tim-cook', name: 'Tim Cook', wiki: 'Tim_Cook' },
  { id: 'sandra-day-oconnor', name: 'Sandra Day O\'Connor', wiki: 'Sandra_Day_O%27Connor' },
  { id: 'dolly-parton', name: 'Dolly Parton', wiki: 'Dolly_Parton' },
  { id: 'fred-rogers', name: 'Fred Rogers', wiki: 'Fred_Rogers' },
  { id: 'princess-diana', name: 'Princess Diana', wiki: 'Diana,_Princess_of_Wales' },
  { id: 'keanu-reeves', name: 'Keanu Reeves', wiki: 'Keanu_Reeves' },
  { id: 'steve-irwin', name: 'Steve Irwin', wiki: 'Steve_Irwin' },
  { id: 'ruth-bader-ginsburg', name: 'Ruth Bader Ginsburg', wiki: 'Ruth_Bader_Ginsburg' },
  { id: 'malala-yousafzai', name: 'Malala Yousafzai', wiki: 'Malala_Yousafzai' },
  { id: 'john-lewis', name: 'John Lewis', wiki: 'John_Lewis_(civil_rights_leader)' },
  { id: 'desmond-tutu', name: 'Desmond Tutu', wiki: 'Desmond_Tutu' },
  { id: 'anthony-bourdain', name: 'Anthony Bourdain', wiki: 'Anthony_Bourdain' },
  { id: 'jane-goodall', name: 'Jane Goodall', wiki: 'Jane_Goodall' },
  { id: 'bear-grylls', name: 'Bear Grylls', wiki: 'Bear_Grylls' },
  { id: 'jacques-cousteau', name: 'Jacques Cousteau', wiki: 'Jacques_Cousteau' },
  { id: 'morgan-freeman', name: 'Morgan Freeman', wiki: 'Morgan_Freeman' },
  { id: 'thich-nhat-hanh', name: 'Thich Nhat Hanh', wiki: 'Thich_Nhat_Hanh' },
  { id: 'satya-nadella', name: 'Satya Nadella', wiki: 'Satya_Nadella' },
  { id: 'sundar-pichai', name: 'Sundar Pichai', wiki: 'Sundar_Pichai' },
  { id: 'mary-barra', name: 'Mary Barra', wiki: 'Mary_Barra' },
  { id: 'reed-hastings', name: 'Reed Hastings', wiki: 'Reed_Hastings' },
  { id: 'brene-brown', name: 'Brené Brown', wiki: 'Bren%C3%A9_Brown' },
  { id: 'hayao-miyazaki', name: 'Hayao Miyazaki', wiki: 'Hayao_Miyazaki' },
  { id: 'emily-dickinson', name: 'Emily Dickinson', wiki: 'Emily_Dickinson' },
  { id: 'serena-williams', name: 'Serena Williams', wiki: 'Serena_Williams' },
  { id: 'indra-nooyi', name: 'Indra Nooyi', wiki: 'Indra_Nooyi' },
  { id: 'beyonce', name: 'Beyoncé', wiki: 'Beyonc%C3%A9' },
  { id: 'nate-silver', name: 'Nate Silver', wiki: 'Nate_Silver' },
];

// Fetch image URL from Wikipedia API
function getWikiImageUrl(wikiTitle) {
  return new Promise((resolve, reject) => {
    const apiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${wikiTitle}`;
    
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
          if (json.thumbnail && json.thumbnail.source) {
            // Get higher resolution version
            let imageUrl = json.thumbnail.source;
            // Try to get larger image by modifying the URL
            imageUrl = imageUrl.replace(/\/\d+px-/, '/500px-');
            resolve(imageUrl);
          } else if (json.originalimage && json.originalimage.source) {
            resolve(json.originalimage.source);
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

async function processOne(person) {
  try {
    console.log(`🔍 ${person.name} (${person.wiki})...`);
    
    // Get image URL from Wikipedia API
    const imageUrl = await getWikiImageUrl(person.wiki);
    console.log(`   Found: ${imageUrl.substring(0, 60)}...`);
    
    // Download image
    const imageData = await downloadImage(imageUrl);
    
    // Upload to Supabase
    const ext = getExtension(imageUrl);
    const fileName = `${person.id}${ext}`;
    
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, imageData, {
        contentType: `image/${ext.slice(1) === 'jpg' ? 'jpeg' : ext.slice(1)}`,
        upsert: true,
      });
    
    if (error) throw error;
    
    const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName);
    console.log(`   ✅ Uploaded!`);
    return { id: person.id, url: urlData.publicUrl };
  } catch (err) {
    console.log(`   ❌ ${err.message}`);
    return null;
  }
}

async function main() {
  console.log('🚀 Fetching images via Wikipedia API\n');
  
  // Load existing
  let existing = {};
  try {
    existing = JSON.parse(fs.readFileSync(path.join(__dirname, 'image-urls.json')));
  } catch (e) {}
  
  let successCount = 0;
  let failCount = 0;
  
  for (const person of peopleToFetch) {
    // Skip if we already have this one
    if (existing[person.id]) {
      console.log(`⏭️  ${person.name} (already have)`);
      continue;
    }
    
    const result = await processOne(person);
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
  console.log(`✅ New uploads: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log(`📄 Total in image-urls.json: ${Object.keys(existing).length}`);
}

main().catch(console.error);

