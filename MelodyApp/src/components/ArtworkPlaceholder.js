import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ARTWORK_COLORS } from '../constants/demoSongs';
import { COLORS, RADIUS } from '../constants/theme';

// Generate consistent color pair from song id
function getArtworkColors(song) {
  if (!song) return ['#6366F1', '#8B5CF6'];
  const hash = song.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return ARTWORK_COLORS[hash % ARTWORK_COLORS.length];
}

function getInitials(song) {
  if (!song) return '♪';
  const words = song.title.split(' ');
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return song.title.slice(0, 2).toUpperCase();
}

export default function ArtworkPlaceholder({ song, size = 48, style }) {
  const colors = useMemo(() => getArtworkColors(song), [song?.id]);
  const initials = useMemo(() => getInitials(song), [song?.id]);
  const fontSize = size * 0.3;

  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.container,
        { width: size, height: size, borderRadius: RADIUS.md },
        style,
      ]}
    >
      <Text style={[styles.initials, { fontSize }]}>{initials}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  initials: {
    color: COLORS.text,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
