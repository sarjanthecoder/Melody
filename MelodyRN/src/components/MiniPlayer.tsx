import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { usePlayer } from '../context/PlayerContext';
import ArtworkPlaceholder from './ArtworkPlaceholder';
import { COLORS, SPACING, RADIUS, FONTS } from '../constants/theme';

export const MiniPlayer: React.FC = () => {
  const {
    currentSong,
    isPlaying,
    togglePlayPause,
    nextSong,
    position,
    duration,
    openNowPlaying,
    favorites,
    toggleFavorite,
  } = usePlayer();

  if (!currentSong) return null;

  const isFav = favorites.includes(currentSong.id);
  const progressPercent = duration > 0 ? Math.min(100, (position / duration) * 100) : 0;

  return (
    <View style={styles.outerContainer}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={openNowPlaying}
        style={styles.innerContainer}
      >
        <ArtworkPlaceholder song={currentSong} size={44} />

        <View style={styles.textContainer}>
          <Text numberOfLines={1} style={styles.title}>
            {currentSong.title}
          </Text>
          <Text numberOfLines={1} style={styles.artist}>
            {currentSong.artist}
          </Text>
        </View>

        <View style={styles.controlsContainer}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => toggleFavorite(currentSong.id)}
            style={styles.btn}
          >
            <Text style={[styles.favIcon, isFav && styles.favIconActive]}>
              {isFav ? '♥' : '♡'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={togglePlayPause}
            style={styles.playPauseBtn}
          >
            <Text style={styles.playPauseText}>
              {isPlaying ? '❚❚' : '▶'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={nextSong}
            style={styles.btn}
          >
            <Text style={styles.controlIcon}>⏭</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {/* Thin Neon Progress Bar at the top or bottom */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressBar, { width: `${progressPercent}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.xs,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.cardElevated,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    overflow: 'hidden',
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
  },
  textContainer: {
    flex: 1,
    marginLeft: SPACING.md,
    marginRight: SPACING.sm,
  },
  title: {
    color: COLORS.text,
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
  },
  artist: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.xs + 1,
    marginTop: 2,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  btn: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playPauseBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 4,
  },
  playPauseText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  controlIcon: {
    color: COLORS.text,
    fontSize: 16,
  },
  favIcon: {
    color: COLORS.textMuted,
    fontSize: 18,
  },
  favIconActive: {
    color: COLORS.accent,
  },
  progressTrack: {
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    width: '100%',
  },
  progressBar: {
    height: 2,
    backgroundColor: COLORS.accent,
  },
});

export default MiniPlayer;
