import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import { Song } from '../types/music';
import { usePlayer } from '../context/PlayerContext';
import ArtworkPlaceholder from './ArtworkPlaceholder';
import { COLORS, SPACING, RADIUS, FONTS } from '../constants/theme';

interface SongItemProps {
  song: Song;
  onPress?: () => void;
  showMenu?: boolean;
}

function formatDuration(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export const SongItem: React.FC<SongItemProps> = ({ song, onPress, showMenu = true }) => {
  const {
    currentSong,
    isPlaying,
    toggleFavorite,
    favorites,
    deleteSong,
    renameSong,
    playSong,
  } = usePlayer();

  const [menuVisible, setMenuVisible] = useState(false);
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState(song.title);

  const isActive = currentSong?.id === song.id;
  const isFav = favorites.includes(song.id);

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      playSong(song);
    }
  };

  const handleSaveRename = () => {
    if (newTitle.trim()) {
      renameSong(song.id, newTitle.trim());
      setRenameModalVisible(false);
    }
  };

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={handlePress}
        style={[styles.container, isActive && styles.activeContainer]}
      >
        <ArtworkPlaceholder song={song} size={50} />

        <View style={styles.infoContainer}>
          <View style={styles.titleRow}>
            <Text
              numberOfLines={1}
              style={[styles.title, isActive && styles.activeText]}
            >
              {song.title}
            </Text>
            {isActive && (
              <View style={styles.playingBadge}>
                <Text style={styles.playingBadgeText}>
                  {isPlaying ? '▶ PLAYING' : '❚❚ PAUSED'}
                </Text>
              </View>
            )}
          </View>
          <Text numberOfLines={1} style={styles.artist}>
            {song.artist}
            {song.album ? ` • ${song.album}` : ''}
          </Text>
        </View>

        <View style={styles.rightActions}>
          <Text style={styles.duration}>{formatDuration(song.duration)}</Text>

          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => toggleFavorite(song.id)}
            style={styles.actionBtn}
          >
            <Text style={[styles.favIcon, isFav && styles.favIconActive]}>
              {isFav ? '♥' : '♡'}
            </Text>
          </TouchableOpacity>

          {showMenu && (
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => setMenuVisible(true)}
              style={styles.actionBtn}
            >
              <Text style={styles.moreIcon}>⋮</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>

      {/* Quick Options Bottom Sheet Modal */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
          <View style={styles.modalBackdrop}>
            <TouchableWithoutFeedback>
              <View style={styles.modalCard}>
                <View style={styles.modalHeader}>
                  <ArtworkPlaceholder song={song} size={42} />
                  <View style={styles.modalSongInfo}>
                    <Text numberOfLines={1} style={styles.modalTitle}>
                      {song.title}
                    </Text>
                    <Text numberOfLines={1} style={styles.modalArtist}>
                      {song.artist}
                    </Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => {
                    setMenuVisible(false);
                    playSong(song);
                  }}
                >
                  <Text style={styles.modalOptionIcon}>▶</Text>
                  <Text style={styles.modalOptionText}>Play Track</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => {
                    toggleFavorite(song.id);
                    setMenuVisible(false);
                  }}
                >
                  <Text style={[styles.modalOptionIcon, isFav && { color: COLORS.accent }]}>
                    {isFav ? '♥' : '♡'}
                  </Text>
                  <Text style={styles.modalOptionText}>
                    {isFav ? 'Remove from Favorites' : 'Add to Favorites'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => {
                    setMenuVisible(false);
                    setNewTitle(song.title);
                    setRenameModalVisible(true);
                  }}
                >
                  <Text style={styles.modalOptionIcon}>✎</Text>
                  <Text style={styles.modalOptionText}>Rename Title</Text>
                </TouchableOpacity>

                {!song.isBuiltIn && (
                  <TouchableOpacity
                    style={styles.modalOption}
                    onPress={() => {
                      setMenuVisible(false);
                      deleteSong(song.id);
                    }}
                  >
                    <Text style={[styles.modalOptionIcon, { color: COLORS.error }]}>🗑</Text>
                    <Text style={[styles.modalOptionText, { color: COLORS.error }]}>
                      Delete Track
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={[styles.modalOption, styles.cancelOption]}
                  onPress={() => setMenuVisible(false)}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Rename Modal */}
      <Modal
        visible={renameModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setRenameModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setRenameModalVisible(false)}>
          <View style={styles.modalBackdrop}>
            <TouchableWithoutFeedback>
              <View style={styles.renameCard}>
                <Text style={styles.renameTitle}>Rename Song</Text>
                <TextInput
                  value={newTitle}
                  onChangeText={setNewTitle}
                  style={styles.renameInput}
                  placeholder="Enter song title"
                  placeholderTextColor={COLORS.textMuted}
                  autoFocus
                />
                <View style={styles.renameActions}>
                  <TouchableOpacity
                    style={[styles.renameBtn, styles.cancelBtn]}
                    onPress={() => setRenameModalVisible(false)}
                  >
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.renameBtn, styles.saveBtn]}
                    onPress={handleSaveRename}
                  >
                    <Text style={styles.saveBtnText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: SPACING.md,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
  },
  activeContainer: {
    backgroundColor: 'rgba(139, 92, 246, 0.12)',
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  infoContainer: {
    flex: 1,
    marginLeft: SPACING.md,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  title: {
    color: COLORS.text,
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    flexShrink: 1,
  },
  activeText: {
    color: '#D8B4FE',
    fontWeight: '700',
  },
  playingBadge: {
    backgroundColor: 'rgba(139, 92, 246, 0.25)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
    marginLeft: 8,
  },
  playingBadgeText: {
    color: COLORS.accent,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  artist: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.sm,
    marginTop: 2,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: SPACING.sm,
  },
  duration: {
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.xs + 1,
    marginRight: 6,
  },
  actionBtn: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favIcon: {
    color: COLORS.textMuted,
    fontSize: 18,
  },
  favIconActive: {
    color: COLORS.accent,
    textShadowColor: 'rgba(217, 70, 239, 0.6)',
    textShadowRadius: 6,
  },
  moreIcon: {
    color: COLORS.textSecondary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(5, 7, 13, 0.85)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: COLORS.cardElevated,
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  modalSongInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  modalTitle: {
    color: COLORS.text,
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
  },
  modalArtist: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.sm,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: SPACING.sm,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  modalOptionIcon: {
    color: COLORS.primary,
    fontSize: 18,
    width: 32,
  },
  modalOptionText: {
    color: COLORS.text,
    fontSize: FONTS.sizes.md,
    fontWeight: '500',
  },
  cancelOption: {
    marginTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    justifyContent: 'center',
  },
  cancelText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.md,
    textAlign: 'center',
    width: '100%',
    paddingTop: SPACING.sm,
  },
  renameCard: {
    backgroundColor: COLORS.cardElevated,
    marginHorizontal: SPACING.xl,
    marginBottom: 100,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  renameTitle: {
    color: COLORS.text,
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
  renameInput: {
    backgroundColor: COLORS.background,
    color: COLORS.text,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    fontSize: FONTS.sizes.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
  },
  renameActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: SPACING.md,
  },
  renameBtn: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.md,
  },
  cancelBtn: {
    backgroundColor: 'transparent',
  },
  cancelBtnText: {
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});

export default SongItem;
