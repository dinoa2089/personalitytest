/**
 * Upload all famous people images for MBTI and Enneagram to Supabase
 * Uses Wikipedia API for reliable image fetching
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

// All people from MBTI types (real people only)
const mbtiPeople = [
  // INTJ
  { id: 'elon-musk', wiki: 'Elon_Musk' },
  { id: 'isaac-newton', wiki: 'Isaac_Newton' },
  { id: 'nikola-tesla', wiki: 'Nikola_Tesla' },
  { id: 'michelle-obama', wiki: 'Michelle_Obama' },
  { id: 'arnold-schwarzenegger', wiki: 'Arnold_Schwarzenegger' },
  { id: 'jodie-foster', wiki: 'Jodie_Foster' },
  { id: 'christopher-nolan', wiki: 'Christopher_Nolan' },
  { id: 'ayn-rand', wiki: 'Ayn_Rand' },
  { id: 'friedrich-nietzsche', wiki: 'Friedrich_Nietzsche' },
  { id: 'hillary-clinton', wiki: 'Hillary_Clinton' },
  { id: 'vladimir-putin', wiki: 'Vladimir_Putin' },
  { id: 'mark-zuckerberg', wiki: 'Mark_Zuckerberg' },
  { id: 'stephen-hawking', wiki: 'Stephen_Hawking' },
  { id: 'cillian-murphy', wiki: 'Cillian_Murphy' },
  { id: 'jay-z', wiki: 'Jay-Z' },
  { id: 'stanley-kubrick', wiki: 'Stanley_Kubrick' },
  { id: 'samantha-power', wiki: 'Samantha_Power' },
  { id: 'ludwig-van-beethoven', wiki: 'Ludwig_van_Beethoven' },
  { id: 'martina-navratilova', wiki: 'Martina_Navratilova' },
  
  // INTP
  { id: 'albert-einstein', wiki: 'Albert_Einstein' },
  { id: 'charles-darwin', wiki: 'Charles_Darwin' },
  { id: 'bill-gates', wiki: 'Bill_Gates' },
  { id: 'marie-curie', wiki: 'Marie_Curie' },
  { id: 'larry-page', wiki: 'Larry_Page' },
  { id: 'tina-fey', wiki: 'Tina_Fey' },
  { id: 'randall-munroe', wiki: 'Randall_Munroe' },
  { id: 'kristen-stewart', wiki: 'Kristen_Stewart' },
  { id: 'jesse-eisenberg', wiki: 'Jesse_Eisenberg' },
  { id: 'ellen-page', wiki: 'Elliot_Page' },
  { id: 'rene-descartes', wiki: 'Ren%C3%A9_Descartes' },
  { id: 'blaise-pascal', wiki: 'Blaise_Pascal' },
  { id: 'abraham-lincoln', wiki: 'Abraham_Lincoln' },
  
  // ENTJ
  { id: 'steve-jobs', wiki: 'Steve_Jobs' },
  { id: 'margaret-thatcher', wiki: 'Margaret_Thatcher' },
  { id: 'gordon-ramsay', wiki: 'Gordon_Ramsay' },
  { id: 'napoleon-bonaparte', wiki: 'Napoleon' },
  { id: 'franklin-d-roosevelt', wiki: 'Franklin_D._Roosevelt' },
  { id: 'julius-caesar', wiki: 'Julius_Caesar' },
  { id: 'harrison-ford', wiki: 'Harrison_Ford' },
  { id: 'whoopi-goldberg', wiki: 'Whoopi_Goldberg' },
  { id: 'adele', wiki: 'Adele' },
  { id: 'salma-hayek', wiki: 'Salma_Hayek' },
  { id: 'charlize-theron', wiki: 'Charlize_Theron' },
  
  // ENTP
  { id: 'barack-obama', wiki: 'Barack_Obama' },
  { id: 'thomas-edison', wiki: 'Thomas_Edison' },
  { id: 'benjamin-franklin', wiki: 'Benjamin_Franklin' },
  { id: 'mark-twain', wiki: 'Mark_Twain' },
  { id: 'weird-al-yankovic', wiki: '%22Weird_Al%22_Yankovic' },
  { id: 'sacha-baron-cohen', wiki: 'Sacha_Baron_Cohen' },
  { id: 'adam-savage', wiki: 'Adam_Savage' },
  { id: 'robert-downey-jr', wiki: 'Robert_Downey_Jr.' },
  { id: 'celine-dion', wiki: 'Celine_Dion' },
  
  // INFJ
  { id: 'martin-luther-king-jr', wiki: 'Martin_Luther_King_Jr.' },
  { id: 'nelson-mandela', wiki: 'Nelson_Mandela' },
  { id: 'carl-jung', wiki: 'Carl_Jung' },
  { id: 'mahatma-gandhi', wiki: 'Mahatma_Gandhi' },
  { id: 'mother-teresa', wiki: 'Mother_Teresa' },
  { id: 'lady-gaga', wiki: 'Lady_Gaga' },
  { id: 'taylor-swift', wiki: 'Taylor_Swift' },
  { id: 'nicole-kidman', wiki: 'Nicole_Kidman' },
  { id: 'noam-chomsky', wiki: 'Noam_Chomsky' },
  { id: 'fyodor-dostoevsky', wiki: 'Fyodor_Dostoevsky' },
  { id: 'agatha-christie', wiki: 'Agatha_Christie' },
  
  // INFP
  { id: 'william-shakespeare', wiki: 'William_Shakespeare' },
  { id: 'j-r-r-tolkien', wiki: 'J._R._R._Tolkien' },
  { id: 'edgar-allan-poe', wiki: 'Edgar_Allan_Poe' },
  { id: 'vincent-van-gogh', wiki: 'Vincent_van_Gogh' },
  { id: 'john-lennon', wiki: 'John_Lennon' },
  { id: 'kurt-cobain', wiki: 'Kurt_Cobain' },
  { id: 'johnny-depp', wiki: 'Johnny_Depp' },
  { id: 'tim-burton', wiki: 'Tim_Burton' },
  { id: 'bjork', wiki: 'Bj%C3%B6rk' },
  { id: 'audrey-hepburn', wiki: 'Audrey_Hepburn' },
  { id: 'princess-diana', wiki: 'Diana,_Princess_of_Wales' },
  { id: 'julia-roberts', wiki: 'Julia_Roberts' },
  { id: 'keanu-reeves', wiki: 'Keanu_Reeves' },
  { id: 'andrew-garfield', wiki: 'Andrew_Garfield' },
  { id: 'tom-hiddleston', wiki: 'Tom_Hiddleston' },
  { id: 'alicia-keys', wiki: 'Alicia_Keys' },
  { id: 'bob-marley', wiki: 'Bob_Marley' },
  
  // ENFJ
  { id: 'oprah-winfrey', wiki: 'Oprah_Winfrey' },
  { id: 'barack-obama', wiki: 'Barack_Obama' },
  { id: 'jennifer-lawrence', wiki: 'Jennifer_Lawrence' },
  { id: 'maya-angelou', wiki: 'Maya_Angelou' },
  { id: 'malala-yousafzai', wiki: 'Malala_Yousafzai' },
  { id: 'matthew-mcconaughey', wiki: 'Matthew_McConaughey' },
  { id: 'emma-stone', wiki: 'Emma_Stone' },
  { id: 'ben-affleck', wiki: 'Ben_Affleck' },
  { id: 'bono', wiki: 'Bono' },
  { id: 'john-cusack', wiki: 'John_Cusack' },
  { id: 'reese-witherspoon', wiki: 'Reese_Witherspoon' },
  
  // ENFP
  { id: 'robin-williams', wiki: 'Robin_Williams' },
  { id: 'jim-carrey', wiki: 'Jim_Carrey' },
  { id: 'ellen-degeneres', wiki: 'Ellen_DeGeneres' },
  { id: 'quentin-tarantino', wiki: 'Quentin_Tarantino' },
  { id: 'oscar-wilde', wiki: 'Oscar_Wilde' },
  { id: 'mark-ruffalo', wiki: 'Mark_Ruffalo' },
  { id: 'drew-barrymore', wiki: 'Drew_Barrymore' },
  { id: 'will-smith', wiki: 'Will_Smith' },
  { id: 'salvador-dali', wiki: 'Salvador_Dal%C3%AD' },
  { id: 'gwen-stefani', wiki: 'Gwen_Stefani' },
  { id: 'sandra-bullock', wiki: 'Sandra_Bullock' },
  { id: 'kat-dennings', wiki: 'Kat_Dennings' },
  { id: 'hunter-s-thompson', wiki: 'Hunter_S._Thompson' },
  
  // ISTJ
  { id: 'george-washington', wiki: 'George_Washington' },
  { id: 'queen-elizabeth-ii', wiki: 'Elizabeth_II' },
  { id: 'warren-buffett', wiki: 'Warren_Buffett' },
  { id: 'angela-merkel', wiki: 'Angela_Merkel' },
  { id: 'jeff-bezos', wiki: 'Jeff_Bezos' },
  { id: 'anthony-hopkins', wiki: 'Anthony_Hopkins' },
  { id: 'denzel-washington', wiki: 'Denzel_Washington' },
  { id: 'natalie-portman', wiki: 'Natalie_Portman' },
  { id: 'george-h-w-bush', wiki: 'George_H._W._Bush' },
  { id: 'condoleezza-rice', wiki: 'Condoleezza_Rice' },
  { id: 'sean-connery', wiki: 'Sean_Connery' },
  { id: 'sting', wiki: 'Sting_(musician)' },
  { id: 'sigourney-weaver', wiki: 'Sigourney_Weaver' },
  
  // ISFJ
  { id: 'queen-elizabeth-ii', wiki: 'Elizabeth_II' },
  { id: 'mother-teresa', wiki: 'Mother_Teresa' },
  { id: 'rosa-parks', wiki: 'Rosa_Parks' },
  { id: 'kate-middleton', wiki: 'Catherine,_Princess_of_Wales' },
  { id: 'anne-hathaway', wiki: 'Anne_Hathaway' },
  { id: 'halle-berry', wiki: 'Halle_Berry' },
  { id: 'selena-gomez', wiki: 'Selena_Gomez' },
  { id: 'vin-diesel', wiki: 'Vin_Diesel' },
  { id: 'ed-sheeran', wiki: 'Ed_Sheeran' },
  { id: 'beyonce', wiki: 'Beyonc%C3%A9' },
  { id: 'dr-phil', wiki: 'Phil_McGraw' },
  { id: 'tiger-woods', wiki: 'Tiger_Woods' },
  { id: 'katie-holmes', wiki: 'Katie_Holmes' },
  
  // ESTJ
  { id: 'henry-ford', wiki: 'Henry_Ford' },
  { id: 'john-d-rockefeller', wiki: 'John_D._Rockefeller' },
  { id: 'judge-judy', wiki: 'Judy_Sheindlin' },
  { id: 'lyndon-b-johnson', wiki: 'Lyndon_B._Johnson' },
  { id: 'sonia-sotomayor', wiki: 'Sonia_Sotomayor' },
  { id: 'michelle-obama', wiki: 'Michelle_Obama' },
  { id: 'emma-watson', wiki: 'Emma_Watson' },
  { id: 'dr-phil', wiki: 'Phil_McGraw' },
  { id: 'daisy-ridley', wiki: 'Daisy_Ridley' },
  { id: 'alec-baldwin', wiki: 'Alec_Baldwin' },
  { id: 'tom-clancy', wiki: 'Tom_Clancy' },
  
  // ESFJ
  { id: 'taylor-swift', wiki: 'Taylor_Swift' },
  { id: 'jennifer-garner', wiki: 'Jennifer_Garner' },
  { id: 'jessica-alba', wiki: 'Jessica_Alba' },
  { id: 'elton-john', wiki: 'Elton_John' },
  { id: 'hugh-jackman', wiki: 'Hugh_Jackman' },
  { id: 'danny-glover', wiki: 'Danny_Glover' },
  { id: 'sally-field', wiki: 'Sally_Field' },
  { id: 'mariah-carey', wiki: 'Mariah_Carey' },
  { id: 'celine-dion', wiki: 'Celine_Dion' },
  { id: 'jennifer-lopez', wiki: 'Jennifer_Lopez' },
  { id: 'terry-bradshaw', wiki: 'Terry_Bradshaw' },
  { id: 'tyra-banks', wiki: 'Tyra_Banks' },
  { id: 'whitney-houston', wiki: 'Whitney_Houston' },
  
  // ISTP
  { id: 'clint-eastwood', wiki: 'Clint_Eastwood' },
  { id: 'bruce-lee', wiki: 'Bruce_Lee' },
  { id: 'michael-jordan', wiki: 'Michael_Jordan' },
  { id: 'tiger-woods', wiki: 'Tiger_Woods' },
  { id: 'tom-cruise', wiki: 'Tom_Cruise' },
  { id: 'daniel-craig', wiki: 'Daniel_Craig' },
  { id: 'kristen-stewart', wiki: 'Kristen_Stewart' },
  { id: 'scarlett-johansson', wiki: 'Scarlett_Johansson' },
  { id: 'megan-fox', wiki: 'Megan_Fox' },
  { id: 'christian-bale', wiki: 'Christian_Bale' },
  { id: 'keith-richards', wiki: 'Keith_Richards' },
  { id: 'venus-williams', wiki: 'Venus_Williams' },
  { id: 'vladimir-putin', wiki: 'Vladimir_Putin' },
  { id: 'snoop-dogg', wiki: 'Snoop_Dogg' },
  { id: 'kobe-bryant', wiki: 'Kobe_Bryant' },
  { id: 'eminem', wiki: 'Eminem' },
  { id: 'avril-lavigne', wiki: 'Avril_Lavigne' },
  
  // ISFP
  { id: 'prince', wiki: 'Prince_(musician)' },
  { id: 'michael-jackson', wiki: 'Michael_Jackson' },
  { id: 'bob-dylan', wiki: 'Bob_Dylan' },
  { id: 'rihanna', wiki: 'Rihanna' },
  { id: 'marilyn-monroe', wiki: 'Marilyn_Monroe' },
  { id: 'brad-pitt', wiki: 'Brad_Pitt' },
  { id: 'david-bowie', wiki: 'David_Bowie' },
  { id: 'lana-del-rey', wiki: 'Lana_Del_Rey' },
  { id: 'kevin-costner', wiki: 'Kevin_Costner' },
  { id: 'paul-mccartney', wiki: 'Paul_McCartney' },
  { id: 'jimi-hendrix', wiki: 'Jimi_Hendrix' },
  { id: 'ryan-gosling', wiki: 'Ryan_Gosling' },
  { id: 'lady-gaga', wiki: 'Lady_Gaga' },
  
  // ESTP
  { id: 'donald-trump', wiki: 'Donald_Trump' },
  { id: 'ernest-hemingway', wiki: 'Ernest_Hemingway' },
  { id: 'dwayne-johnson', wiki: 'Dwayne_Johnson' },
  { id: 'madonna', wiki: 'Madonna_(entertainer)' },
  { id: 'eddie-murphy', wiki: 'Eddie_Murphy' },
  { id: 'samuel-l-jackson', wiki: 'Samuel_L._Jackson' },
  { id: 'jack-nicholson', wiki: 'Jack_Nicholson' },
  { id: 'mila-kunis', wiki: 'Mila_Kunis' },
  { id: 'amy-winehouse', wiki: 'Amy_Winehouse' },
  { id: 'miley-cyrus', wiki: 'Miley_Cyrus' },
  { id: 'bruce-willis', wiki: 'Bruce_Willis' },
  { id: 'antonio-banderas', wiki: 'Antonio_Banderas' },
  { id: 'ben-affleck', wiki: 'Ben_Affleck' },
  { id: 'helen-mirren', wiki: 'Helen_Mirren' },
  { id: 'malcolm-x', wiki: 'Malcolm_X' },
  { id: 'lucille-ball', wiki: 'Lucille_Ball' },
  
  // ESFP
  { id: 'marilyn-monroe', wiki: 'Marilyn_Monroe' },
  { id: 'adele', wiki: 'Adele' },
  { id: 'elvis-presley', wiki: 'Elvis_Presley' },
  { id: 'jamie-foxx', wiki: 'Jamie_Foxx' },
  { id: 'cameron-diaz', wiki: 'Cameron_Diaz' },
  { id: 'nicki-minaj', wiki: 'Nicki_Minaj' },
  { id: 'will-ferrell', wiki: 'Will_Ferrell' },
  { id: 'jamie-oliver', wiki: 'Jamie_Oliver' },
  { id: 'katy-perry', wiki: 'Katy_Perry' },
  { id: 'leonardo-dicaprio', wiki: 'Leonardo_DiCaprio' },
  { id: 'serena-williams', wiki: 'Serena_Williams' },
  { id: 'justin-bieber', wiki: 'Justin_Bieber' },
  { id: 'kylie-jenner', wiki: 'Kylie_Jenner' },
  { id: 'steve-irwin', wiki: 'Steve_Irwin' },
  { id: 'pablo-picasso', wiki: 'Pablo_Picasso' },
];

// All people from Enneagram types
const enneagramPeople = [
  // Type 1
  { id: 'mahatma-gandhi', wiki: 'Mahatma_Gandhi' },
  { id: 'martha-stewart', wiki: 'Martha_Stewart' },
  { id: 'jerry-seinfeld', wiki: 'Jerry_Seinfeld' },
  { id: 'gregory-peck', wiki: 'Gregory_Peck' },
  { id: 'meryl-streep', wiki: 'Meryl_Streep' },
  { id: 'plato', wiki: 'Plato' },
  { id: 'jane-fonda', wiki: 'Jane_Fonda' },
  { id: 'king-charles', wiki: 'Charles_III' },
  { id: 'confucius', wiki: 'Confucius' },
  { id: 'al-gore', wiki: 'Al_Gore' },
  
  // Type 2
  { id: 'dolly-parton', wiki: 'Dolly_Parton' },
  { id: 'desmond-tutu', wiki: 'Desmond_Tutu' },
  { id: 'mr-rogers', wiki: 'Fred_Rogers' },
  { id: 'byron-katie', wiki: 'Byron_Katie' },
  { id: 'stevie-wonder', wiki: 'Stevie_Wonder' },
  { id: 'john-denver', wiki: 'John_Denver' },
  { id: 'richard-simmons', wiki: 'Richard_Simmons' },
  { id: 'barbara-bush', wiki: 'Barbara_Bush' },
  { id: 'eva-peron', wiki: 'Eva_Per%C3%B3n' },
  
  // Type 3
  { id: 'tony-robbins', wiki: 'Tony_Robbins' },
  { id: 'taylor-swift', wiki: 'Taylor_Swift' },
  { id: 'arnold-schwarzenegger', wiki: 'Arnold_Schwarzenegger' },
  { id: 'tom-cruise', wiki: 'Tom_Cruise' },
  { id: 'oprah-winfrey', wiki: 'Oprah_Winfrey' },
  { id: 'lady-gaga', wiki: 'Lady_Gaga' },
  { id: 'muhammed-ali', wiki: 'Muhammad_Ali' },
  { id: 'bill-clinton', wiki: 'Bill_Clinton' },
  { id: 'tiger-woods', wiki: 'Tiger_Woods' },
  
  // Type 4
  { id: 'prince', wiki: 'Prince_(musician)' },
  { id: 'frida-kahlo', wiki: 'Frida_Kahlo' },
  { id: 'johnny-depp', wiki: 'Johnny_Depp' },
  { id: 'edgar-allan-poe', wiki: 'Edgar_Allan_Poe' },
  { id: 'amy-winehouse', wiki: 'Amy_Winehouse' },
  { id: 'anne-frank', wiki: 'Anne_Frank' },
  { id: 'virginia-woolf', wiki: 'Virginia_Woolf' },
  { id: 'joni-mitchell', wiki: 'Joni_Mitchell' },
  { id: 'bob-dylan', wiki: 'Bob_Dylan' },
  
  // Type 5
  { id: 'albert-einstein', wiki: 'Albert_Einstein' },
  { id: 'bill-gates', wiki: 'Bill_Gates' },
  { id: 'stephen-hawking', wiki: 'Stephen_Hawking' },
  { id: 'mark-zuckerberg', wiki: 'Mark_Zuckerberg' },
  { id: 'agatha-christie', wiki: 'Agatha_Christie' },
  { id: 'tim-burton', wiki: 'Tim_Burton' },
  { id: 'jane-goodall', wiki: 'Jane_Goodall' },
  { id: 'jodie-foster', wiki: 'Jodie_Foster' },
  
  // Type 6
  { id: 'mark-twain', wiki: 'Mark_Twain' },
  { id: 'princess-diana', wiki: 'Diana,_Princess_of_Wales' },
  { id: 'jennifer-aniston', wiki: 'Jennifer_Aniston' },
  { id: 'woody-allen', wiki: 'Woody_Allen' },
  { id: 'david-letterman', wiki: 'David_Letterman' },
  { id: 'ellen-degeneres', wiki: 'Ellen_DeGeneres' },
  { id: 'marilyn-monroe', wiki: 'Marilyn_Monroe' },
  { id: 'bruce-springsteen', wiki: 'Bruce_Springsteen' },
  { id: 'jon-stewart', wiki: 'Jon_Stewart' },
  
  // Type 7
  { id: 'robin-williams', wiki: 'Robin_Williams' },
  { id: 'jim-carrey', wiki: 'Jim_Carrey' },
  { id: 'richard-branson', wiki: 'Richard_Branson' },
  { id: 'steven-spielberg', wiki: 'Steven_Spielberg' },
  { id: 'elton-john', wiki: 'Elton_John' },
  { id: 'eddie-murphy', wiki: 'Eddie_Murphy' },
  { id: 'miley-cyrus', wiki: 'Miley_Cyrus' },
  { id: 'katy-perry', wiki: 'Katy_Perry' },
  { id: 'britney-spears', wiki: 'Britney_Spears' },
  { id: 'mozart', wiki: 'Wolfgang_Amadeus_Mozart' },
  
  // Type 8
  { id: 'donald-trump', wiki: 'Donald_Trump' },
  { id: 'martin-luther-king-jr', wiki: 'Martin_Luther_King_Jr.' },
  { id: 'franklin-d-roosevelt', wiki: 'Franklin_D._Roosevelt' },
  { id: 'ernest-hemingway', wiki: 'Ernest_Hemingway' },
  { id: 'queen-latifah', wiki: 'Queen_Latifah' },
  { id: 'serena-williams', wiki: 'Serena_Williams' },
  { id: 'barbara-walters', wiki: 'Barbara_Walters' },
  { id: 'sean-connery', wiki: 'Sean_Connery' },
  { id: 'pink', wiki: 'Pink_(singer)' },
  { id: 'roseanne-barr', wiki: 'Roseanne_Barr' },
  { id: 'winston-churchill', wiki: 'Winston_Churchill' },
  
  // Type 9
  { id: 'barack-obama', wiki: 'Barack_Obama' },
  { id: 'dalai-lama', wiki: '14th_Dalai_Lama' },
  { id: 'abraham-lincoln', wiki: 'Abraham_Lincoln' },
  { id: 'queen-elizabeth-ii', wiki: 'Elizabeth_II' },
  { id: 'keanu-reeves', wiki: 'Keanu_Reeves' },
  { id: 'morgan-freeman', wiki: 'Morgan_Freeman' },
  { id: 'whoopi-goldberg', wiki: 'Whoopi_Goldberg' },
  { id: 'gloria-steinem', wiki: 'Gloria_Steinem' },
  { id: 'ringo-starr', wiki: 'Ringo_Starr' },
  { id: 'woody-harrelson', wiki: 'Woody_Harrelson' },
  { id: 'lisa-kudrow', wiki: 'Lisa_Kudrow' },
  { id: 'ron-howard', wiki: 'Ron_Howard' },
];

// Combine and deduplicate
const allPeople = [...new Map([...mbtiPeople, ...enneagramPeople].map(p => [p.id, p])).values()];

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

async function processOne(person) {
  try {
    const imageUrl = await getWikiImageUrl(person.wiki);
    const imageData = await downloadImage(imageUrl);
    const ext = getExtension(imageUrl);
    const fileName = `${person.id}${ext}`;
    
    await supabase.storage.from(BUCKET_NAME).upload(fileName, imageData, {
      contentType: `image/${ext.slice(1) === 'jpg' ? 'jpeg' : ext.slice(1)}`,
      upsert: true,
    });
    
    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName);
    return { id: person.id, url: data.publicUrl };
  } catch (err) {
    return null;
  }
}

async function main() {
  console.log(`🚀 Uploading ${allPeople.length} personality images to Supabase\n`);
  
  let existing = {};
  try {
    existing = JSON.parse(fs.readFileSync(path.join(__dirname, 'image-urls.json')));
  } catch (e) {}
  
  let uploaded = 0, skipped = 0, failed = 0;
  
  for (let i = 0; i < allPeople.length; i++) {
    const person = allPeople[i];
    
    // Skip if already exists
    if (existing[person.id]) {
      skipped++;
      continue;
    }
    
    process.stdout.write(`[${i+1}/${allPeople.length}] ${person.id}... `);
    const result = await processOne(person);
    
    if (result) {
      existing[result.id] = result.url;
      uploaded++;
      console.log('✅');
    } else {
      failed++;
      console.log('❌');
    }
    
    await new Promise(r => setTimeout(r, 300));
  }
  
  fs.writeFileSync(path.join(__dirname, 'image-urls.json'), JSON.stringify(existing, null, 2));
  
  console.log('\n' + '='.repeat(50));
  console.log(`✅ Uploaded: ${uploaded}`);
  console.log(`⏭️  Skipped (already had): ${skipped}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📄 Total in image-urls.json: ${Object.keys(existing).length}`);
}

main().catch(console.error);



