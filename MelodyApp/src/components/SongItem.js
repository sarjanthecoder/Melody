import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Alert, ActionSheetIOS, Platform,
} from 'react-native';
import { usePlayer } from '../context/PlayerContext';
import ArtworkPlaceholder from './ArtworkPlaceholder';
import { COLORS, SPACING, RADIUS, FONTS } from '../constants/theme';

function formatDuration(seconds) {
  if (!seconds) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function SongItem({ song, onPress, queue, index, showMenu = true }) {
  const { currentSong, isPlaying, toggleFavorite, favorites, deleteSong, renameSong } = usePlayer();
  const isActive = currentSong?.id === song.id;
  const isFavorite = favorites.includes(song.id);

  function handleMorePress() {
    const options = ['Cancel', 'Add to Favourites', 'Rename', ...(song.isBuiltIn ? [] : ['Delete'])];
    const cancelIndex = 0;

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        { options, cancelButtonIndex: cancelIndex, destructiveButtonIndex: song.isBuiltIn ? undefined : options.length - 1 },
        (buttonIndex) => handleOption(buttonIndex, options)
      );
    } else {
      Alert.alert(song.title, '', [
        { text: 'Add to Favourites', onPress: () => toggleFavorite(song.id) },
        {
          text: 'Rename', onPress: () => {
            Alert.prompt?.('Rename Song', 'Enter new title:', (text) => {
              if (text?.trim()) renameSong(song.id, text.trim());
            }, 'plain-text', song.title);
          }
        },
        ...(!song.isBuiltIn ? [{ text: 'Delete', style: 'destructive', onPress: () => confirmDelete() }] : []),
        { text: 'Cancel', style: 'cancel' },
      ]);
    }
  }

  function handleOption(idx, options) {
    if (options[idx] === 'Add to Favourites') toggleFavorite(song.id);
    else if (options[idx] === 'Rename') {
      Alert.prompt?.('Rename Song', '', (text) => {
        if (text?.trim()) renameSong(song.id, text.trim());
      }, 'plain-text', song.title);
    } else if (options[idx] === 'Delete') confirmDelete();
  }

  function confirmDelete() {
    Alert.alert('Delete Song', `Delete "${song.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteSong(song.id) },
    ]);
  }

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.container, isActive && styles.containerActive]}
    >
      <View style={styles.artworkWrap}>
        <ArtworkPlaceholder song={song} size={48} />
        {isActive && isPlaying && (
          <View style={styles.playingBadge}>
            <Text style={styles.playingIcon}>▶</Text>
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text style={[styles.title, isActive && styles.titleActive]} numberOfLines={1}>
          {song.title}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          {song.artist}
        </Text>
      </View>
      <View style={styles.right}>
        {isFavorite && <Text style={styles.heart}>♥</Text>}
        <Text style={styles.duration}>{formatDuration(song.duration)}</Text>
        {showMenu && (
          <TouchableOpacity onPress={handleMorePress} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} style={styles.moreBtn}>
            <Text style={styles.more}>⋯</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    marginHorizontal: SPACING.lg,
    marginVertical: 2,
  },
  containerActive: {
    backgroundColor: 'rgba(139,92,246,0.1)',
  },
  artworkWrap: { position: 'relative', marginRight: SPACING.md },
  playingBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playingIcon: { fontSize: 6, color: '#fff' },
  info: { flex: 1, marginRight: SPACING.sm },
  title: {
    color: COLORS.text,
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
  },
  titleActive: { color: COLORS.primary },
  artist: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.sm,
    marginTop: 2,
  },
  right: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  heart: { color: COLORS.accent, fontSize: 12 },
  duration: { color: COLORS.textMuted, fontSize: FONTS.sizes.xs },
  moreBtn: { padding: 4 },
  more: { color: COLORS.textSecondary, fontSize: 18, fontWeight: '700' },
});
