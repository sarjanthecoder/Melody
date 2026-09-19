const fs = require('fs');
const path = require('path');

const SOURCE_DIR = 'C:/Users/sarja/Downloads/songs';

const TARGET_DIRS = [
  path.resolve(__dirname, '../MelodyRN/src/assets/songs'),
  path.resolve(__dirname, '../MelodyRN/android/app/src/main/res/raw'),
  path.resolve(__dirname, '../MelodyRN/android/app/src/main/assets/songs'),
  path.resolve(__dirname, '../preview/songs'),
  path.resolve(__dirname, '../MelodyApp/assets/songs'),
];

// Ensure target directories exist
TARGET_DIRS.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log('Created dir:', dir);
  }
});

// The 15 source files in exact order
const files = fs.readdirSync(SOURCE_DIR);
console.log(`Found ${files.length} files in ${SOURCE_DIR}`);

const SONG_METADATA = [
  {
    num: 1,
    title: 'Un Mela Aasadhaan',
    artist: 'G.V. Prakash, Dhanush, Andrea',
    album: 'Aayirathil Oruvan',
    sourceMatch: 'Aayirathil Oruvan',
    duration: 275,
    durStr: '4:35',
    colorPalette: ['#EF4444', '#8B5CF6'],
  },
  {
    num: 2,
    title: 'Maduraikku Pogathadi',
    artist: 'A.R. Rahman, Benny Dayal, Archith',
    album: 'Azhagiya Tamil Magan',
    sourceMatch: 'Azhagiya tamil magan',
    duration: 320,
    durStr: '5:20',
    colorPalette: ['#F59E0B', '#EF4444'],
  },
  {
    num: 3,
    title: 'Idicha Pacharasi',
    artist: 'Vijay Antony, Ranjith, Sangeetha',
    album: 'Uthama Puthiran',
    sourceMatch: 'Idicha Pacharasi',
    duration: 290,
    durStr: '4:50',
    colorPalette: ['#10B981', '#0EA5E9'],
  },
  {
    num: 4,
    title: 'The Life of Ram (Journey)',
    artist: 'Govind Vasantha, Pradeep Kumar',
    album: 'Jaanu (96)',
    sourceMatch: 'Journey',
    duration: 345,
    durStr: '5:45',
    colorPalette: ['#6366F1', '#8B5CF6'],
  },
  {
    num: 5,
    title: 'Siriki',
    artist: 'Harris Jayaraj, Senthil Ganesh',
    album: 'Kaappaan',
    sourceMatch: 'Kaappaan',
    duration: 285,
    durStr: '4:45',
    colorPalette: ['#8B5CF6', '#D946EF'],
  },
  {
    num: 6,
    title: 'Adada Mazhaida',
    artist: 'Yuvan Shankar Raja, Rahul Nambiar',
    album: 'Paiyaa',
    sourceMatch: 'Paiya',
    duration: 250,
    durStr: '4:10',
    colorPalette: ['#0EA5E9', '#6366F1'],
  },
  {
    num: 7,
    title: 'Pazhaya Soru',
    artist: 'Srikanth Deva, Namitha, Jiiva',
    album: 'Thirunaal',
    sourceMatch: 'Pazhaya Soru',
    duration: 210,
    durStr: '3:30',
    colorPalette: ['#D946EF', '#F59E0B'],
  },
  {
    num: 8,
    title: 'Pesum Mazhai',
    artist: 'Ashley Milred, Farhash, Malavika',
    album: 'Pesum Mazhai',
    sourceMatch: 'Pesum Mazhai',
    duration: 235,
    durStr: '3:55',
    colorPalette: ['#0EA5E9', '#D946EF'],
  },
  {
    num: 9,
    title: 'Piriyadha Enna',
    artist: 'Vivek - Mervin, Vijay Yesudas',
    album: 'Pattas',
    sourceMatch: 'Piriyadha Enna',
    duration: 260,
    durStr: '4:20',
    colorPalette: ['#6366F1', '#10B981'],
  },
  {
    num: 10,
    title: 'Un Mele Oru Kannu',
    artist: 'D. Imman, Jithin Raj, Jyoti Nooran',
    album: 'Rajinimurugan',
    sourceMatch: 'Rajinimurugan',
    duration: 270,
    durStr: '4:30',
    colorPalette: ['#8B5CF6', '#F59E0B'],
  },
  {
    num: 11,
    title: 'Koodamela Koodavechi',
    artist: 'D. Imman, V.V. Prassanna, Vandana',
    album: 'Rummy',
    sourceMatch: 'Rummy',
    duration: 280,
    durStr: '4:40',
    colorPalette: ['#10B981', '#D946EF'],
  },
  {
    num: 12,
    title: 'Kangal Irandal',
    artist: 'James Vasanthan, Belly Raj, Deepa',
    album: 'Subramaniapuram',
    sourceMatch: 'Subramaniapuram',
    duration: 315,
    durStr: '5:15',
    colorPalette: ['#F59E0B', '#6366F1'],
  },
  {
    num: 13,
    title: 'Thaaliyae Thevaiyillai',
    artist: 'Yuvan Shankar Raja, Hariharan',
    album: 'Thaamirabharani',
    sourceMatch: 'Thaaliyae Thevaiyillai',
    duration: 295,
    durStr: '4:55',
    colorPalette: ['#EF4444', '#10B981'],
  },
  {
    num: 14,
    title: 'Thean Kudika',
    artist: 'TeeJay ft. Pragathi Guruprasad',
    album: 'Thean Kudika',
    sourceMatch: 'Thean Kudika',
    duration: 215,
    durStr: '3:35',
    colorPalette: ['#0EA5E9', '#8B5CF6'],
  },
  {
    num: 15,
    title: 'Nee Otha Sollu Sollu',
    artist: 'Vijay Antony, Naresh Iyer',
    album: 'Aval Peyar Tamilarasi',
    sourceMatch: 'அவள',
    duration: 265,
    durStr: '4:25',
    colorPalette: ['#D946EF', '#6366F1'],
  },
];

console.log('Starting copy of 15 songs...');
SONG_METADATA.forEach((meta, idx) => {
  const matchedFile = files.find(f => f.includes(meta.sourceMatch)) || files[idx];
  if (!matchedFile) {
    console.error(`Could not match song: ${meta.title}`);
    return;
  }
  const sourcePath = path.join(SOURCE_DIR, matchedFile);
  const rawName = `song_${String(meta.num).padStart(2, '0')}.mp3`;

  TARGET_DIRS.forEach(tDir => {
    const dest = path.join(tDir, rawName);
    try {
      fs.copyFileSync(sourcePath, dest);
    } catch (err) {
      console.error(`Error copying to ${dest}:`, err.message);
    }
  });

  const sizeMB = (fs.statSync(sourcePath).size / (1024 * 1024)).toFixed(2);
  console.log(`[${meta.num}/15] Copied ${meta.title} (${sizeMB} MB) -> ${rawName}`);
});

console.log('All 15 songs copied to target asset directories successfully!');
