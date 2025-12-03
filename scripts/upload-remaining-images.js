/**
 * Second pass - upload remaining images with alternative URLs
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const BUCKET_NAME = 'famous-images';

// Failed images with alternative URLs (using direct Wikimedia Commons URLs)
const remainingPeople = [
  // Using direct commons URLs without /thumb/
  { id: 'doc-brown', name: 'Doc Brown', url: 'https://upload.wikimedia.org/wikipedia/en/7/7e/Back_to_the_Future_%281985%29_theatrical_poster.jpg' },
  { id: 'willy-wonka', name: 'Willy Wonka', url: 'https://upload.wikimedia.org/wikipedia/en/5/55/Willy-wonka-1971.jpg' },
  { id: 'the-doctor', name: 'The Doctor', url: 'https://upload.wikimedia.org/wikipedia/en/4/4c/Doctor_Who_Series_14_Title_Card.png' },
  { id: 'q-bond', name: 'Q', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Ben_Whishaw_by_Gage_Skidmore.jpg' },
  { id: 'richard-branson', name: 'Richard Branson', url: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Richard_Branson_March_2015_%28cropped%29.jpg' },
  { id: 'leonardo-da-vinci', name: 'Leonardo da Vinci', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Francesco_Melzi_-_Portrait_of_Leonardo_da_Vinci_-_RCIN_404775.jpg' },
  { id: 'spock', name: 'Spock', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Leonard_Nimoy_Mr._Spock_Star_Trek.JPG' },
  { id: 'ted-lasso', name: 'Ted Lasso', url: 'https://upload.wikimedia.org/wikipedia/en/9/9a/Ted_Lasso_intertitle.jpg' },
  { id: 'star-lord', name: 'Star-Lord', url: 'https://upload.wikimedia.org/wikipedia/en/6/60/Guardians_of_the_Galaxy_Vol._3_poster.jpg' },
  { id: 'jack-sparrow', name: 'Jack Sparrow', url: 'https://upload.wikimedia.org/wikipedia/en/2/26/Johnny_Depp_as_Jack_Sparrow.jpg' },
  { id: 'tony-robbins', name: 'Tony Robbins', url: 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Tony_Robbins.jpg' },
  { id: 'dwayne-johnson', name: 'Dwayne Johnson', url: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Dwayne_%22The_Rock%22_Johnson_Visits_the_Pentagon_%28cropped%29.jpg' },
  { id: 'richard-simmons', name: 'Richard Simmons', url: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/RichardSimmonsJun10.jpg' },
  { id: 'captain-america', name: 'Captain America', url: 'https://upload.wikimedia.org/wikipedia/en/0/07/Captain_America_%28Alex_Ross%27s_art%29.jpg' },
  { id: 'admiral-adama', name: 'Admiral Adama', url: 'https://upload.wikimedia.org/wikipedia/en/b/b5/Battlestar_Galactica_Reimagined_Season_1.jpg' },
  { id: 'ned-stark', name: 'Ned Stark', url: 'https://upload.wikimedia.org/wikipedia/en/2/25/Game_of_Thrones_Season_1.jpg' },
  { id: 'jean-luc-picard', name: 'Jean-Luc Picard', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Patrick_Stewart_Photo_Call_Logan_Berlinale_2017_%28cropped%29.jpg' },
  { id: 'obi-wan-kenobi', name: 'Obi-Wan Kenobi', url: 'https://upload.wikimedia.org/wikipedia/en/b/b0/Star_Wars_Episode_III_Revenge_of_the_Sith_poster.jpg' },
  { id: 'angela-merkel', name: 'Angela Merkel', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Angela_Merkel_2019_%28cropped%29.jpg' },
  { id: 'warren-buffett', name: 'Warren Buffett', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Warren_Buffett_at_the_2015_SelectUSA_Investment_Summit.jpg' },
  { id: 'colin-powell', name: 'Colin Powell', url: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Colin_Powell_official_Secretary_of_State_photo.jpg' },
  { id: 'tim-cook', name: 'Tim Cook', url: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Tim_Cook_%282017%2C_cropped%29.jpg' },
  { id: 'sandra-day-oconnor', name: 'Sandra Day O\'Connor', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Sandra_Day_O%27Connor_in_Robes%2C_1982.jpg' },
  { id: 'samwise-gamgee', name: 'Samwise Gamgee', url: 'https://upload.wikimedia.org/wikipedia/en/1/1f/The_Lord_of_the_Rings_The_Fellowship_of_the_Ring_%282001%29_theatrical_poster.jpg' },
  { id: 'olaf', name: 'Olaf', url: 'https://upload.wikimedia.org/wikipedia/en/0/05/Frozen_%282013_film%29_poster.jpg' },
  { id: 'hagrid', name: 'Hagrid', url: 'https://upload.wikimedia.org/wikipedia/en/3/3a/Robbie_Coltrane_as_Hagrid.jpg' },
  { id: 'paddington-bear', name: 'Paddington Bear', url: 'https://upload.wikimedia.org/wikipedia/en/b/b3/Paddington_2_poster.jpg' },
  { id: 'baymax', name: 'Baymax', url: 'https://upload.wikimedia.org/wikipedia/en/4/4b/Big_Hero_6_%282014_film%29_poster.jpg' },
  { id: 'dolly-parton', name: 'Dolly Parton', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Dolly_Parton_at_Dollywood_%282%29_%28cropped%29.jpg' },
  { id: 'fred-rogers', name: 'Fred Rogers', url: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Fred_Rogers%2C_late_1960s.jpg' },
  { id: 'princess-diana', name: 'Princess Diana', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Diana%2C_Princess_of_Wales_%281961-1997%29.jpg' },
  { id: 'keanu-reeves', name: 'Keanu Reeves', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Keanu_Reeves_2014_%28cropped%29.jpg' },
  { id: 'steve-irwin', name: 'Steve Irwin', url: 'https://upload.wikimedia.org/wikipedia/commons/1/17/Lightmatter_SteveIrwin.jpg' },
  { id: 'atticus-finch', name: 'Atticus Finch', url: 'https://upload.wikimedia.org/wikipedia/en/3/39/To_Kill_a_Mockingbird_%28first_edition_cover%29.jpg' },
  { id: 'mufasa', name: 'Mufasa', url: 'https://upload.wikimedia.org/wikipedia/en/3/3d/The_Lion_King_poster.jpg' },
  { id: 'wonder-woman', name: 'Wonder Woman', url: 'https://upload.wikimedia.org/wikipedia/en/e/ed/Wonder_Woman_%282017_film%29.jpg' },
  { id: 'king-tchaka', name: 'King T\'Chaka', url: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Black_Panther_film_poster.jpg' },
  { id: 'ruth-bader-ginsburg', name: 'Ruth Bader Ginsburg', url: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Ruth_Bader_Ginsburg_2016_portrait.jpg' },
  { id: 'malala-yousafzai', name: 'Malala Yousafzai', url: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Malala_Yousafzai_-_2019_%2846751193954%29_%28cropped%29.jpg' },
  { id: 'john-lewis', name: 'John Lewis', url: 'https://upload.wikimedia.org/wikipedia/commons/1/16/John_Lewis-2006_%28cropped%29.jpg' },
  { id: 'desmond-tutu', name: 'Desmond Tutu', url: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Desmond_Tutu_April_2013.jpg' },
  { id: 'indiana-jones', name: 'Indiana Jones', url: 'https://upload.wikimedia.org/wikipedia/en/4/4c/Raiders_of_the_Lost_Ark.jpg' },
  { id: 'dora', name: 'Dora the Explorer', url: 'https://upload.wikimedia.org/wikipedia/en/3/36/Dora_the_Explorer_logo.png' },
  { id: 'lara-croft', name: 'Lara Croft', url: 'https://upload.wikimedia.org/wikipedia/en/6/69/Tomb_Raider_%282018_film%29.png' },
  { id: 'anthony-bourdain', name: 'Anthony Bourdain', url: 'https://upload.wikimedia.org/wikipedia/commons/1/14/AnthonyBourdainByKristinSchiavone.jpg' },
  { id: 'jane-goodall', name: 'Jane Goodall', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Jane_Goodall_2015.jpg' },
  { id: 'bear-grylls', name: 'Bear Grylls', url: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Bear_Grylls_2.jpg' },
  { id: 'jacques-cousteau', name: 'Jacques Cousteau', url: 'https://upload.wikimedia.org/wikipedia/commons/8/80/LeCorsaireJacques-YvesCousteau.jpg' },
  { id: 'alfred-pennyworth', name: 'Alfred Pennyworth', url: 'https://upload.wikimedia.org/wikipedia/en/5/56/The_Dark_Knight_%282008_film%29.jpg' },
  { id: 'iroh', name: 'Iroh', url: 'https://upload.wikimedia.org/wikipedia/en/a/a1/Avatar_The_Last_Airbender_Season_1.jpg' },
  { id: 'groot', name: 'Groot', url: 'https://upload.wikimedia.org/wikipedia/en/b/b7/Guardians_of_the_Galaxy_%28film%29_poster.jpg' },
  { id: 'morgan-freeman', name: 'Morgan Freeman', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Morgan_Freeman_at_The_Pentagon_on_2_August_2023_-_230802-D-PM193-3363_%28cropped%29.jpg' },
  { id: 'thich-nhat-hanh', name: 'Thich Nhat Hanh', url: 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Thich_Nhat_Hanh_12_%28cropped%29.jpg' },
  { id: 'professor-x', name: 'Professor X', url: 'https://upload.wikimedia.org/wikipedia/en/0/07/X-Men_The_Last_Stand_poster.jpg' },
  { id: 'dumbledore', name: 'Dumbledore', url: 'https://upload.wikimedia.org/wikipedia/en/c/c0/Harry_Potter_and_the_Philosopher%27s_Stone_poster.jpg' },
  { id: 'tchalla', name: 'T\'Challa', url: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Black_Panther_film_poster.jpg' },
  { id: 'morpheus', name: 'Morpheus', url: 'https://upload.wikimedia.org/wikipedia/en/c/c1/The_Matrix_Poster.jpg' },
  { id: 'vision', name: 'Vision', url: 'https://upload.wikimedia.org/wikipedia/en/4/4d/Avengers_Age_of_Ultron.jpg' },
  { id: 'satya-nadella', name: 'Satya Nadella', url: 'https://upload.wikimedia.org/wikipedia/commons/1/10/Satya_Nadella_%282017%2C_cropped%29.jpg' },
  { id: 'sundar-pichai', name: 'Sundar Pichai', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Sundar_Pichai_%282023%2C_cropped%29.jpg' },
  { id: 'mary-barra', name: 'Mary Barra', url: 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Mary_Barra_official_portrait_%28cropped%29.jpg' },
  { id: 'reed-hastings', name: 'Reed Hastings', url: 'https://upload.wikimedia.org/wikipedia/commons/2/26/Reed_Hastings_%282023%2C_cropped%29.jpg' },
  { id: 'aang', name: 'Aang', url: 'https://upload.wikimedia.org/wikipedia/en/a/a1/Avatar_The_Last_Airbender_Season_1.jpg' },
  { id: 'belle', name: 'Belle', url: 'https://upload.wikimedia.org/wikipedia/en/5/5e/Beauty_and_the_Beast_%282017_film%29.jpg' },
  { id: 'newt-scamander', name: 'Newt Scamander', url: 'https://upload.wikimedia.org/wikipedia/en/8/8f/Fantastic_Beasts_and_Where_to_Find_Them_poster.jpg' },
  { id: 'steven-universe', name: 'Steven Universe', url: 'https://upload.wikimedia.org/wikipedia/en/2/2d/Steven_Universe_logo.png' },
  { id: 'brene-brown', name: 'Brené Brown', url: 'https://upload.wikimedia.org/wikipedia/commons/5/59/Bren%C3%A9_Brown_%28cropped%29.jpg' },
  { id: 'mr-rogers-harmonizer', name: 'Mr. Rogers (Harmonizer)', url: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Fred_Rogers%2C_late_1960s.jpg' },
  { id: 'hayao-miyazaki', name: 'Hayao Miyazaki', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a1/Hayao_Miyazaki_at_the_Venice_Film_Festival_2008.jpg' },
  { id: 'emily-dickinson', name: 'Emily Dickinson', url: 'https://upload.wikimedia.org/wikipedia/commons/2/22/Emily_Dickinson_daguerreotype_%28Restored_and_cropped%29.jpg' },
  { id: 'leslie-knope', name: 'Leslie Knope', url: 'https://upload.wikimedia.org/wikipedia/en/6/67/Parks_and_recreation_season_one_cast.jpg' },
  { id: 'miranda-priestly', name: 'Miranda Priestly', url: 'https://upload.wikimedia.org/wikipedia/en/6/6a/The_Devil_Wears_Prada_cover.jpg' },
  { id: 'harvey-specter', name: 'Harvey Specter', url: 'https://upload.wikimedia.org/wikipedia/en/4/4b/Suits_season_1_promo.jpg' },
  { id: 'don-draper', name: 'Don Draper', url: 'https://upload.wikimedia.org/wikipedia/en/e/e4/Mad_Men_Season_1.jpg' },
  { id: 'serena-williams', name: 'Serena Williams', url: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Serena_Williams_at_the_2023_WTA_Finals_%28cropped%29.jpg' },
  { id: 'indra-nooyi', name: 'Indra Nooyi', url: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Indra_Nooyi%2C_New_York_Times_2013.jpg' },
  { id: 'beyonce', name: 'Beyoncé', url: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Beyonc%C3%A9_on_the_Red_Carpet_Grammy_2024.jpg' },
  { id: 'data', name: 'Data', url: 'https://upload.wikimedia.org/wikipedia/en/0/07/TNG_S7_DVD.jpg' },
  { id: 'lisbeth-salander', name: 'Lisbeth Salander', url: 'https://upload.wikimedia.org/wikipedia/en/b/bc/TheGirlWithTheDragonTattoo2011Poster.jpg' },
  { id: 'spencer-reid', name: 'Spencer Reid', url: 'https://upload.wikimedia.org/wikipedia/en/9/96/Criminal_Minds_Season_1_DVD.jpg' },
  { id: 'amy-santiago', name: 'Amy Santiago', url: 'https://upload.wikimedia.org/wikipedia/en/d/dc/Brooklyn_nine_nine_season_one_DVD.jpg' },
  { id: 'nate-silver', name: 'Nate Silver', url: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Nate_Silver_%28cropped%29.jpg' },
];

function downloadImage(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const request = protocol.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'image/*,*/*;q=0.8',
      }
    }, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        downloadImage(response.headers.location).then(resolve).catch(reject);
        return;
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`Failed: ${response.statusCode}`));
        return;
      }
      
      const chunks = [];
      response.on('data', chunk => chunks.push(chunk));
      response.on('end', () => resolve(Buffer.concat(chunks)));
      response.on('error', reject);
    });
    
    request.on('error', reject);
    request.setTimeout(30000, () => {
      request.destroy();
      reject(new Error('Timeout'));
    });
  });
}

