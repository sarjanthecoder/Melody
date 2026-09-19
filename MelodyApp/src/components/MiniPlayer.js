import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { usePlayer } from '../context/PlayerContext';
import ArtworkPlaceholder from './ArtworkPlaceholder';
import { COLORS, SPACING, RADIUS, FONTS } from '../constants/theme';

export default function MiniPlayer() {
  const navigation = useNavigation();
  const { currentSong, isPlaying, togglePlay, playNext } = usePlayer();

  if (!currentSong) return null;

  return (
    <TouchableOpacity
      activeOpacity={0.95}
      onPress={() => navigation.navigate('NowPlaying')}
      style={styles.container}
    >
      <View style={styles.inner}>
        <ArtworkPlaceholder song={currentSong} size={42} style={styles.artwork} />
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>{currentSong.title}</Text>
          <Text style={styles.artist} numberOfLines={1}>{currentSong.artist}</Text>
        </View>
        <View style={styles.controls}>
          <TouchableOpacity
            onPress={togglePlay}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={styles.btn}
          >
            <Text style={styles.btnIcon}>{isPlaying ? '⏸' : '▶'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={playNext}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={styles.btn}
          >
            <Text style={styles.btnIcon}>⏭</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: '35%' }]} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#111827',
    borderTopWidth: 1,
    borderTopColor: 'rgba(139,92,246,0.2)',
    borderRadius: RADIUS.lg,
    marginHorizontal: SPACING.sm,
    marginBottom: SPACING.xs,
    overflow: 'hidden',
    elevation: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  artwork: { borderRadius: RADIUS.sm, marginRight: SPACING.md },
  info: { flex: 1, marginRight: SPACING.sm },
  title: {
    color: COLORS.text,
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
  },
  artist: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.sm,
    marginTop: 2,
  },
  controls: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  btn: { padding: SPACING.xs },
  btnIcon: { fontSize: 22, color: COLORS.text },
  progressBar: {
    height: 2,
    backgroundColor: COLORS.border,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
});
