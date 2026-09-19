import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, StatusBar,
  Dimensions, ScrollView, PanResponder, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { usePlayer } from '../context/PlayerContext';
import ArtworkPlaceholder from '../components/ArtworkPlaceholder';
import { COLORS, SPACING, RADIUS, FONTS } from '../constants/theme';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const ARTWORK_SIZE = SCREEN_W * 0.72;

function formatTime(s) {
  if (!s || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export default function NowPlayingScreen({ navigation }) {
  const {
    currentSong, isPlaying, position, duration,
    togglePlay, playNext, playPrev,
    toggleShuffle, isShuffle, cycleRepeat, repeatMode,
    toggleFavorite, favorites, seekTo, queue, currentIndex,
  } = usePlayer();

  const [showQueue, setShowQueue] = useState(false);
  const [seeking, setSeeking] = useState(false);
  const [seekRatio, setSeekRatio] = useState(null);
  const trackRef = useRef(null);
  const trackWidthRef = useRef(SCREEN_W - SPACING.xl * 2);
  const trackPageXRef = useRef(SPACING.xl);

  const isFav = currentSong ? favorites.includes(currentSong.id) : false;
  const currentRatio = seeking && seekRatio !== null ? seekRatio : (duration > 0 ? position / duration : 0);
  const displayedPosition = seeking && seekRatio !== null ? seekRatio * duration : position;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        setSeeking(true);
        measureTrack();
        const touchX = evt.nativeEvent.pageX;
        const ratio = Math.max(0, Math.min(1, (touchX - trackPageXRef.current) / (trackWidthRef.current || 1)));
        setSeekRatio(ratio);
      },
      onPanResponderMove: (evt) => {
        const touchX = evt.nativeEvent.pageX;
        const ratio = Math.max(0, Math.min(1, (touchX - trackPageXRef.current) / (trackWidthRef.current || 1)));
        setSeekRatio(ratio);
      },
      onPanResponderRelease: (evt) => {
        const touchX = evt.nativeEvent.pageX;
        const ratio = Math.max(0, Math.min(1, (touchX - trackPageXRef.current) / (trackWidthRef.current || 1)));
        setSeeking(false);
        setSeekRatio(null);
        if (duration > 0) {
          seekTo(ratio * duration);
        }
      },
      onPanResponderTerminate: () => {
        setSeeking(false);
        setSeekRatio(null);
      },
    })
  ).current;

  function measureTrack() {
    if (trackRef.current?.measure) {
      trackRef.current.measure((x, y, width, height, pageX) => {
        if (width > 0) trackWidthRef.current = width;
        if (pageX !== undefined) trackPageXRef.current = pageX;
      });
    }
  }

  const upNext = queue.slice(currentIndex + 1, currentIndex + 6);

  if (!currentSong) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyIcon}>🎵</Text>
        <Text style={styles.emptyText}>Nothing playing</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <LinearGradient colors={['#0D1220', '#05070D']} style={StyleSheet.absoluteFill} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={styles.chevron}>⌄</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.playingFrom}>NOW PLAYING</Text>
        </View>
        <TouchableOpacity onPress={() => setShowQueue(!showQueue)} style={styles.queueBtn}>
          <Text style={styles.queueIcon}>☰</Text>
        </TouchableOpacity>
      </View>

      {/* Main content */}
      {!showQueue ? (
        <ScrollView
          contentContainerStyle={styles.playerContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Artwork */}
          <View style={styles.artworkContainer}>
            <View style={styles.artworkShadow}>
              <ArtworkPlaceholder song={currentSong} size={ARTWORK_SIZE} style={styles.artwork} />
            </View>
            {isPlaying && (
              <View style={styles.pulseRing} />
            )}
          </View>

          {/* Song info + favourite */}
          <View style={styles.infoRow}>
            <View style={styles.songInfo}>
              <Text style={styles.songTitle} numberOfLines={1}>{currentSong.title}</Text>
              <Text style={styles.songArtist} numberOfLines={1}>{currentSong.artist}</Text>
            </View>
            <TouchableOpacity
              onPress={() => toggleFavorite(currentSong.id)}
              style={styles.favBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={[styles.favIcon, isFav && styles.favIconActive]}>
                {isFav ? '♥' : '♡'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Progress slider */}
          <View style={styles.progressSection}>
            <View
              style={styles.sliderTrack}
              ref={trackRef}
              onLayout={measureTrack}
              {...panResponder.panHandlers}
            >
              <View style={styles.sliderBg}>
                <View style={[styles.sliderFill, { width: `${Math.min(100, Math.max(0, currentRatio * 100))}%` }]} />
                <View style={[styles.sliderThumb, { left: `${Math.min(100, Math.max(0, currentRatio * 100))}%` }]} />
              </View>
            </View>
            <View style={styles.timeRow}>
              <Text style={styles.timeText}>{formatTime(displayedPosition)}</Text>
              <Text style={styles.timeText}>{formatTime(duration)}</Text>
            </View>
          </View>

          {/* Controls */}
          <View style={styles.controls}>
            <TouchableOpacity onPress={toggleShuffle} style={styles.sideBtn}>
              <Text style={[styles.sideBtnIcon, isShuffle && styles.sideBtnActive]}>⇄</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={playPrev} style={styles.skipBtn}>
              <Text style={styles.skipIcon}>⏮</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={togglePlay} style={styles.playBtn}>
              <LinearGradient colors={['#6366F1', '#8B5CF6', '#D946EF']} style={styles.playGrad}>
                <Text style={styles.playIcon}>{isPlaying ? '⏸' : '▶'}</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={playNext} style={styles.skipBtn}>
              <Text style={styles.skipIcon}>⏭</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={cycleRepeat} style={styles.sideBtn}>
              <Text style={[
                styles.sideBtnIcon,
                repeatMode !== 'none' && styles.sideBtnActive,
              ]}>
                {repeatMode === 'one' ? '🔂' : '🔁'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        /* Queue view */
        <View style={styles.queueView}>
          <Text style={styles.queueTitle}>Up Next</Text>
          <View style={styles.nowPlayingInQueue}>
            <ArtworkPlaceholder song={currentSong} size={44} />
            <View style={styles.queueSongInfo}>
              <Text style={styles.queueSongTitle}>{currentSong.title}</Text>
              <Text style={styles.queueSongArtist}>{currentSong.artist}</Text>
            </View>
            <Text style={styles.nowPlayingLabel}>▶ Playing</Text>
          </View>
          <ScrollView style={styles.queueList} showsVerticalScrollIndicator={false}>
            {upNext.map((song, i) => (
              <View key={song.id} style={styles.queueItem}>
                <Text style={styles.queueIdx}>{currentIndex + 2 + i}</Text>
                <ArtworkPlaceholder song={song} size={40} />
                <View style={styles.queueSongInfo}>
                  <Text style={styles.queueSongTitle} numberOfLines={1}>{song.title}</Text>
                  <Text style={styles.queueSongArtist} numberOfLines={1}>{song.artist}</Text>
                </View>
                <Text style={styles.queueDrag}>⋮⋮</Text>
              </View>
            ))}
            {upNext.length === 0 && (
              <Text style={styles.emptyQueue}>Queue is empty</Text>
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.background },
  emptyIcon: { fontSize: 64, marginBottom: SPACING.lg },
  emptyText: { color: COLORS.text, fontSize: FONTS.sizes.xl, fontWeight: '700' },
  backBtn: { marginTop: SPACING.lg, padding: SPACING.md },
  backText: { color: COLORS.primary, fontSize: FONTS.sizes.md },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: StatusBar.currentHeight || 50,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  chevron: { color: COLORS.text, fontSize: 28, transform: [{ rotate: '180deg' }] },
  headerCenter: { flex: 1, alignItems: 'center' },
  playingFrom: { color: COLORS.textSecondary, fontSize: FONTS.sizes.xs, fontWeight: '700', letterSpacing: 2 },
  queueBtn: { padding: SPACING.xs },
  queueIcon: { color: COLORS.textSecondary, fontSize: 20 },
  playerContent: { paddingHorizontal: SPACING.xl, paddingBottom: 40, alignItems: 'center' },
  artworkContainer: { position: 'relative', marginVertical: SPACING.xxl, alignItems: 'center', justifyContent: 'center' },
  artworkShadow: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 20,
  },
  artwork: { borderRadius: RADIUS.xl },
  pulseRing: {
    position: 'absolute',
    width: ARTWORK_SIZE + 20,
    height: ARTWORK_SIZE + 20,
    borderRadius: RADIUS.xl + 10,
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.3)',
  },
  infoRow: {
    flexDirection: 'row', alignItems: 'center', width: '100%',
    marginBottom: SPACING.xl,
  },
  songInfo: { flex: 1 },
  songTitle: { color: COLORS.text, fontSize: FONTS.sizes.xxl, fontWeight: '800' },
  songArtist: { color: COLORS.textSecondary, fontSize: FONTS.sizes.lg, marginTop: SPACING.xs },
  favBtn: { padding: SPACING.sm },
  favIcon: { fontSize: 28, color: COLORS.textMuted },
  favIconActive: { color: COLORS.accent },
  progressSection: { width: '100%', marginBottom: SPACING.xxl },
  sliderTrack: { width: '100%', paddingVertical: 14 },
  sliderBg: {
    height: 4, backgroundColor: COLORS.border,
    borderRadius: RADIUS.full, position: 'relative',
  },
  sliderFill: {
    position: 'absolute', left: 0, top: 0, bottom: 0,
    backgroundColor: COLORS.primary, borderRadius: RADIUS.full,
  },
  sliderThumb: {
    position: 'absolute', top: -6,
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: COLORS.text,
    marginLeft: -8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: SPACING.xs },
  timeText: { color: COLORS.textMuted, fontSize: FONTS.sizes.xs },
  controls: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    width: '100%', paddingHorizontal: SPACING.sm,
  },
  sideBtn: { padding: SPACING.md },
  sideBtnIcon: { fontSize: 22, color: COLORS.textSecondary },
  sideBtnActive: { color: COLORS.primary },
  skipBtn: { padding: SPACING.md },
  skipIcon: { fontSize: 32, color: COLORS.text },
  playBtn: {},
  playGrad: {
    width: 72, height: 72, borderRadius: 36,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 12,
  },
  playIcon: { fontSize: 28, color: COLORS.text },
  queueView: { flex: 1, paddingHorizontal: SPACING.lg },
  queueTitle: { color: COLORS.text, fontSize: FONTS.sizes.xl, fontWeight: '700', marginBottom: SPACING.lg },
  nowPlayingInQueue: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    backgroundColor: 'rgba(139,92,246,0.15)',
    padding: SPACING.md, borderRadius: RADIUS.md, marginBottom: SPACING.lg,
    borderWidth: 1, borderColor: 'rgba(139,92,246,0.3)',
  },
  nowPlayingLabel: { color: COLORS.primary, fontSize: FONTS.sizes.xs, fontWeight: '600' },
  queueList: { flex: 1 },
  queueItem: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  queueIdx: { color: COLORS.textMuted, fontSize: FONTS.sizes.xs, width: 20, textAlign: 'center' },
  queueSongInfo: { flex: 1 },
  queueSongTitle: { color: COLORS.text, fontSize: FONTS.sizes.md, fontWeight: '600' },
  queueSongArtist: { color: COLORS.textSecondary, fontSize: FONTS.sizes.sm },
  queueDrag: { color: COLORS.textMuted, fontSize: 18 },
  emptyQueue: { color: COLORS.textMuted, textAlign: 'center', marginTop: SPACING.xl },
});
