import React, { createContext, useContext, useReducer, useRef, useCallback, useEffect } from 'react';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BUILT_IN_SONGS } from '../constants/builtInSongs';

const PlayerContext = createContext(null);

const STORAGE_KEYS = {
  SONGS: '@melody_songs',
  FAVORITES: '@melody_favorites',
  RECENTLY_PLAYED: '@melody_recently_played',
  PLAYLISTS: '@melody_playlists',
  SETTINGS: '@melody_settings',
};

const initialState = {
  songs: BUILT_IN_SONGS,
  currentSong: BUILT_IN_SONGS[0] || null,
  currentIndex: 0,
  queue: BUILT_IN_SONGS,
  isPlaying: false,
  isShuffle: false,
  repeatMode: 'none', // 'none', 'all', 'one'
  position: 0,
  duration: BUILT_IN_SONGS[0]?.duration || 275,
  favorites: [],
  recentlyPlayed: [BUILT_IN_SONGS[0]?.id, BUILT_IN_SONGS[1]?.id].filter(Boolean),
  playlists: [],
  isLoaded: false,
  settings: {
    offlineMode: true,
    onlineMode: false,
    youtubeApiKey: '',
    theme: 'dark',
    audioQuality: 'high',
    sleepTimerMinutes: 0,
    equalizerEnabled: false,
    equalizerBands: [0, 0, 0, 0, 0], // 60Hz, 230Hz, 910Hz, 3.6kHz, 14kHz
  },
};

function playerReducer(state, action) {
  switch (action.type) {
    case 'INIT_DATA':
      const imported = action.payload.importedSongs || [];
      const merged = [...BUILT_IN_SONGS, ...imported.filter(s => !BUILT_IN_SONGS.some(b => b.id === s.id))];
      return {
        ...state,
        songs: merged,
        queue: merged,
        currentSong: merged[0] || null,
        duration: merged[0]?.duration || 0,
        favorites: action.payload.favorites || [],
        recentlyPlayed: action.payload.recentlyPlayed?.length > 0 ? action.payload.recentlyPlayed : [BUILT_IN_SONGS[0]?.id, BUILT_IN_SONGS[1]?.id].filter(Boolean),
        playlists: action.payload.playlists || [],
        settings: { ...state.settings, ...(action.payload.settings || {}) },
        isLoaded: true,
      };
    case 'SET_SONGS':
      return { ...state, songs: action.payload };
    case 'ADD_SONG':
      return { ...state, songs: [...state.songs, action.payload] };
    case 'DELETE_SONG':
      return {
        ...state,
        songs: state.songs.filter(s => s.id !== action.payload),
        queue: state.queue.filter(s => s.id !== action.payload),
      };
    case 'RENAME_SONG':
      return {
        ...state,
        songs: state.songs.map(s =>
          s.id === action.payload.id ? { ...s, title: action.payload.title } : s
        ),
      };
    case 'SET_CURRENT_SONG':
      return {
        ...state,
        currentSong: action.payload.song,
        currentIndex: action.payload.index,
        isPlaying: true,
      };
    case 'SET_PLAYING':
      return { ...state, isPlaying: action.payload };
    case 'SET_POSITION':
      return { ...state, position: action.payload };
    case 'SET_DURATION':
      return { ...state, duration: action.payload };
    case 'SET_SHUFFLE':
      return { ...state, isShuffle: action.payload };
    case 'SET_REPEAT':
      return { ...state, repeatMode: action.payload };
    case 'SET_QUEUE':
      return { ...state, queue: action.payload };
    case 'TOGGLE_FAVORITE': {
      const isFav = state.favorites.includes(action.payload);
      return {
        ...state,
        favorites: isFav
          ? state.favorites.filter(id => id !== action.payload)
          : [...state.favorites, action.payload],
      };
    }
    case 'ADD_RECENTLY_PLAYED': {
      const filtered = state.recentlyPlayed.filter(id => id !== action.payload);
      return {
        ...state,
        recentlyPlayed: [action.payload, ...filtered].slice(0, 20),
      };
    }
    case 'CREATE_PLAYLIST':
      return {
        ...state,
        playlists: [...state.playlists, action.payload],
      };
    case 'UPDATE_PLAYLIST':
      return {
        ...state,
        playlists: state.playlists.map(p =>
          p.id === action.payload.id ? action.payload : p
        ),
      };
    case 'DELETE_PLAYLIST':
      return {
        ...state,
        playlists: state.playlists.filter(p => p.id !== action.payload),
      };
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };
    default:
      return state;
  }
}

