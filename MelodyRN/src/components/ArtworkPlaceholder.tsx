import React, { useMemo } from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Song } from '../types/music';
import { ARTWORK_COLORS } from '../constants/demoSongs';
import { RADIUS } from '../constants/theme';

interface ArtworkPlaceholderProps {
  song: Song | null;
  size?: number;
  style?: StyleProp<ViewStyle>;
  glow?: boolean;
}

export const ArtworkPlaceholder: React.FC<ArtworkPlaceholderProps> = ({
  song,
  size = 48,
  style,
  glow = false,
}) => {
  const colors: [string, string] = useMemo(() => {
    if (song?.colorPalette) return song.colorPalette;
    if (!song) return ['#6366F1', '#8B5CF6'];
    const hash = song.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return ARTWORK_COLORS[hash % ARTWORK_COLORS.length];
  }, [song]);

  const initials = useMemo(() => {
    if (!song) return '♪';
    const words = song.title.trim().split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return song.title.slice(0, 2).toUpperCase();
  }, [song]);

  const isLarge = size >= 180;
  const borderRadius = isLarge ? RADIUS.xxl : size > 80 ? RADIUS.lg : RADIUS.md;

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius,
        },
        glow && {
          shadowColor: colors[0],
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.7,
          shadowRadius: 24,
          elevation: 16,
        },
        style,
      ]}
    >
      <LinearGradient
        colors={isLarge ? ['#1e0836', '#491060', '#d946ef', '#f59e0b'] : colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={[
          StyleSheet.absoluteFill,
          {
            borderRadius,
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          },
        ]}
      >
        {isLarge ? (
          // Synthwave Sunset Mountain Art matching Reference Screen 6!
          <View style={styles.synthwaveScene}>
            {/* Glowing Sun */}
            <View style={styles.sunGlow} />
            {/* Mountain Silhouettes */}
            <View style={styles.mountainBack} />
            <View style={styles.mountainFront} />
            {/* Stars / Ambient grid lights */}
            <View style={styles.horizonLine} />
            {/* Track initials overlay badge */}
            <View style={styles.trackBadge}>
              <Text style={styles.trackBadgeText}>{song?.title || 'MELODY'}</Text>
            </View>
          </View>
        ) : (
          <>
            <Text style={[styles.initials, { fontSize: size * 0.34 }]}>{initials}</Text>
            <View style={styles.neonRing} />
          </>
        )}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: '#0D1220',
  },
  initials: {
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  neonRing: {
    ...StyleSheet.absoluteFill,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: RADIUS.xxl,
  },
  synthwaveScene: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  sunGlow: {
    position: 'absolute',
    top: 35,
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#f59e0b',
    shadowColor: '#d946ef',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 30,
    opacity: 0.85,
  },
  mountainBack: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    width: 0,
    height: 0,
    borderLeftWidth: 90,
    borderRightWidth: 90,
    borderBottomWidth: 110,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#2b0a4d',
    opacity: 0.9,
  },
  mountainFront: {
    position: 'absolute',
    bottom: 0,
    right: 15,
    width: 0,
    height: 0,
    borderLeftWidth: 120,
    borderRightWidth: 120,
    borderBottomWidth: 130,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#120424',
  },
  horizonLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(217, 70, 239, 0.6)',
  },
  trackBadge: {
    position: 'absolute',
    bottom: 14,
    backgroundColor: 'rgba(5, 7, 13, 0.75)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.4)',
  },
  trackBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
});

export default ArtworkPlaceholder;
