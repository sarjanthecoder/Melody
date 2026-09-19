# 🎵 Melody • Next-Gen Music Experience
> **MASSS EDITION • CRAFTED BY SARJAN** ⚡

An ultra-premium, dark AMOLED music streaming and offline playback application built with cutting-edge web technologies and React Native. Combines a bundled zero-data offline Tamil hits library with online YouTube Data API v3 streaming, real-time interactive seekbar dragging, background lock-screen audio, and bespoke vinyl disc aesthetics.

---

## ✨ Features

### 🎧 16 Inbuilt Bundled Tamil Chartbusters (100% Offline)
- **Zero Data Required**: 16 high-bitrate Tamil songs pre-bundled directly into the app assets.
- **Instant Offline Playback**: Instantly playable on device install with no buffering or internet connectivity needed.
- **Rich Metadata & Artwork**: Curated dynamic album art gradients, artist info, movie tags, and synced lyrics.

### 🔴 YouTube Cloud Music Streaming & Live Search
- **YouTube Data API v3**: Search millions of songs, music videos, and indie tracks online directly from within the app.
- **Embedded YouTube Player API**: Seamless YouTube iframe integration with two-way play/pause and seek state synchronization.
- **Smart Source Detection**: Clear visual distinction between `OFFLINE BUNDLED` local tracks and `YouTube Cloud Stream 🔴`.

### 🎚️ Interactive Draggable Scrubber (Seek & Skip)
- **Fluid Touch & Mouse Scrubbing**: Click anywhere along the seekbar or drag the glowing knob to skip to any timestamp in real time.
- **Bidirectional Control**: Dragging updates both offline HTML5 audio playback (`audioEl.currentTime`) and YouTube online streams (`ytPlayer.seekTo`).
- **Live Timestamps**: Dynamic counter displaying current timestamp and total duration down to the second.
- **Mini-Player Scrubbing**: Tap the mini-player progress track at the bottom of the screen to quickly skip through tracks.

### 🔄 Bidirectional Play/Pause Transport Sync
- Transport controls on both the **Floating Mini-Player** and the **Full-Screen Now Playing Modal** stay 100% in sync with YouTube iframe events and offline audio.
- Pausing or playing from the YouTube video frame immediately updates the bottom play/pause button icon, and vice-versa.

### 📱 Background Playback & Lock-Screen Audio Keepalive
- **MediaSession API**: Full lock-screen and notification bar controls (Play, Pause, Next, Previous, Seek) with app branding.
- **Keepalive Audio Loop**: Continuous background audio keepalive preventing mobile browsers and Android WebView from suspending tabs when switching apps.
- **Native Android Foreground Service**: Configured with `FOREGROUND_SERVICE_MEDIA_PLAYBACK` in `MelodyRN/android`.

### 🎨 Obsidian AMOLED Obsidian Aesthetic
- **State-of-the-art UI**: Obsidian slate background (`#07090E`), deep navy elevated surfaces, and neon purple/pink/cyan accents.
- **Vinyl Disc Showcase**: Realistic vinyl groove animations with center hole spindle and frosted glass cards.
- **Zero OS Emojis**: 100% bespoke inline vector SVGs for crisp, modern rendering across all devices.
- **Sarjan Masss Intro Splash Screen**: Circular-cropped logo intro animation with an audio engine loading sequence.

---

## 🎼 Bundled Offline Tracklist (16 Hits)

| # | Song Title | Movie / Album | Artists |
|---|---|---|---|
| 01 | **Un Mela Aasadhaan** | Aayirathil Oruvan | G.V. Prakash Kumar, Dhanush, Andrea |
| 02 | **Maduraikku Pogathadi** | Azhagiya Tamil Magan | A.R. Rahman, Benny Dayal |
| 03 | **Idicha Pacharasi** | Uthama Puthiran | Vijay Antony, Ranjith, Sangeetha |
| 04 | **The Life of Ram (Journey)** | 96 | Govind Vasantha, Pradeep Kumar |
| 05 | **Siriki** | Kaappaan | Harris Jayaraj, Senthil Ganesh |
| 06 | **Adada Mazhaida** | Paiyaa | Yuvan Shankar Raja, Rahul Nambiar |
| 07 | **Pazhaya Soru** | Thirunaal | Srikanth Deva, Namitha, Jiiva |
| 08 | **Pesum Mazhai** | Pesum Mazhai | Ashley Milred, Farhash, Malavika |
| 09 | **Piriyadha Enna** | Pattas | Vivek - Mervin, Vijay Yesudas |
| 10 | **Un Mele Oru Kannu** | Rajinimurugan | D. Imman, Jithin Raj |
| 11 | **Koodamela Koodavechi** | Rummy | D. Imman, V.V. Prassanna |
| 12 | **Kangal Irandal** | Subramaniapuram | James Vasanthan, Belly Raj |
| 13 | **Thaaliyae Thevaiyillai** | Thaamirabharani | Yuvan Shankar Raja, Hariharan |
| 14 | **Thean Kudika** | Thean Kudika | TeeJay ft. Pragathi Guruprasad |
| 15 | **Nee Otha Sollu Sollu** | Aval Peyar Tamilarasi | Vijay Antony, Naresh Iyer |
| 16 | **Usure Needhan Pulla** | Mandaadi | G.V. Prakash Kumar, Mathimaran |

---

## 🏗️ Project Architecture

```
music/
├── preview/                     # Web Application & Mobile Preview
│   ├── index.html              # Full single-page music app (HTML5 + Vanilla CSS + JS)
│   ├── server.js               # Node.js HTTP streaming server with range request support
│   ├── logo.png                # Circular Sarjan Masss Edition app logo
│   └── songs/                  # 16 Bundled MP3 audio files (song_01.mp3 to song_16.mp3)
├── MelodyRN/                    # React Native Android Mobile Application
│   ├── src/
│   │   ├── constants/
│   │   │   └── builtInSongs.ts # Built-in songs, albums, and playlists config
│   │   ├── context/
│   │   │   └── PlayerContext.tsx # Audio engine context with background playback
│   │   └── screens/            # Home, Search, Library, Settings screens
│   └── android/                # Native Android project with media playback services
└── README.md                    # Project documentation
```

---

## 🚀 Getting Started

### 1. Web Preview (Instant Local Run)

Run the high-performance local streaming server:

```bash
node preview/server.js
```

Open your browser and navigate to:
```
http://localhost:3000
```

### 2. React Native Android App

To build and run on an Android device or emulator:

```bash
cd MelodyRN
npm install
npx react-native run-android
```

---

## 🔑 YouTube API Setup

1. Open the app and tap **More** (Settings).
2. Under **YouTube Data API v3**, paste your Google Cloud YouTube API Key.
3. Click **Save & Connect**.
4. Switch to the **Search** tab and click **YouTube Online 🔴** to stream songs online!

---

## 👨‍💻 Author & Credits

- **Creator**: Sarjan (`sarjanthecoder`)
- **App Edition**: Sarjan Masss Edition ⚡
- **Repository**: [https://github.com/sarjanthecoder/Melody.git](https://github.com/sarjanthecoder/Melody.git)