export function PlayerProvider({ children }) {
  const [state, dispatch] = useReducer(playerReducer, initialState);
  const soundRef = useRef(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  // Load persisted data on mount
  useEffect(() => {
    loadPersistedData();
    setupAudio();
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  // Persist data when it changes
  useEffect(() => {
    if (state.isLoaded) {
      persistData();
    }
  }, [state.favorites, state.recentlyPlayed, state.playlists, state.settings]);

  useEffect(() => {
    if (state.isLoaded) {
      const importedSongs = state.songs.filter(s => !s.isBuiltIn);
      AsyncStorage.setItem(STORAGE_KEYS.SONGS, JSON.stringify(importedSongs));
    }
  }, [state.songs]);

  async function setupAudio() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        interruptionModeIOS: 1,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: 1,
        playThroughEarpieceAndroid: false,
      });
    } catch (e) {
      console.log('Audio setup error:', e);
    }
  }

  async function loadPersistedData() {
    try {
      const [songs, favorites, recentlyPlayed, playlists, settings] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.SONGS),
        AsyncStorage.getItem(STORAGE_KEYS.FAVORITES),
        AsyncStorage.getItem(STORAGE_KEYS.RECENTLY_PLAYED),
        AsyncStorage.getItem(STORAGE_KEYS.PLAYLISTS),
        AsyncStorage.getItem(STORAGE_KEYS.SETTINGS),
      ]);
      dispatch({
        type: 'INIT_DATA',
        payload: {
          importedSongs: songs ? JSON.parse(songs) : [],
          favorites: favorites ? JSON.parse(favorites) : [],
          recentlyPlayed: recentlyPlayed ? JSON.parse(recentlyPlayed) : [],
          playlists: playlists ? JSON.parse(playlists) : [],
          settings: settings ? JSON.parse(settings) : {},
        },
      });
    } catch (e) {
      dispatch({ type: 'INIT_DATA', payload: {} });
    }
  }

  async function persistData() {
    const s = stateRef.current;
    try {
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(s.favorites)),
        AsyncStorage.setItem(STORAGE_KEYS.RECENTLY_PLAYED, JSON.stringify(s.recentlyPlayed)),
        AsyncStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(s.playlists)),
        AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(s.settings)),
      ]);
    } catch (e) {}
  }

  const onPlaybackStatusUpdate = useCallback((status) => {
    if (!status.isLoaded) return;
    dispatch({ type: 'SET_POSITION', payload: status.positionMillis / 1000 });
    dispatch({ type: 'SET_DURATION', payload: status.durationMillis ? status.durationMillis / 1000 : 0 });
    if (status.didJustFinish) {
      handleSongEnd();
    }
  }, []);

  async function handleSongEnd() {
    const s = stateRef.current;
    if (s.repeatMode === 'one') {
      await seekTo(0);
      await playCurrentSound();
    } else if (s.repeatMode === 'all' || s.currentIndex < s.queue.length - 1) {
      await playNext();
    } else {
      dispatch({ type: 'SET_PLAYING', payload: false });
    }
  }

  async function playSong(song, queue = null, index = null) {
    try {
      // Unload current
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      const s = stateRef.current;
      const songQueue = queue || s.songs;
      const songIndex = index !== null ? index : songQueue.findIndex(s => s.id === song.id);

      dispatch({ type: 'SET_CURRENT_SONG', payload: { song, index: songIndex } });
      dispatch({ type: 'SET_QUEUE', payload: songQueue });
      dispatch({ type: 'ADD_RECENTLY_PLAYED', payload: song.id });

      // Only play if has URI (imported song)
      if (song.uri) {
        const { sound } = await Audio.Sound.createAsync(
          { uri: song.uri },
          { shouldPlay: true, progressUpdateIntervalMillis: 500 },
          onPlaybackStatusUpdate
        );
        soundRef.current = sound;
        dispatch({ type: 'SET_PLAYING', payload: true });
      } else {
        // Demo song - simulate playback
        dispatch({ type: 'SET_PLAYING', payload: true });
        dispatch({ type: 'SET_DURATION', payload: song.duration || 200 });
      }
    } catch (e) {
      console.log('Play error:', e);
    }
  }

  async function playCurrentSound() {
    if (soundRef.current) {
      await soundRef.current.playAsync();
    }
    dispatch({ type: 'SET_PLAYING', payload: true });
  }

  async function pauseSong() {
    if (soundRef.current) {
      await soundRef.current.pauseAsync();
    }
    dispatch({ type: 'SET_PLAYING', payload: false });
  }

  async function togglePlay() {
    if (stateRef.current.isPlaying) {
      await pauseSong();
    } else {
      await playCurrentSound();
    }
  }

  async function playNext() {
    const s = stateRef.current;
    if (!s.queue.length) return;
    let nextIndex;
    if (s.isShuffle) {
      nextIndex = Math.floor(Math.random() * s.queue.length);
    } else {
      nextIndex = (s.currentIndex + 1) % s.queue.length;
    }
    const nextSong = s.queue[nextIndex];
    if (nextSong) await playSong(nextSong, s.queue, nextIndex);
  }

  async function playPrev() {
    const s = stateRef.current;
    if (!s.queue.length) return;
    if (s.position > 3) {
      await seekTo(0);
      return;
    }
    const prevIndex = s.currentIndex > 0 ? s.currentIndex - 1 : s.queue.length - 1;
    const prevSong = s.queue[prevIndex];
    if (prevSong) await playSong(prevSong, s.queue, prevIndex);
  }

  async function seekTo(seconds) {
    if (soundRef.current) {
      await soundRef.current.setPositionAsync(seconds * 1000);
    }
    dispatch({ type: 'SET_POSITION', payload: seconds });
  }

  function toggleShuffle() {
    dispatch({ type: 'SET_SHUFFLE', payload: !stateRef.current.isShuffle });
  }

  function cycleRepeat() {
    const modes = ['none', 'all', 'one'];
    const current = stateRef.current.repeatMode;
    const next = modes[(modes.indexOf(current) + 1) % modes.length];
    dispatch({ type: 'SET_REPEAT', payload: next });
  }

  function toggleFavorite(songId) {
    dispatch({ type: 'TOGGLE_FAVORITE', payload: songId });
  }

  function addSong(song) {
    dispatch({ type: 'ADD_SONG', payload: song });
  }

  function deleteSong(songId) {
    dispatch({ type: 'DELETE_SONG', payload: songId });
  }

  function renameSong(id, title) {
    dispatch({ type: 'RENAME_SONG', payload: { id, title } });
  }

  function createPlaylist(name) {
    const playlist = {
      id: `playlist_${Date.now()}`,
      name,
      songIds: [],
      createdAt: Date.now(),
    };
    dispatch({ type: 'CREATE_PLAYLIST', payload: playlist });
    return playlist;
  }

  function addToPlaylist(playlistId, songId) {
    const playlist = stateRef.current.playlists.find(p => p.id === playlistId);
    if (playlist && !playlist.songIds.includes(songId)) {
      dispatch({
        type: 'UPDATE_PLAYLIST',
        payload: { ...playlist, songIds: [...playlist.songIds, songId] },
      });
    }
  }

  function removeFromPlaylist(playlistId, songId) {
    const playlist = stateRef.current.playlists.find(p => p.id === playlistId);
    if (playlist) {
      dispatch({
        type: 'UPDATE_PLAYLIST',
        payload: { ...playlist, songIds: playlist.songIds.filter(id => id !== songId) },
      });
    }
  }

  function deletePlaylist(playlistId) {
    dispatch({ type: 'DELETE_PLAYLIST', payload: playlistId });
  }

  function updateSettings(settings) {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  }

  const value = {
    ...state,
    playSong,
    pauseSong,
    togglePlay,
    playNext,
    playPrev,
    seekTo,
    toggleShuffle,
    cycleRepeat,
    toggleFavorite,
    addSong,
    deleteSong,
    renameSong,
    createPlaylist,
    addToPlaylist,
    removeFromPlaylist,
    deletePlaylist,
    updateSettings,
  };

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider');
  return ctx;
}
