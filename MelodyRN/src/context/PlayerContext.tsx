import React, {
  createContext,
  useContext,
  useReducer,
  useRef,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Song,
  Album,
  Artist,
  Playlist,
  RepeatMode,
  EqualizerPreset,
  PlayerSettings,
  PlayerState,
  PlayerContextType,
} from '../types/music';
import {
  BUILT_IN_SONGS,
  BUILT_IN_ALBUMS,
  BUILT_IN_ARTISTS,
  BUILT_IN_PLAYLISTS,
} from '../constants/builtInSongs';
import { searchYouTubeVideos, resolveYouTubeAudioStream } from '../services/youtubeService';

const STORAGE_KEYS = {
  LOCAL_SONGS: '@melody_local_songs',
  FAVORITES: '@melody_favorites',
  RECENTLY_PLAYED: '@melody_recently_played',
  SETTINGS: '@melody_settings',
};

const initialSettings: PlayerSettings = {
  offlineMode: false,
  onlineMode: true,
  youtubeApiKey: '',
  theme: 'Dark (Default)',
  audioQuality: 'high',
  sleepTimerMinutes: 0,
  equalizerEnabled: true,
  equalizerPreset: 'Custom',
  equalizerBands: [2, 4, 1, 3, 2],
};

const initialState: PlayerState = {
  songs: BUILT_IN_SONGS,
  albums: BUILT_IN_ALBUMS,
  artists: BUILT_IN_ARTISTS,
  playlists: BUILT_IN_PLAYLISTS,
  currentSong: BUILT_IN_SONGS[0] || null,
  currentIndex: 0,
  queue: BUILT_IN_SONGS,
  isPlaying: false,
  isShuffle: false,
  repeatMode: 'none',
  position: 0,
  duration: BUILT_IN_SONGS[0]?.duration || 275,
  favorites: [],
  recentlyPlayed: [BUILT_IN_SONGS[0]?.id, BUILT_IN_SONGS[1]?.id].filter(Boolean) as string[],
  isLoaded: false,
  settings: initialSettings,
  isNowPlayingOpen: false,
  isDrawerOpen: false,
  isQueueOpen: false,
  isEqualizerOpen: false,
  isSleepTimerOpen: false,
  isLyricsOpen: false,
  currentView: 'home',
  onlineSearchResults: [],
  isSearchingOnline: false,
};

type Action =
  | { type: 'INIT_DATA'; payload: { localSongs: Song[]; favorites: string[]; recentlyPlayed: string[]; settings: Partial<PlayerSettings> } }
  | { type: 'SET_CURRENT_SONG'; payload: { song: Song; index: number } }
  | { type: 'SET_PLAYING'; payload: boolean }
  | { type: 'SET_POSITION'; payload: number }
  | { type: 'SET_DURATION'; payload: number }
  | { type: 'TOGGLE_SHUFFLE' }
  | { type: 'TOGGLE_REPEAT' }
  | { type: 'TOGGLE_FAVORITE'; payload: string }
  | { type: 'ADD_RECENTLY_PLAYED'; payload: string }
  | { type: 'ADD_SONG'; payload: Song }
  | { type: 'SET_SONGS'; payload: Song[] }
  | { type: 'CLEAR_MOCK_DATA' }
  | { type: 'DELETE_SONG'; payload: string }
  | { type: 'RENAME_SONG'; payload: { id: string; title: string } }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<PlayerSettings> }
  | { type: 'SET_EQUALIZER_BAND'; payload: { index: number; value: number } }
  | { type: 'SET_EQUALIZER_PRESET'; payload: EqualizerPreset }
  | { type: 'SET_NOW_PLAYING_OPEN'; payload: boolean }
  | { type: 'SET_DRAWER_OPEN'; payload: boolean }
  | { type: 'SET_QUEUE_OPEN'; payload: boolean }
  | { type: 'SET_EQUALIZER_OPEN'; payload: boolean }
  | { type: 'SET_SLEEP_TIMER_OPEN'; payload: boolean }
  | { type: 'SET_LYRICS_OPEN'; payload: boolean }
  | { type: 'SET_CURRENT_VIEW'; payload: PlayerState['currentView'] }
  | { type: 'SET_ONLINE_RESULTS'; payload: Song[] }
  | { type: 'SET_SEARCHING_ONLINE'; payload: boolean };

