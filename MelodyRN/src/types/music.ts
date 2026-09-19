// Comprehensive Music Player Type Definitions

export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  isBuiltIn?: boolean;
  artwork?: string | null;
  uri?: string | null;
  colorPalette?: [string, string];
  lyrics?: string[];
  isOnline?: boolean;
  youtubeId?: string;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  year?: number;
  songCount: number;
  artworkColors: [string, string];
}

export interface Artist {
  id: string;
  name: string;
  songCount: number;
  avatarColors: [string, string];
}

export interface Playlist {
  id: string;
  title: string;
  songCount: number;
  durationString: string;
  artworkColors: [string, string];
  songIds: string[];
}

export type RepeatMode = 'none' | 'all' | 'one';
export type EqualizerPreset = 'Custom' | 'Pop' | 'Rock' | 'Bass';
export type AppThemeType = 'Dark (Default)' | 'Ocean Blue' | 'Sunset' | 'Forest' | 'Minimal' | 'Purple' | 'Neon';

export interface PlayerSettings {
  offlineMode: boolean;
  onlineMode: boolean;
  youtubeApiKey: string;
  theme: AppThemeType;
  audioQuality: 'low' | 'normal' | 'high' | 'lossless';
  sleepTimerMinutes: number;
  equalizerEnabled: boolean;
  equalizerPreset: EqualizerPreset;
  equalizerBands: number[]; // 5 bands: 60Hz, 230Hz, 910Hz, 3.6kHz, 14kHz (-10 to +10)
}

export interface PlayerState {
  songs: Song[];
  albums: Album[];
  artists: Artist[];
  playlists: Playlist[];
  currentSong: Song | null;
  currentIndex: number;
  queue: Song[];
  isPlaying: boolean;
  isShuffle: boolean;
  repeatMode: RepeatMode;
  position: number;
  duration: number;
  favorites: string[]; // song ids
  recentlyPlayed: string[]; // song ids
  isLoaded: boolean;
  settings: PlayerSettings;
  isNowPlayingOpen: boolean;
  isDrawerOpen: boolean;
  isQueueOpen: boolean;
  isEqualizerOpen: boolean;
  isSleepTimerOpen: boolean;
  isLyricsOpen: boolean;
  currentView: 'home' | 'songs' | 'albums' | 'artists' | 'playlists' | 'search' | 'settings';
  onlineSearchResults: Song[];
  isSearchingOnline: boolean;
}

export interface PlayerContextType extends PlayerState {
  playSong: (song: Song) => void;
  pauseSong: () => void;
  resumeSong: () => void;
  togglePlayPause: () => void;
  nextSong: () => void;
  previousSong: () => void;
  seekTo: (seconds: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  toggleFavorite: (songId: string) => void;
  addSong: (song: Omit<Song, 'id'>) => void;
  deleteSong: (songId: string) => void;
  renameSong: (songId: string, newTitle: string) => void;
  updateSettings: (newSettings: Partial<PlayerSettings>) => void;
  setEqualizerBand: (index: number, value: number) => void;
  setEqualizerPreset: (preset: EqualizerPreset) => void;
  setSleepTimer: (minutes: number) => void;
  openNowPlaying: () => void;
  closeNowPlaying: () => void;
  setDrawerOpen: (open: boolean) => void;
  setQueueOpen: (open: boolean) => void;
  setEqualizerOpen: (open: boolean) => void;
  setSleepTimerOpen: (open: boolean) => void;
  setLyricsOpen: (open: boolean) => void;
  setCurrentView: (view: PlayerState['currentView']) => void;
  loadSongsFromLocalDirectory: (newSongs: Song[]) => void;
  searchYouTube: (query: string) => Promise<Song[]>;
  clearMockData: () => void;
}
