import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  GestureResponderEvent,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { usePlayer } from '../context/PlayerContext';
import ArtworkPlaceholder from '../components/ArtworkPlaceholder';
import QueueModal from '../components/QueueModal';
import EqualizerModal from '../components/EqualizerModal';
import SleepTimerModal from '../components/SleepTimerModal';
import LyricsModal from '../components/LyricsModal';
import { COLORS, SPACING, RADIUS, FONTS } from '../constants/theme';

const { width } = Dimensions.get('window');
const ARTWORK_SIZE = Math.min(width - 56, 310);

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export const NowPlayingScreen: React.FC = () => {
  const {
    currentSong,
    isPlaying,
    togglePlayPause,
    nextSong,
    previousSong,
    position,
    duration,
    seekTo,
    isShuffle,
    toggleShuffle,
    repeatMode,
    toggleRepeat,
    favorites,
    toggleFavorite,
    closeNowPlaying,
    setQueueOpen,
    setEqualizerOpen,
    setSleepTimerOpen,
    setLyricsOpen,
  } = usePlayer();

  if (!currentSong) return null;

  const isFav = favorites.includes(currentSong.id);
  const progressRatio = duration > 0 ? Math.min(1, Math.max(0, position / duration)) : 0;

  const handleProgressBarPress = (e: GestureResponderEvent) => {
    const { locationX } = e.nativeEvent;
    const barWidth = width - SPACING.xl * 2;
    const ratio = Math.max(0, Math.min(1, locationX / barWidth));
    seekTo(Math.floor(ratio * duration));
  };

  return (
    <View style={styles.container}>
      {/* Background Neon Ambient Glow */}
      <View style={styles.ambientGlow} />

      {/* Top Header matching Screen 6 */}
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={closeNowPlaying}
          style={styles.headerBtn}
        >
          <Text style={styles.headerBtnIcon}>←</Text>
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerCategory}>PLAYING FROM</Text>
          <Text numberOfLines={1} style={styles.headerAlbum}>
            All Songs
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setLyricsOpen(true)}
          style={styles.headerBtn}
        >
          <Text style={styles.headerBtnIcon}>⋮</Text>
        </TouchableOpacity>
      </View>

      {/* Album Artwork Card (Synthwave Mountain Scene) */}
      <View style={styles.artworkContainer}>
        <ArtworkPlaceholder
          song={currentSong}
          size={ARTWORK_SIZE}
          glow
        />
      </View>

      {/* Track Metadata with Heart on Right matching Screen 6 */}
      <View style={styles.metaRow}>
        <View style={styles.metaLeft}>
          <Text numberOfLines={1} style={styles.songTitle}>
            {currentSong.title}
          </Text>
          <Text numberOfLines={1} style={styles.artistName}>
            {currentSong.artist}
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => toggleFavorite(currentSong.id)}
          style={styles.heartBtn}
        >
          <Text style={[styles.favIcon, isFav && styles.favIconActive]}>
            {isFav ? '♥' : '♡'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Interactive Progress Slider matching Screen 6 */}
      <View style={styles.progressSection}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={handleProgressBarPress}
          style={styles.progressTouchArea}
        >
          <View style={styles.progressTrack}>
            <LinearGradient
              colors={['#6366F1', '#8B5CF6', '#D946EF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressBar, { width: `${progressRatio * 100}%` }]}
            />
          </View>
        </TouchableOpacity>

        <View style={styles.timeRow}>
          <Text style={styles.timeText}>{formatTime(position)}</Text>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
      </View>

      {/* Main Playback Controls matching Screen 6 */}
      <View style={styles.controlsRow}>
        {/* Shuffle */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={toggleShuffle}
          style={styles.controlIconBtn}
        >
          <Text style={[styles.controlEmoji, isShuffle && styles.activeControl]}>
            🔀
          </Text>
        </TouchableOpacity>

        {/* Previous */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={previousSong}
          style={styles.controlIconBtn}
        >
          <Text style={styles.navIcon}>⏮</Text>
        </TouchableOpacity>

        {/* Giant Glowing Play/Pause Circle */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={togglePlayPause}
          style={styles.playPauseContainer}
        >
          <LinearGradient
            colors={['#6366F1', '#8B5CF6', '#D946EF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.playPauseGradient}
          >
            <Text style={styles.playPauseIcon}>
              {isPlaying ? '❚❚' : '▶'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Next */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={nextSong}
          style={styles.controlIconBtn}
        >
          <Text style={styles.navIcon}>⏭</Text>
        </TouchableOpacity>

        {/* Repeat */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={toggleRepeat}
          style={styles.controlIconBtn}
        >
          <Text
            style={[
              styles.controlEmoji,
              repeatMode !== 'none' && styles.activeControl,
            ]}
          >
            🔁
          </Text>
        </TouchableOpacity>
      </View>

      {/* 3 Quick Action Icons matching bottom of Screen 6 (Queue, Sleep Timer, Equalizer) */}
      <View style={styles.bottomActionsRow}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setQueueOpen(true)}
          style={styles.bottomActionBtn}
        >
          <Text style={styles.bottomActionIcon}>☰</Text>
          <Text style={styles.bottomActionLabel}>Queue</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setSleepTimerOpen(true)}
          style={styles.bottomActionBtn}
        >
          <Text style={styles.bottomActionIcon}>🌙</Text>
          <Text style={styles.bottomActionLabel}>Timer</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setEqualizerOpen(true)}
          style={styles.bottomActionBtn}
        >
          <Text style={styles.bottomActionIcon}>🎚️</Text>
          <Text style={styles.bottomActionLabel}>Equalizer</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setLyricsOpen(true)}
          style={styles.bottomActionBtn}
        >
          <Text style={styles.bottomActionIcon}>📄</Text>
          <Text style={styles.bottomActionLabel}>Lyrics</Text>
        </TouchableOpacity>
      </View>

      {/* Modals */}
      <QueueModal />
      <EqualizerModal />
      <SleepTimerModal />
      <LyricsModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'space-between',
    paddingBottom: SPACING.md,
  },
  ambientGlow: {
    position: 'absolute',
    top: 40,
    alignSelf: 'center',
    width: width * 0.85,
    height: width * 0.85,
    borderRadius: (width * 0.85) / 2,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.cardElevated,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  headerBtnIcon: {
    color: COLORS.textSecondary,
    fontSize: 18,
  },
  headerTitleContainer: {
    alignItems: 'center',
    flex: 1,
  },
  headerCategory: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  headerAlbum: {
    color: '#FFFFFF',
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
    marginTop: 2,
  },
  artworkContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SPACING.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
  },
  metaLeft: {
    flex: 1,
  },
  songTitle: {
    color: '#FFFFFF',
    fontSize: FONTS.sizes.xxl,
    fontWeight: '800',
  },
  artistName: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.md,
    fontWeight: '500',
    marginTop: 4,
  },
  heartBtn: {
    padding: 6,
  },
  favIcon: {
    color: COLORS.textMuted,
    fontSize: 26,
  },
  favIconActive: {
    color: COLORS.accent,
  },
  progressSection: {
    paddingHorizontal: SPACING.xl,
  },
  progressTouchArea: {
    paddingVertical: 10,
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    overflow: 'hidden',
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  timeText: {
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.xs,
    fontWeight: '600',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  controlIconBtn: {
    padding: 10,
  },
  navIcon: {
    color: '#FFFFFF',
    fontSize: 26,
  },
  playPauseContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 10,
  },
  playPauseGradient: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playPauseIcon: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    marginLeft: 2,
  },
  controlEmoji: {
    fontSize: 22,
    opacity: 0.45,
  },
  activeControl: {
    opacity: 1,
  },
  bottomActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  bottomActionBtn: {
    alignItems: 'center',
    padding: 6,
  },
  bottomActionIcon: {
    color: COLORS.textSecondary,
    fontSize: 20,
  },
  bottomActionLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
});

export default NowPlayingScreen;
