/**
 * Upload all missing images to Supabase using Wikipedia API
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const https = require('https');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const BUCKET_NAME = 'famous-images';

// All missing people that need images
const missingPeople = [
  // Philosophers and historical figures
  { name: "Socrates", wiki: "Socrates" },
  { name: "Rene Descartes", wiki: "René_Descartes" },
  { name: "Immanuel Kant", wiki: "Immanuel_Kant" },
  { name: "Voltaire", wiki: "Voltaire" },
  { name: "Karl Marx", wiki: "Karl_Marx" },
  { name: "Sigmund Freud", wiki: "Sigmund_Freud" },
  { name: "Simone de Beauvoir", wiki: "Simone_de_Beauvoir" },
  
  // Authors
  { name: "Harper Lee", wiki: "Harper_Lee" },
  { name: "Isaac Asimov", wiki: "Isaac_Asimov" },
  { name: "Lewis Carroll", wiki: "Lewis_Carroll" },
  { name: "Ursula K. Le Guin", wiki: "Ursula_K._Le_Guin" },
  { name: "Sylvia Plath", wiki: "Sylvia_Plath" },
  
  // Scientists/Tech
  { name: "Edward Snowden", wiki: "Edward_Snowden" },
  { name: "Richard Dawkins", wiki: "Richard_Dawkins" },
  { name: "Oliver Sacks", wiki: "Oliver_Sacks" },
  { name: "Anthony Fauci", wiki: "Anthony_Fauci" },
  
  // Politicians
  { name: "Jimmy Carter", wiki: "Jimmy_Carter" },
  { name: "Richard Nixon", wiki: "Richard_Nixon" },
  { name: "Theodore Roosevelt", wiki: "Theodore_Roosevelt" },
  { name: "John F. Kennedy", wiki: "John_F._Kennedy" },
  { name: "Robert F. Kennedy", wiki: "Robert_F._Kennedy" },
  { name: "Nancy Pelosi", wiki: "Nancy_Pelosi" },
  { name: "Kamala Harris", wiki: "Kamala_Harris" },
  { name: "John McCain", wiki: "John_McCain" },
  { name: "Prince William", wiki: "Prince_William,_Duke_of_Cornwall" },
  { name: "Eleanor Roosevelt", wiki: "Eleanor_Roosevelt" },
  { name: "Indira Gandhi", wiki: "Indira_Gandhi" },
  { name: "Fidel Castro", wiki: "Fidel_Castro" },
  
  // Business
  { name: "Sheryl Sandberg", wiki: "Sheryl_Sandberg" },
  { name: "Walt Disney", wiki: "Walt_Disney" },
  { name: "Andrew Carnegie", wiki: "Andrew_Carnegie" },
  { name: "Sam Walton", wiki: "Sam_Walton" },
  
  // Musicians
  { name: "Bjork", wiki: "Björk" },
  { name: "Aretha Franklin", wiki: "Aretha_Franklin" },
  { name: "Frank Sinatra", wiki: "Frank_Sinatra" },
  { name: "Mick Jagger", wiki: "Mick_Jagger" },
  { name: "Janis Joplin", wiki: "Janis_Joplin" },
  { name: "John Legend", wiki: "John_Legend" },
  { name: "Shakira", wiki: "Shakira" },
  { name: "Billie Eilish", wiki: "Billie_Eilish" },
  { name: "Drake", wiki: "Drake_(musician)" },
  { name: "Florence Welch", wiki: "Florence_Welch" },
  { name: "Kate Bush", wiki: "Kate_Bush" },
  { name: "Barry Manilow", wiki: "Barry_Manilow" },
  { name: "Tchaikovsky", wiki: "Pyotr_Ilyich_Tchaikovsky" },
  { name: "Kelly Clarkson", wiki: "Kelly_Clarkson" },
  { name: "Cher", wiki: "Cher" },
  { name: "Dr. Dre", wiki: "Dr._Dre" },
  { name: "Chris Rock", wiki: "Chris_Rock" },
  { name: "Adam Levine", wiki: "Adam_Levine" },
  { name: "Zac Efron", wiki: "Zac_Efron" },
  { name: "Bette Midler", wiki: "Bette_Midler" },
  { name: "Sarah Silverman", wiki: "Sarah_Silverman" },
  
  // Actors
  { name: "Patrick Stewart", wiki: "Patrick_Stewart" },
  { name: "George Clooney", wiki: "George_Clooney" },
  { name: "Ryan Reynolds", wiki: "Ryan_Reynolds" },
  { name: "Neil Patrick Harris", wiki: "Neil_Patrick_Harris" },
  { name: "Amy Poehler", wiki: "Amy_Poehler" },
  { name: "Matthew Perry", wiki: "Matthew_Perry" },
  { name: "Hugh Laurie", wiki: "Hugh_Laurie" },
  { name: "Cate Blanchett", wiki: "Cate_Blanchett" },
  { name: "Al Pacino", wiki: "Al_Pacino" },
  { name: "Edward Norton", wiki: "Edward_Norton" },
  { name: "Daniel Day-Lewis", wiki: "Daniel_Day-Lewis" },
  { name: "Rooney Mara", wiki: "Rooney_Mara" },
  { name: "Heath Ledger", wiki: "Heath_Ledger" },
  { name: "Emily Blunt", wiki: "Emily_Blunt" },
  { name: "Helena Bonham Carter", wiki: "Helena_Bonham_Carter" },
  { name: "Emma Thompson", wiki: "Emma_Thompson" },
  { name: "Ben Stiller", wiki: "Ben_Stiller" },
  { name: "Dakota Fanning", wiki: "Dakota_Fanning" },
  { name: "Kate Winslet", wiki: "Kate_Winslet" },
  { name: "Russell Brand", wiki: "Russell_Brand" },
  { name: "Keira Knightley", wiki: "Keira_Knightley" },
  { name: "Robert De Niro", wiki: "Robert_De_Niro" },
  { name: "Matt Damon", wiki: "Matt_Damon" },
  { name: "Jackie Chan", wiki: "Jackie_Chan" },
  { name: "Kim Kardashian", wiki: "Kim_Kardashian" },
  { name: "Christopher Walken", wiki: "Christopher_Walken" },
  { name: "Michelle Pfeiffer", wiki: "Michelle_Pfeiffer" },
  { name: "Danny DeVito", wiki: "Danny_DeVito" },
  { name: "Milla Jovovich", wiki: "Milla_Jovovich" },
  { name: "Simon Cowell", wiki: "Simon_Cowell" },
  { name: "Katharine Hepburn", wiki: "Katharine_Hepburn" },
  { name: "John Travolta", wiki: "John_Travolta" },
  { name: "Jared Leto", wiki: "Jared_Leto" },
  { name: "Angelina Jolie", wiki: "Angelina_Jolie" },
  { name: "Nicolas Cage", wiki: "Nicolas_Cage" },
  { name: "Kevin Bacon", wiki: "Kevin_Bacon" },
  { name: "Eva Longoria", wiki: "Eva_Longoria" },
  { name: "Sylvester Stallone", wiki: "Sylvester_Stallone" },
  { name: "James Dean", wiki: "James_Dean" },
  { name: "Marlon Brando", wiki: "Marlon_Brando" },
  { name: "Winona Ryder", wiki: "Winona_Ryder" },
  { name: "Tilda Swinton", wiki: "Tilda_Swinton" },
  { name: "Spike Lee", wiki: "Spike_Lee" },
  { name: "Mel Gibson", wiki: "Mel_Gibson" },
  { name: "Diane Keaton", wiki: "Diane_Keaton" },
  { name: "Jack Black", wiki: "Jack_Black" },
  { name: "Russell Crowe", wiki: "Russell_Crowe" },
  { name: "Tommy Lee Jones", wiki: "Tommy_Lee_Jones" },
  { name: "Grace Kelly", wiki: "Grace_Kelly" },
  { name: "Jeff Bridges", wiki: "Jeff_Bridges" },
  { name: "Renee Zellweger", wiki: "Renée_Zellweger" },
  
  // TV Hosts/Media
  { name: "Weird Al Yankovic", wiki: "\"Weird_Al\"_Yankovic" },
  { name: "Steve Harvey", wiki: "Steve_Harvey" },
  { name: "Larry King", wiki: "Larry_King" },
  { name: "Ryan Seacrest", wiki: "Ryan_Seacrest" },
  { name: "Kris Jenner", wiki: "Kris_Jenner" },
  { name: "Howard Stern", wiki: "Howard_Stern" },
  { name: "Jim Henson", wiki: "Jim_Henson" },
  
  // Directors
  { name: "Federico Fellini", wiki: "Federico_Fellini" },
  
  // Sports
  { name: "Lance Armstrong", wiki: "Lance_Armstrong" },
  { name: "Magic Johnson", wiki: "Magic_Johnson" },
  { name: "Bobby Fischer", wiki: "Bobby_Fischer" },
  { name: "Vince Lombardi", wiki: "Vince_Lombardi" },
  { name: "Burt Reynolds", wiki: "Burt_Reynolds" },
  
  // Historical
  { name: "Florence Nightingale", wiki: "Florence_Nightingale" },
  { name: "Amelia Earhart", wiki: "Amelia_Earhart" },
  { name: "John Wayne", wiki: "John_Wayne" },
  { name: "Steve McQueen", wiki: "Steve_McQueen" },
  { name: "Chuck Yeager", wiki: "Chuck_Yeager" },
  { name: "Bob Hope", wiki: "Bob_Hope" },
  { name: "Nancy Reagan", wiki: "Nancy_Reagan" },
  { name: "Billy Graham", wiki: "Billy_Graham" },
  
  // Others
  { name: "Pope Francis", wiki: "Pope_Francis" },
  { name: "Pope John Paul II", wiki: "Pope_John_Paul_II" },
  { name: "Gary Larson", wiki: "Gary_Larson" },
  { name: "David Byrne", wiki: "David_Byrne" },
  { name: "Joseph Campbell", wiki: "Joseph_Campbell" },
  { name: "Carl Rogers", wiki: "Carl_Rogers" },
  { name: "50 Cent", wiki: "50_Cent" },
  { name: "David Copperfield", wiki: "David_Copperfield_(illusionist)" },
  
  // Fictional characters (will need special handling)
  { name: "Dora the Explorer", wiki: "Dora_the_Explorer" },
  { name: "Steven Universe", wiki: "Steven_Universe_(character)" },
  { name: "James Bond", wiki: "James_Bond" },
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
  console.log(`🚀 Uploading ${missingPeople.length} missing images\n`);
  
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