function playerReducer(state: PlayerState, action: Action): PlayerState {
  switch (action.type) {
    case 'INIT_DATA': {
      const saved = action.payload.localSongs || [];
      const mergedSongs = [
        ...BUILT_IN_SONGS,
        ...saved.filter(s => !BUILT_IN_SONGS.some(b => b.id === s.id)),
      ];
      return {
        ...state,
        songs: mergedSongs,
        queue: mergedSongs,
        currentSong: state.currentSong || mergedSongs[0] || null,
        duration: (state.currentSong || mergedSongs[0])?.duration || 0,
        favorites: action.payload.favorites || [],
        recentlyPlayed: action.payload.recentlyPlayed?.length > 0
          ? action.payload.recentlyPlayed
          : [BUILT_IN_SONGS[0].id, BUILT_IN_SONGS[1].id],
        settings: { ...state.settings, ...(action.payload.settings || {}) },
        isLoaded: true,
      };
    }
    case 'SET_SONGS': {
      return {
        ...state,
        songs: action.payload,
        queue: action.payload,
        currentSong: action.payload[0] || null,
        currentIndex: 0,
        position: 0,
        duration: action.payload[0]?.duration || 0,
      };
    }
    case 'CLEAR_MOCK_DATA': {
      return {
        ...state,
        songs: [],
        queue: [],
        currentSong: null,
        currentIndex: -1,
        position: 0,
        duration: 0,
      };
    }
    case 'SET_CURRENT_SONG': {
      return {
        ...state,
        currentSong: action.payload.song,
        currentIndex: action.payload.index,
        duration: action.payload.song.duration,
        position: 0,
        isPlaying: true,
      };
    }
    case 'SET_PLAYING':
      return { ...state, isPlaying: action.payload };

    case 'SET_POSITION':
      return { ...state, position: action.payload };

    case 'SET_DURATION':
      return { ...state, duration: action.payload };

    case 'TOGGLE_SHUFFLE': {
      const newShuffle = !state.isShuffle;
      let newQueue = [...state.songs];
      if (newShuffle) {
        newQueue = [...state.songs].sort(() => Math.random() - 0.5);
      }
      return { ...state, isShuffle: newShuffle, queue: newQueue };
    }
    case 'TOGGLE_REPEAT': {
      const nextMode: Record<RepeatMode, RepeatMode> = {
        none: 'all',
        all: 'one',
        one: 'none',
      };
      return { ...state, repeatMode: nextMode[state.repeatMode] };
    }
    case 'TOGGLE_FAVORITE': {
      const isFav = state.favorites.includes(action.payload);
      const updatedFavorites = isFav
        ? state.favorites.filter(id => id !== action.payload)
        : [...state.favorites, action.payload];
      return { ...state, favorites: updatedFavorites };
    }
    case 'ADD_RECENTLY_PLAYED': {
      const filtered = state.recentlyPlayed.filter(id => id !== action.payload);
      return {
        ...state,
        recentlyPlayed: [action.payload, ...filtered].slice(0, 20),
      };
    }
    case 'ADD_SONG': {
      const updated = [...state.songs, action.payload];
      return { ...state, songs: updated, queue: updated };
    }
    case 'DELETE_SONG': {
      const updated = state.songs.filter(s => s.id !== action.payload);
      const isCurrentDeleted = state.currentSong?.id === action.payload;
      return {
        ...state,
        songs: updated,
        queue: state.queue.filter(s => s.id !== action.payload),
        currentSong: isCurrentDeleted ? (updated[0] || null) : state.currentSong,
        isPlaying: isCurrentDeleted ? false : state.isPlaying,
        position: isCurrentDeleted ? 0 : state.position,
      };
    }
    case 'RENAME_SONG': {
      const updated = state.songs.map(s =>
        s.id === action.payload.id ? { ...s, title: action.payload.title } : s
      );
      const updatedCurrent =
        state.currentSong?.id === action.payload.id
          ? { ...state.currentSong, title: action.payload.title }
          : state.currentSong;
      return {
        ...state,
        songs: updated,
        queue: state.queue.map(s =>
          s.id === action.payload.id ? { ...s, title: action.payload.title } : s
        ),
        currentSong: updatedCurrent,
      };
    }
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };

    case 'SET_EQUALIZER_BAND': {
      const newBands = [...state.settings.equalizerBands];
      newBands[action.payload.index] = action.payload.value;
      return {
        ...state,
        settings: {
          ...state.settings,
          equalizerPreset: 'Custom',
          equalizerBands: newBands,
        },
      };
    }
    case 'SET_EQUALIZER_PRESET': {
      let presetBands = [0, 0, 0, 0, 0];
      if (action.payload === 'Pop') presetBands = [-1, 2, 4, 3, 1];
      else if (action.payload === 'Rock') presetBands = [4, 2, -1, 3, 5];
      else if (action.payload === 'Bass') presetBands = [6, 4, 1, 0, -2];
      else if (action.payload === 'Custom') presetBands = state.settings.equalizerBands;

      return {
        ...state,
        settings: {
          ...state.settings,
          equalizerPreset: action.payload,
          equalizerBands: presetBands,
        },
      };
    }
    case 'SET_NOW_PLAYING_OPEN':
      return { ...state, isNowPlayingOpen: action.payload };

    case 'SET_DRAWER_OPEN':
      return { ...state, isDrawerOpen: action.payload };

    case 'SET_QUEUE_OPEN':
      return { ...state, isQueueOpen: action.payload };

    case 'SET_EQUALIZER_OPEN':
      return { ...state, isEqualizerOpen: action.payload };

    case 'SET_SLEEP_TIMER_OPEN':
      return { ...state, isSleepTimerOpen: action.payload };

    case 'SET_LYRICS_OPEN':
      return { ...state, isLyricsOpen: action.payload };

    case 'SET_CURRENT_VIEW':
      return { ...state, currentView: action.payload, isDrawerOpen: false };

    case 'SET_ONLINE_RESULTS':
      return { ...state, onlineSearchResults: action.payload };

    case 'SET_SEARCHING_ONLINE':
      return { ...state, isSearchingOnline: action.payload };

    default:
      return state;
  }
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export const PlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(playerReducer, initialState);
  const positionTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sleepTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load saved data on startup
  useEffect(() => {
    async function loadData() {
      try {
        const [savedSongs, savedFavs, savedRecent, savedSettings] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.LOCAL_SONGS),
          AsyncStorage.getItem(STORAGE_KEYS.FAVORITES),
          AsyncStorage.getItem(STORAGE_KEYS.RECENTLY_PLAYED),
          AsyncStorage.getItem(STORAGE_KEYS.SETTINGS),
        ]);

        dispatch({
          type: 'INIT_DATA',
          payload: {
            localSongs: savedSongs ? JSON.parse(savedSongs) : [],
            favorites: savedFavs ? JSON.parse(savedFavs) : [],
            recentlyPlayed: savedRecent ? JSON.parse(savedRecent) : [],
            settings: savedSettings ? JSON.parse(savedSettings) : {},
          },
        });
      } catch (err) {
        console.warn('Failed to load storage data:', err);
      }
    }
    loadData();
  }, []);

  // Save favorites when changed
  useEffect(() => {
    if (state.isLoaded) {
      AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(state.favorites)).catch(() => {});
    }
  }, [state.favorites, state.isLoaded]);

  // Save recently played when changed
  useEffect(() => {
    if (state.isLoaded) {
      AsyncStorage.setItem(
        STORAGE_KEYS.RECENTLY_PLAYED,
        JSON.stringify(state.recentlyPlayed)
      ).catch(() => {});
    }
  }, [state.recentlyPlayed, state.isLoaded]);

  // Save settings when changed
  useEffect(() => {
    if (state.isLoaded) {
      AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(state.settings)).catch(() => {});
    }
  }, [state.settings, state.isLoaded]);

  // Next song helper
  const nextSong = useCallback(() => {
    if (!state.currentSong || state.queue.length === 0) return;

    if (state.repeatMode === 'one') {
      dispatch({ type: 'SET_POSITION', payload: 0 });
      dispatch({ type: 'SET_PLAYING', payload: true });
      return;
    }

    const currentIndex = state.queue.findIndex(s => s.id === state.currentSong?.id);
    let nextIndex = currentIndex + 1;

    if (nextIndex >= state.queue.length) {
      if (state.repeatMode === 'all') {
        nextIndex = 0;
      } else {
        dispatch({ type: 'SET_PLAYING', payload: false });
        dispatch({ type: 'SET_POSITION', payload: 0 });
        return;
      }
    }

    const nextTrack = state.queue[nextIndex];
    if (nextTrack) {
      dispatch({ type: 'SET_CURRENT_SONG', payload: { song: nextTrack, index: nextIndex } });
      dispatch({ type: 'ADD_RECENTLY_PLAYED', payload: nextTrack.id });
    }
  }, [state.currentSong, state.queue, state.repeatMode]);

  // Previous song helper
  const previousSong = useCallback(() => {
    if (!state.currentSong || state.queue.length === 0) return;

    if (state.position > 3) {
      dispatch({ type: 'SET_POSITION', payload: 0 });
      return;
    }

    const currentIndex = state.queue.findIndex(s => s.id === state.currentSong?.id);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : state.queue.length - 1;
    const prevTrack = state.queue[prevIndex];
    if (prevTrack) {
      dispatch({ type: 'SET_CURRENT_SONG', payload: { song: prevTrack, index: prevIndex } });
      dispatch({ type: 'ADD_RECENTLY_PLAYED', payload: prevTrack.id });
    }
  }, [state.currentSong, state.queue, state.position]);

  // Playback timer (ticker)
  useEffect(() => {
    if (state.isPlaying && state.currentSong) {
      if (positionTimerRef.current) clearInterval(positionTimerRef.current);

      positionTimerRef.current = setInterval(() => {
        dispatch({
          type: 'SET_POSITION',
          payload: state.position + 1,
        });

        if (state.position >= state.duration && state.duration > 0) {
          nextSong();
        }
      }, 1000);
    } else {
      if (positionTimerRef.current) {
        clearInterval(positionTimerRef.current);
        positionTimerRef.current = null;
      }
    }

    return () => {
      if (positionTimerRef.current) {
        clearInterval(positionTimerRef.current);
      }
    };
  }, [state.isPlaying, state.currentSong, state.position, state.duration, nextSong]);

  // Sleep timer handler
  useEffect(() => {
    if (sleepTimerRef.current) {
      clearTimeout(sleepTimerRef.current);
      sleepTimerRef.current = null;
    }

    if (state.settings.sleepTimerMinutes > 0 && state.isPlaying) {
      const ms = state.settings.sleepTimerMinutes * 60 * 1000;
      sleepTimerRef.current = setTimeout(() => {
        dispatch({ type: 'SET_PLAYING', payload: false });
        dispatch({
          type: 'UPDATE_SETTINGS',
          payload: { sleepTimerMinutes: 0 },
        });
      }, ms);
    }

    return () => {
      if (sleepTimerRef.current) clearTimeout(sleepTimerRef.current);
    };
  }, [state.settings.sleepTimerMinutes, state.isPlaying]);

  const soundInstanceRef = useRef<any>(null);

  const playSong = useCallback((song: Song) => {
    const idx = state.queue.findIndex(s => s.id === song.id);
    dispatch({ type: 'SET_CURRENT_SONG', payload: { song, index: idx >= 0 ? idx : 0 } });
    dispatch({ type: 'ADD_RECENTLY_PLAYED', payload: song.id });
    dispatch({ type: 'SET_PLAYING', payload: true });
    dispatch({ type: 'SET_NOW_PLAYING_OPEN', payload: true });

    // Native audio playback via react-native-sound for bundled songs
    try {
      const Sound = require('react-native-sound');
      if (Sound) {
        Sound.setCategory('Playback', true);
        if (soundInstanceRef.current) {
          soundInstanceRef.current.stop();
          soundInstanceRef.current.release();
          soundInstanceRef.current = null;
        }

        const resourceName = song.isBuiltIn ? `${song.id}.mp3` : (song.uri || '');
        const bundle = song.isBuiltIn ? Sound.MAIN_BUNDLE : '';
        const sound = new Sound(resourceName, bundle, (error: any) => {
          if (!error) {
            sound.play(() => {
              nextSong();
            });
            soundInstanceRef.current = sound;
          } else if (song.uri) {
            const soundUri = new Sound(song.uri, '', (err2: any) => {
              if (!err2) {
                soundUri.play(() => nextSong());
                soundInstanceRef.current = soundUri;
              }
            });
          }
        });
      }
    } catch (_) {
      // Audio engine fallback
    }

    // If online YouTube song, resolve audio stream in background
    if (song.isOnline && song.youtubeId) {
      resolveYouTubeAudioStream(song.youtubeId).then(streamUrl => {
        if (streamUrl) {
          console.log('Resolved YouTube audio stream:', streamUrl);
        }
      }).catch(() => {});
    }
  }, [state.queue, nextSong]);

  const pauseSong = useCallback(() => {
    dispatch({ type: 'SET_PLAYING', payload: false });
    try {
      if (soundInstanceRef.current) {
        soundInstanceRef.current.pause();
      }
    } catch (_) {}
  }, []);

  const resumeSong = useCallback(() => {
    if (state.currentSong) {
      dispatch({ type: 'SET_PLAYING', payload: true });
      try {
        if (soundInstanceRef.current) {
          soundInstanceRef.current.play();
        } else {
          playSong(state.currentSong);
        }
      } catch (_) {}
    } else if (state.songs.length > 0) {
      playSong(state.songs[0]);
    }
  }, [state.currentSong, state.songs, playSong]);

  const togglePlayPause = useCallback(() => {
    if (state.isPlaying) {
      pauseSong();
    } else {
      resumeSong();
    }
  }, [state.isPlaying, pauseSong, resumeSong]);

  const seekTo = useCallback((seconds: number) => {
    const clamped = Math.max(0, Math.min(seconds, state.duration));
    dispatch({ type: 'SET_POSITION', payload: clamped });
    try {
      if (soundInstanceRef.current) {
        soundInstanceRef.current.setCurrentTime(clamped);
      }
    } catch (_) {}
  }, [state.duration]);

  const toggleShuffle = useCallback(() => {
    dispatch({ type: 'TOGGLE_SHUFFLE' });
  }, []);

  const toggleRepeat = useCallback(() => {
    dispatch({ type: 'TOGGLE_REPEAT' });
  }, []);

  const toggleFavorite = useCallback((songId: string) => {
    dispatch({ type: 'TOGGLE_FAVORITE', payload: songId });
  }, []);

  const addSong = useCallback((songData: Omit<Song, 'id'>) => {
    const newSong: Song = {
      ...songData,
      id: `imported_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      isBuiltIn: false,
    };
    dispatch({ type: 'ADD_SONG', payload: newSong });
  }, []);

  const deleteSong = useCallback((songId: string) => {
    dispatch({ type: 'DELETE_SONG', payload: songId });
  }, []);

  const renameSong = useCallback((songId: string, newTitle: string) => {
    dispatch({ type: 'RENAME_SONG', payload: { id: songId, title: newTitle } });
  }, []);

  const updateSettings = useCallback((newSettings: Partial<PlayerSettings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: newSettings });
  }, []);

  const setEqualizerBand = useCallback((index: number, value: number) => {
    dispatch({ type: 'SET_EQUALIZER_BAND', payload: { index, value } });
  }, []);

  const setEqualizerPreset = useCallback((preset: EqualizerPreset) => {
    dispatch({ type: 'SET_EQUALIZER_PRESET', payload: preset });
  }, []);

  const setSleepTimer = useCallback((minutes: number) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { sleepTimerMinutes: minutes } });
  }, []);

  const openNowPlaying = useCallback(() => {
    dispatch({ type: 'SET_NOW_PLAYING_OPEN', payload: true });
  }, []);

  const closeNowPlaying = useCallback(() => {
    dispatch({ type: 'SET_NOW_PLAYING_OPEN', payload: false });
  }, []);

  const setDrawerOpen = useCallback((open: boolean) => {
    dispatch({ type: 'SET_DRAWER_OPEN', payload: open });
  }, []);

  const setQueueOpen = useCallback((open: boolean) => {
    dispatch({ type: 'SET_QUEUE_OPEN', payload: open });
  }, []);

  const setEqualizerOpen = useCallback((open: boolean) => {
    dispatch({ type: 'SET_EQUALIZER_OPEN', payload: open });
  }, []);

  const setSleepTimerOpen = useCallback((open: boolean) => {
    dispatch({ type: 'SET_SLEEP_TIMER_OPEN', payload: open });
  }, []);

  const setLyricsOpen = useCallback((open: boolean) => {
    dispatch({ type: 'SET_LYRICS_OPEN', payload: open });
  }, []);

  const setCurrentView = useCallback((view: PlayerState['currentView']) => {
    dispatch({ type: 'SET_CURRENT_VIEW', payload: view });
  }, []);

  // Directory loader: loads 15 real songs from user's local directory path
  const loadSongsFromLocalDirectory = useCallback((newSongs: Song[]) => {
    dispatch({ type: 'SET_SONGS', payload: newSongs });
    AsyncStorage.setItem(STORAGE_KEYS.LOCAL_SONGS, JSON.stringify(newSongs)).catch(() => {});
  }, []);

  // Clear mock data
  const clearMockData = useCallback(() => {
    dispatch({ type: 'CLEAR_MOCK_DATA' });
    AsyncStorage.removeItem(STORAGE_KEYS.LOCAL_SONGS).catch(() => {});
  }, []);

  // YouTube Data API Search
  const searchYouTube = useCallback(
    async (query: string): Promise<Song[]> => {
      if (!query.trim()) {
        dispatch({ type: 'SET_ONLINE_RESULTS', payload: [] });
        return [];
      }
      dispatch({ type: 'SET_SEARCHING_ONLINE', payload: true });
      try {
        const results = await searchYouTubeVideos(query, state.settings.youtubeApiKey);
        dispatch({ type: 'SET_ONLINE_RESULTS', payload: results });
        return results;
      } catch (error) {
        console.warn('YouTube search failed:', error);
        throw error;
      } finally {
        dispatch({ type: 'SET_SEARCHING_ONLINE', payload: false });
      }
    },
    [state.settings.youtubeApiKey]
  );

  const value: PlayerContextType = {
    ...state,
    playSong,
    pauseSong,
    resumeSong,
    togglePlayPause,
    nextSong,
    previousSong,
    seekTo,
    toggleShuffle,
    toggleRepeat,
    toggleFavorite,
    addSong,
    deleteSong,
    renameSong,
    updateSettings,
    setEqualizerBand,
    setEqualizerPreset,
    setSleepTimer,
    openNowPlaying,
    closeNowPlaying,
    setDrawerOpen,
    setQueueOpen,
    setEqualizerOpen,
    setSleepTimerOpen,
    setLyricsOpen,
    setCurrentView,
    loadSongsFromLocalDirectory,
    searchYouTube,
    clearMockData,
  };

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
};

export const usePlayer = (): PlayerContextType => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
