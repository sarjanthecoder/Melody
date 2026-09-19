import { Song, Album, Artist, Playlist } from '../types/music';

export const ARTWORK_COLORS: [string, string][] = [
  ['#6366F1', '#8B5CF6'],
  ['#8B5CF6', '#D946EF'],
  ['#0EA5E9', '#6366F1'],
  ['#10B981', '#0EA5E9'],
  ['#F59E0B', '#EF4444'],
  ['#EF4444', '#8B5CF6'],
  ['#D946EF', '#F59E0B'],
  ['#6366F1', '#10B981'],
  ['#0EA5E9', '#D946EF'],
  ['#8B5CF6', '#F59E0B'],
  ['#10B981', '#D946EF'],
  ['#F59E0B', '#6366F1'],
  ['#EF4444', '#10B981'],
  ['#0EA5E9', '#8B5CF6'],
  ['#D946EF', '#6366F1'],
];

// Completely clean - all mock songs removed!
// Waiting for the user to provide their directory path with 15 real songs.
export const DEMO_SONGS: Song[] = [];
export const DEMO_ALBUMS: Album[] = [];
export const DEMO_ARTISTS: Artist[] = [];
export const DEMO_PLAYLISTS: Playlist[] = [];
