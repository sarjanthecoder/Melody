import { Song } from '../types/music';

/**
 * Format raw audio file names into clean song metadata
 */
export function createSongFromFile(
  fileName: string,
  filePath: string,
  index: number
): Song {
  // Strip extension
  const cleanName = fileName.replace(/\.(mp3|m4a|wav|flac|aac|ogg)$/i, '');

  // Try split by ' - ' (e.g., 'Artist - SongTitle' or 'SongTitle - Artist')
  let title = cleanName;
  let artist = 'Local Artist';

  if (cleanName.includes(' - ')) {
    const parts = cleanName.split(' - ');
    if (parts.length >= 2) {
      artist = parts[0].trim();
      title = parts.slice(1).join(' - ').trim();
    }
  }

  const palettes: [string, string][] = [
    ['#6366F1', '#8B5CF6'],
    ['#8B5CF6', '#D946EF'],
    ['#0EA5E9', '#6366F1'],
    ['#10B981', '#0EA5E9'],
    ['#F59E0B', '#EF4444'],
    ['#D946EF', '#F59E0B'],
    ['#0EA5E9', '#D946EF'],
  ];

  return {
    id: `local_${Date.now()}_${index}`,
    title,
    artist,
    album: 'Local Storage',
    duration: 220, // Real duration populated upon playback load
    uri: filePath.startsWith('file://') ? filePath : `file://${filePath.replace(/\\/g, '/')}`,
    isBuiltIn: false,
    colorPalette: palettes[index % palettes.length],
  };
}
