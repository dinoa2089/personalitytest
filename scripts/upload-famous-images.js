/**
 * Script to download famous people images and upload to Supabase Storage
 * 
 * Usage: node scripts/upload-famous-images.js
 * 
 * Prerequisites:
 * 1. Create a storage bucket called "famous-images" in Supabase
 * 2. Make the bucket PUBLIC
 * 3. Set your environment variables in .env.local
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const BUCKET_NAME = 'famous-images';

// All famous people with their Wikipedia image URLs
const famousPeople = [
  // INNOVATOR
  { id: 'tony-stark', name: 'Tony Stark', url: 'https://upload.wikimedia.org/wikipedia/en/4/47/Iron_Man_%28circa_2018%29.png' },
  { id: 'doc-brown', name: 'Doc Brown', url: 'https://upload.wikimedia.org/wikipedia/en/8/88/Doc_Brown.png' },
  { id: 'willy-wonka', name: 'Willy Wonka', url: 'https://upload.wikimedia.org/wikipedia/en/6/64/Willy_Wonka_%26_the_Chocolate_Factory_%281971_film_poster%29.png' },
  { id: 'the-doctor', name: 'The Doctor', url: 'https://upload.wikimedia.org/wikipedia/en/a/a5/Doctor_Who_-_Current_Titlecard.png' },
  { id: 'q-bond', name: 'Q', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Ben_Whishaw_by_Gage_Skidmore.jpg/440px-Ben_Whishaw_by_Gage_Skidmore.jpg' },
  { id: 'elon-musk', name: 'Elon Musk', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg/440px-Elon_Musk_Royal_Society_%28crop2%29.jpg' },
  { id: 'richard-branson', name: 'Richard Branson', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Richard_Branson_March_2015_%28cropped%29.jpg/440px-Richard_Branson_March_2015_%28cropped%29.jpg' },
  { id: 'steve-jobs', name: 'Steve Jobs', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Steve_Jobs_Headshot_2010-CROP_%28cropped_2%29.jpg/440px-Steve_Jobs_Headshot_2010-CROP_%28cropped_2%29.jpg' },
  { id: 'nikola-tesla', name: 'Nikola Tesla', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/N.Tesla.JPG/440px-N.Tesla.JPG' },
  { id: 'leonardo-da-vinci', name: 'Leonardo da Vinci', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Francesco_Melzi_-_Portrait_of_Leonardo_da_Vinci_-_RCIN_404775.jpg/440px-Francesco_Melzi_-_Portrait_of_Leonardo_da_Vinci_-_RCIN_404775.jpg' },
  
  // ARCHITECT
  { id: 'batman', name: 'Batman', url: 'https://upload.wikimedia.org/wikipedia/en/c/c7/Batman_Infobox.jpg' },
  { id: 'sherlock-holmes', name: 'Sherlock Holmes', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Sherlock_Holmes_Portrait_Paget.jpg/440px-Sherlock_Holmes_Portrait_Paget.jpg' },
  { id: 'hermione-granger', name: 'Hermione Granger', url: 'https://upload.wikimedia.org/wikipedia/en/d/d3/Hermione_Granger_poster.jpg' },
  { id: 'spock', name: 'Spock', url: 'https://upload.wikimedia.org/wikipedia/en/b/ba/SpockNimoy.jpg' },
  { id: 'walter-white', name: 'Walter White', url: 'https://upload.wikimedia.org/wikipedia/en/0/03/Walter_White_S5B.png' },
  { id: 'bill-gates', name: 'Bill Gates', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Bill_Gates_2018.jpg/440px-Bill_Gates_2018.jpg' },
  { id: 'marie-curie', name: 'Marie Curie', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Marie_Curie_c._1920s.jpg/440px-Marie_Curie_c._1920s.jpg' },
  { id: 'isaac-newton', name: 'Isaac Newton', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/GodfreyKneller-IsaacNewton-1689.jpg/440px-GodfreyKneller-IsaacNewton-1689.jpg' },
  { id: 'ada-lovelace', name: 'Ada Lovelace', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Ada_Lovelace_portrait.jpg/440px-Ada_Lovelace_portrait.jpg' },
  { id: 'alan-turing', name: 'Alan Turing', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Alan_Turing_Aged_16.jpg/440px-Alan_Turing_Aged_16.jpg' },
  
  // CATALYST
  { id: 'ted-lasso', name: 'Ted Lasso', url: 'https://upload.wikimedia.org/wikipedia/en/8/8b/Ted_Lasso_title_card.jpg' },
  { id: 'elle-woods', name: 'Elle Woods', url: 'https://upload.wikimedia.org/wikipedia/en/b/be/Legally_Blonde_film_poster.png' },
  { id: 'star-lord', name: 'Star-Lord', url: 'https://upload.wikimedia.org/wikipedia/en/3/33/Star-Lord_MCU.jpg' },
  { id: 'jack-sparrow', name: 'Jack Sparrow', url: 'https://upload.wikimedia.org/wikipedia/en/a/a2/Jack_Sparrow_In_Pirates_of_the_Caribbean-_At_World%27s_End.JPG' },
  { id: 'michael-scott', name: 'Michael Scott', url: 'https://upload.wikimedia.org/wikipedia/en/d/dc/MichaelScott.png' },
  { id: 'oprah-winfrey', name: 'Oprah Winfrey', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Oprah_in_2014.jpg/440px-Oprah_in_2014.jpg' },
  { id: 'tony-robbins', name: 'Tony Robbins', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Tony_Robbins.jpg/440px-Tony_Robbins.jpg' },
  { id: 'dwayne-johnson', name: 'Dwayne Johnson', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Dwayne_%22The_Rock%22_Johnson_Visits_the_Pentagon_%28cropped%29.jpg/440px-Dwayne_%22The_Rock%22_Johnson_Visits_the_Pentagon_%28cropped%29.jpg' },
  { id: 'ellen-degeneres', name: 'Ellen DeGeneres', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Ellen_DeGeneres_2011.jpg/440px-Ellen_DeGeneres_2011.jpg' },
  { id: 'richard-simmons', name: 'Richard Simmons', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/RichardSimmonsJun10.jpg/440px-RichardSimmonsJun10.jpg' },
  
  // STRATEGIST
  { id: 'captain-america', name: 'Captain America', url: 'https://upload.wikimedia.org/wikipedia/en/a/a1/Captain_America_%28Steve_Rogers%29_MCU.jpg' },
  { id: 'admiral-adama', name: 'Admiral Adama', url: 'https://upload.wikimedia.org/wikipedia/en/3/3f/William_Adama.png' },
  { id: 'ned-stark', name: 'Ned Stark', url: 'https://upload.wikimedia.org/wikipedia/en/d/dc/Ned_Stark-Sean_Bean.jpg' },
  { id: 'jean-luc-picard', name: 'Jean-Luc Picard', url: 'https://upload.wikimedia.org/wikipedia/en/6/62/Jean-Luc_Picard_2.jpg' },
  { id: 'obi-wan-kenobi', name: 'Obi-Wan Kenobi', url: 'https://upload.wikimedia.org/wikipedia/en/3/32/Obi-Wan_Kenobi_%28EP3%29.jpg' },
  { id: 'angela-merkel', name: 'Angela Merkel', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Angela_Merkel_2019_%28cropped%29.jpg/440px-Angela_Merkel_2019_%28cropped%29.jpg' },
  { id: 'warren-buffett', name: 'Warren Buffett', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Warren_Buffett_at_the_2015_SelectUSA_Investment_Summit.jpg/440px-Warren_Buffett_at_the_2015_SelectUSA_Investment_Summit.jpg' },
  { id: 'colin-powell', name: 'Colin Powell', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Colin_Powell_official_Secretary_of_State_photo.jpg/440px-Colin_Powell_official_Secretary_of_State_photo.jpg' },
  { id: 'tim-cook', name: 'Tim Cook', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Tim_Cook_%282017%2C_cropped%29.jpg/440px-Tim_Cook_%282017%2C_cropped%29.jpg' },
  { id: 'sandra-day-oconnor', name: 'Sandra Day O\'Connor', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Sandra_Day_O%27Connor_in_Robes%2C_1982.jpg/440px-Sandra_Day_O%27Connor_in_Robes%2C_1982.jpg' },
  
  // CONNECTOR
  { id: 'samwise-gamgee', name: 'Samwise Gamgee', url: 'https://upload.wikimedia.org/wikipedia/en/e/e4/Sean_Astin_as_Samwise_Gamgee.png' },
  { id: 'olaf', name: 'Olaf', url: 'https://upload.wikimedia.org/wikipedia/en/3/31/Olaf_%28Frozen%29.png' },
  { id: 'hagrid', name: 'Hagrid', url: 'https://upload.wikimedia.org/wikipedia/en/9/9a/Rubeus_Hagrid.jpg' },
  { id: 'paddington-bear', name: 'Paddington Bear', url: 'https://upload.wikimedia.org/wikipedia/en/0/07/Paddington_%28film%29_poster.jpg' },
  { id: 'baymax', name: 'Baymax', url: 'https://upload.wikimedia.org/wikipedia/en/0/05/Big_Hero_6_%28film%29_poster.jpg' },
  { id: 'dolly-parton', name: 'Dolly Parton', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Dolly_Parton_at_Dollywood_%282%29_%28cropped%29.jpg/440px-Dolly_Parton_at_Dollywood_%282%29_%28cropped%29.jpg' },
  { id: 'fred-rogers', name: 'Fred Rogers', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Fred_Rogers%2C_late_1960s.jpg/440px-Fred_Rogers%2C_late_1960s.jpg' },
  { id: 'princess-diana', name: 'Princess Diana', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Diana%2C_Princess_of_Wales_%281961-1997%29.jpg/440px-Diana%2C_Princess_of_Wales_%281961-1997%29.jpg' },
  { id: 'keanu-reeves', name: 'Keanu Reeves', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Keanu_Reeves_2014_%28cropped%29.jpg/440px-Keanu_Reeves_2014_%28cropped%29.jpg' },
  { id: 'steve-irwin', name: 'Steve Irwin', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Lightmatter_SteveIrwin.jpg/440px-Lightmatter_SteveIrwin.jpg' },
  
  // GUARDIAN
  { id: 'atticus-finch', name: 'Atticus Finch', url: 'https://upload.wikimedia.org/wikipedia/en/0/09/Gregory_Peck_as_Atticus.jpg' },
  { id: 'mufasa', name: 'Mufasa', url: 'https://upload.wikimedia.org/wikipedia/en/9/9d/Mufasa.png' },
  { id: 'gandalf', name: 'Gandalf', url: 'https://upload.wikimedia.org/wikipedia/en/e/e9/Gandalf600ppx.jpg' },
  { id: 'wonder-woman', name: 'Wonder Woman', url: 'https://upload.wikimedia.org/wikipedia/en/b/be/Wonder_Woman_DC_Comics.png' },
  { id: 'king-tchaka', name: 'King T\'Chaka', url: 'https://upload.wikimedia.org/wikipedia/en/3/34/T%27Challa_Black_Panther.jpg' },
  { id: 'nelson-mandela', name: 'Nelson Mandela', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Nelson_Mandela_1994.jpg/440px-Nelson_Mandela_1994.jpg' },
  { id: 'ruth-bader-ginsburg', name: 'Ruth Bader Ginsburg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Ruth_Bader_Ginsburg_2016_portrait.jpg/440px-Ruth_Bader_Ginsburg_2016_portrait.jpg' },
  { id: 'malala-yousafzai', name: 'Malala Yousafzai', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Malala_Yousafzai_-_2019_%2846751193954%29_%28cropped%29.jpg/440px-Malala_Yousafzai_-_2019_%2846751193954%29_%28cropped%29.jpg' },
  { id: 'john-lewis', name: 'John Lewis', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/John_Lewis-2006_%28cropped%29.jpg/440px-John_Lewis-2006_%28cropped%29.jpg' },
  { id: 'desmond-tutu', name: 'Desmond Tutu', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Desmond_Tutu_April_2013.jpg/440px-Desmond_Tutu_April_2013.jpg' },
  
  // EXPLORER
  { id: 'indiana-jones', name: 'Indiana Jones', url: 'https://upload.wikimedia.org/wikipedia/en/8/8e/Indiana_Jones_in_Raiders_of_the_Lost_Ark.jpg' },
  { id: 'moana', name: 'Moana', url: 'https://upload.wikimedia.org/wikipedia/en/2/26/Moana_Teaser_Poster.jpg' },
  { id: 'captain-jack-sparrow', name: 'Captain Jack Sparrow', url: 'https://upload.wikimedia.org/wikipedia/en/a/a2/Jack_Sparrow_In_Pirates_of_the_Caribbean-_At_World%27s_End.JPG' },
  { id: 'dora', name: 'Dora the Explorer', url: 'https://upload.wikimedia.org/wikipedia/en/e/e2/Dora_the_Explorer_title_character.png' },
  { id: 'lara-croft', name: 'Lara Croft', url: 'https://upload.wikimedia.org/wikipedia/en/1/1b/Tomb_Raider_%282013_video_game%29_cover.png' },
  { id: 'anthony-bourdain', name: 'Anthony Bourdain', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/AnthonyBourdainByKristinSchiavone.jpg/440px-AnthonyBourdainByKristinSchiavone.jpg' },
  { id: 'jane-goodall', name: 'Jane Goodall', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Jane_Goodall_2015.jpg/440px-Jane_Goodall_2015.jpg' },
  { id: 'bear-grylls', name: 'Bear Grylls', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Bear_Grylls_2.jpg/440px-Bear_Grylls_2.jpg' },
  { id: 'jacques-cousteau', name: 'Jacques Cousteau', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/LeCorsaireJacques-YvesCousteau.jpg/440px-LeCorsaireJacques-YvesCousteau.jpg' },
  { id: 'neil-armstrong', name: 'Neil Armstrong', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Neil_Armstrong_pose.jpg/440px-Neil_Armstrong_pose.jpg' },
  
  // STABILIZER
  { id: 'samwise-gamgee-stabilizer', name: 'Samwise Gamgee (Stabilizer)', url: 'https://upload.wikimedia.org/wikipedia/en/e/e4/Sean_Astin_as_Samwise_Gamgee.png' },
  { id: 'alfred-pennyworth', name: 'Alfred Pennyworth', url: 'https://upload.wikimedia.org/wikipedia/en/0/09/AlfredMichaelCaine.jpg' },
  { id: 'iroh', name: 'Iroh', url: 'https://upload.wikimedia.org/wikipedia/en/9/9a/Iroh_%28Avatar%29.jpg' },
  { id: 'groot', name: 'Groot', url: 'https://upload.wikimedia.org/wikipedia/en/7/76/Groot_movie_pose.png' },
  { id: 'marge-simpson', name: 'Marge Simpson', url: 'https://upload.wikimedia.org/wikipedia/en/0/0b/Marge_Simpson.png' },
  { id: 'dalai-lama', name: 'Dalai Lama', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Dalailama1_20121014_4639.jpg/440px-Dalailama1_20121014_4639.jpg' },
  { id: 'tom-hanks', name: 'Tom Hanks', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Tom_Hanks_TIFF_2019.jpg/440px-Tom_Hanks_TIFF_2019.jpg' },
  { id: 'morgan-freeman', name: 'Morgan Freeman', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Morgan_Freeman_at_The_Pentagon_on_2_August_2023_-_230802-D-PM193-3363_%28cropped%29.jpg/440px-Morgan_Freeman_at_The_Pentagon_on_2_August_2023_-_230802-D-PM193-3363_%28cropped%29.jpg' },
  { id: 'bob-ross', name: 'Bob Ross', url: 'https://upload.wikimedia.org/wikipedia/en/7/70/Bob_at_Easel.jpg' },
  { id: 'thich-nhat-hanh', name: 'Thich Nhat Hanh', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Thich_Nhat_Hanh_12_%28cropped%29.jpg/440px-Thich_Nhat_Hanh_12_%28cropped%29.jpg' },
  
  // VISIONARY
  { id: 'professor-x', name: 'Professor X', url: 'https://upload.wikimedia.org/wikipedia/en/3/3c/Patrick_Stewart_as_Professor_X.jpg' },
  { id: 'dumbledore', name: 'Dumbledore', url: 'https://upload.wikimedia.org/wikipedia/en/4/40/Richard_Harris_as_Albus_Dumbledore.jpg' },
  { id: 'tchalla', name: 'T\'Challa', url: 'https://upload.wikimedia.org/wikipedia/en/3/34/T%27Challa_Black_Panther.jpg' },
  { id: 'morpheus', name: 'Morpheus', url: 'https://upload.wikimedia.org/wikipedia/en/4/4d/Morpheus_%28The_Matrix%29.jpg' },
  { id: 'vision', name: 'Vision', url: 'https://upload.wikimedia.org/wikipedia/en/e/ed/Vision_MCU.jpeg' },
  { id: 'satya-nadella', name: 'Satya Nadella', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Satya_Nadella_%282017%2C_cropped%29.jpg/440px-Satya_Nadella_%282017%2C_cropped%29.jpg' },
  { id: 'jeff-bezos', name: 'Jeff Bezos', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Jeff_Bezos_at_Amazon_Spheres_Grand_Opening_in_Seattle_-_2018_%2839074799225%29_%28cropped%29.jpg/440px-Jeff_Bezos_at_Amazon_Spheres_Grand_Opening_in_Seattle_-_2018_%2839074799225%29_%28cropped%29.jpg' },
  { id: 'sundar-pichai', name: 'Sundar Pichai', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Sundar_Pichai_%282023%2C_cropped%29.jpg/440px-Sundar_Pichai_%282023%2C_cropped%29.jpg' },
  { id: 'mary-barra', name: 'Mary Barra', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Mary_Barra_official_portrait_%28cropped%29.jpg/440px-Mary_Barra_official_portrait_%28cropped%29.jpg' },
  { id: 'reed-hastings', name: 'Reed Hastings', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Reed_Hastings_%282023%2C_cropped%29.jpg/440px-Reed_Hastings_%282023%2C_cropped%29.jpg' },
  
  // HARMONIZER
  { id: 'aang', name: 'Aang', url: 'https://upload.wikimedia.org/wikipedia/en/8/8b/Aang_%28Avatar%29.png' },
  { id: 'belle', name: 'Belle', url: 'https://upload.wikimedia.org/wikipedia/en/b/b4/Belle_%28Disney_character%29.png' },
  { id: 'newt-scamander', name: 'Newt Scamander', url: 'https://upload.wikimedia.org/wikipedia/en/8/8f/Fantastic_Beasts_and_Where_to_Find_Them_poster.jpg' },
  { id: 'steven-universe', name: 'Steven Universe', url: 'https://upload.wikimedia.org/wikipedia/en/0/09/Steven_universe_title.png' },
  { id: 'amelie', name: 'Amélie', url: 'https://upload.wikimedia.org/wikipedia/en/5/53/Amelie_poster.jpg' },
  { id: 'brene-brown', name: 'Brené Brown', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Bren%C3%A9_Brown_%28cropped%29.jpg/440px-Bren%C3%A9_Brown_%28cropped%29.jpg' },
  { id: 'mr-rogers-harmonizer', name: 'Mr. Rogers (Harmonizer)', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Fred_Rogers%2C_late_1960s.jpg/440px-Fred_Rogers%2C_late_1960s.jpg' },
  { id: 'hayao-miyazaki', name: 'Hayao Miyazaki', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Hayao_Miyazaki_at_the_Venice_Film_Festival_2008.jpg/440px-Hayao_Miyazaki_at_the_Venice_Film_Festival_2008.jpg' },
  { id: 'jane-austen', name: 'Jane Austen', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/CassandraAusten-JaneAusten%28c.1810%29_hires.jpg/440px-CassandraAusten-JaneAusten%28c.1810%29_hires.jpg' },
  { id: 'emily-dickinson', name: 'Emily Dickinson', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Emily_Dickinson_daguerreotype_%28Restored_and_cropped%29.jpg/440px-Emily_Dickinson_daguerreotype_%28Restored_and_cropped%29.jpg' },
  
  // ACHIEVER
  { id: 'leslie-knope', name: 'Leslie Knope', url: 'https://upload.wikimedia.org/wikipedia/en/6/63/Leslie_Knope_%28played_by_Amy_Poehler%29.png' },
  { id: 'miranda-priestly', name: 'Miranda Priestly', url: 'https://upload.wikimedia.org/wikipedia/en/a/aa/The_Devil_Wears_Prada_main_characters.jpg' },
  { id: 'harvey-specter', name: 'Harvey Specter', url: 'https://upload.wikimedia.org/wikipedia/en/4/4b/Suits_season_1_promo.jpg' },
  { id: 'don-draper', name: 'Don Draper', url: 'https://upload.wikimedia.org/wikipedia/en/6/60/Don_Draper_Wiki.png' },
  { id: 'rocky-balboa', name: 'Rocky Balboa', url: 'https://upload.wikimedia.org/wikipedia/en/1/18/Rocky_poster.jpg' },
  { id: 'serena-williams', name: 'Serena Williams', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Serena_Williams_at_the_2023_WTA_Finals_%28cropped%29.jpg/440px-Serena_Williams_at_the_2023_WTA_Finals_%28cropped%29.jpg' },
  { id: 'indra-nooyi', name: 'Indra Nooyi', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Indra_Nooyi%2C_New_York_Times_2013.jpg/440px-Indra_Nooyi%2C_New_York_Times_2013.jpg' },
  { id: 'kobe-bryant', name: 'Kobe Bryant', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Kobe_Bryant_2014.jpg/440px-Kobe_Bryant_2014.jpg' },
  { id: 'beyonce', name: 'Beyoncé', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Beyonc%C3%A9_on_the_Red_Carpet_Grammy_2024.jpg/440px-Beyonc%C3%A9_on_the_Red_Carpet_Grammy_2024.jpg' },
  { id: 'michael-jordan', name: 'Michael Jordan', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Michael_Jordan_in_2014.jpg/440px-Michael_Jordan_in_2014.jpg' },
  
  // ANALYST
  { id: 'sherlock-holmes-analyst', name: 'Sherlock Holmes (Analyst)', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Sherlock_Holmes_Portrait_Paget.jpg/440px-Sherlock_Holmes_Portrait_Paget.jpg' },
  { id: 'data', name: 'Data', url: 'https://upload.wikimedia.org/wikipedia/en/0/09/DataTNG.jpg' },
  { id: 'lisbeth-salander', name: 'Lisbeth Salander', url: 'https://upload.wikimedia.org/wikipedia/en/b/bc/TheGirlWithTheDragonTattoo2011Poster.jpg' },
  { id: 'spencer-reid', name: 'Spencer Reid', url: 'https://upload.wikimedia.org/wikipedia/en/9/96/Criminal_Minds_Season_1_DVD.jpg' },
  { id: 'amy-santiago', name: 'Amy Santiago', url: 'https://upload.wikimedia.org/wikipedia/en/d/dc/Brooklyn_nine_nine_season_one_DVD.jpg' },
  { id: 'albert-einstein', name: 'Albert Einstein', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Albert_Einstein_Head.jpg/440px-Albert_Einstein_Head.jpg' },
  { id: 'stephen-hawking', name: 'Stephen Hawking', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Stephen_Hawking.StarChild.jpg/440px-Stephen_Hawking.StarChild.jpg' },
  { id: 'katherine-johnson', name: 'Katherine Johnson', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Katherine_Johnson_1983.jpg/440px-Katherine_Johnson_1983.jpg' },
  { id: 'nate-silver', name: 'Nate Silver', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Nate_Silver_%28cropped%29.jpg/440px-Nate_Silver_%28cropped%29.jpg' },
  { id: 'carl-sagan', name: 'Carl Sagan', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Carl_Sagan_Planetary_Society.JPG/440px-Carl_Sagan_Planetary_Society.JPG' },
];

// Download image from URL
function downloadImage(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const request = protocol.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'image/*,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    }, (response) => {
      // Handle redirects
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        downloadImage(response.headers.location).then(resolve).catch(reject);
        return;
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
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
      reject(new Error('Request timeout'));
    });
  });
}

// Get file extension from URL or content type
function getExtension(url, contentType) {
  const urlExt = path.extname(new URL(url).pathname).toLowerCase();
  if (urlExt && ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(urlExt)) {
    return urlExt;
  }
  if (contentType) {
    const typeMap = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/gif': '.gif',
      'image/webp': '.webp',
    };
    return typeMap[contentType] || '.jpg';
  }
  return '.jpg';
}

async function ensureBucketExists() {
  const { data: buckets, error } = await supabase.storage.listBuckets();
  
  if (error) {
    console.error('Error listing buckets:', error);
    return false;
  }
  
  const bucketExists = buckets.some(b => b.name === BUCKET_NAME);
  
  if (!bucketExists) {
    console.log(`Creating bucket "${BUCKET_NAME}"...`);
    const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
      fileSizeLimit: 5242880, // 5MB
    });
    
    if (createError) {
      console.error('Error creating bucket:', createError);
      console.log('\n⚠️  Please create the bucket manually in Supabase Dashboard:');
      console.log('   1. Go to Storage in your Supabase project');
      console.log('   2. Click "New Bucket"');
      console.log(`   3. Name it "${BUCKET_NAME}" and make it PUBLIC`);
      return false;
    }
    console.log('✅ Bucket created');
  }
  
  return true;
}

async function uploadImage(person) {
  try {
    console.log(`📥 Downloading ${person.name}...`);
    const imageData = await downloadImage(person.url);
    
    const ext = getExtension(person.url);
    const fileName = `${person.id}${ext}`;
    
    console.log(`📤 Uploading ${fileName}...`);
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, imageData, {
        contentType: `image/${ext.slice(1)}`,
        upsert: true,
      });
    
    if (error) {
      console.error(`❌ Failed to upload ${person.name}:`, error.message);
      return null;
    }
    
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);
    
    console.log(`✅ ${person.name}: ${urlData.publicUrl}`);
    return { id: person.id, name: person.name, url: urlData.publicUrl };
  } catch (err) {
    console.error(`❌ Failed for ${person.name}:`, err.message);
    return null;
  }
}

async function main() {
  console.log('🚀 Starting image upload to Supabase Storage\n');
  console.log(`Supabase URL: ${supabaseUrl}`);
  console.log(`Total images: ${famousPeople.length}\n`);
  
  // Ensure bucket exists
  const bucketReady = await ensureBucketExists();
  if (!bucketReady) {
    process.exit(1);
  }
  
  const results = [];
  const failed = [];
  
  // Process images sequentially to avoid rate limiting
  for (const person of famousPeople) {
    const result = await uploadImage(person);
    if (result) {
      results.push(result);
    } else {
      failed.push(person);
    }
    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 500));
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 UPLOAD SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Successfully uploaded: ${results.length}`);
  console.log(`❌ Failed: ${failed.length}`);
  
  if (failed.length > 0) {
    console.log('\nFailed images:');
    failed.forEach(p => console.log(`  - ${p.name}`));
  }
  
  // Generate mapping file
  const mapping = {};
  results.forEach(r => {
    mapping[r.id] = r.url;
  });
  
  const outputPath = path.join(__dirname, 'image-urls.json');
  fs.writeFileSync(outputPath, JSON.stringify(mapping, null, 2));
  console.log(`\n📄 URL mapping saved to: ${outputPath}`);
  
  console.log('\n✨ Done! Now update archetype-examples.ts with the new URLs.');
}

main().catch(console.error);