function getExtension(url) {
  const ext = path.extname(new URL(url).pathname).toLowerCase();
  if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) return ext;
  return '.jpg';
}

async function uploadImage(person) {
  try {
    console.log(`📥 Downloading ${person.name}...`);
    const imageData = await downloadImage(person.url);
    
    const ext = getExtension(person.url);
    const fileName = `${person.id}${ext}`;
    
    console.log(`📤 Uploading ${fileName}...`);
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, imageData, {
        contentType: `image/${ext.slice(1) === 'jpg' ? 'jpeg' : ext.slice(1)}`,
        upsert: true,
      });
    
    if (error) {
      console.error(`❌ ${person.name}:`, error.message);
      return null;
    }
    
    const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName);
    console.log(`✅ ${person.name}`);
    return { id: person.id, name: person.name, url: urlData.publicUrl };
  } catch (err) {
    console.error(`❌ ${person.name}:`, err.message);
    return null;
  }
}

async function main() {
  console.log(`🚀 Uploading ${remainingPeople.length} remaining images...\n`);
  
  // Load existing results
  let existing = {};
  try {
    existing = JSON.parse(fs.readFileSync(path.join(__dirname, 'image-urls.json')));
  } catch (e) {}
  
  const results = [];
  const failed = [];
  
  for (const person of remainingPeople) {
    const result = await uploadImage(person);
    if (result) {
      results.push(result);
      existing[result.id] = result.url;
    } else {
      failed.push(person);
    }
    await new Promise(r => setTimeout(r, 300));
  }
  
  console.log('\n' + '='.repeat(50));
  console.log(`✅ Uploaded: ${results.length} | ❌ Failed: ${failed.length}`);
  
  // Save combined results
  fs.writeFileSync(path.join(__dirname, 'image-urls.json'), JSON.stringify(existing, null, 2));
  console.log(`\n📄 Updated image-urls.json`);
  
  if (failed.length > 0) {
    console.log('\nStill failing:', failed.map(p => p.name).join(', '));
  }
}

main().catch(console.error);



