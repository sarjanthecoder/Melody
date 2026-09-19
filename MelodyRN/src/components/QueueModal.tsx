import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
} from 'react-native';
import { usePlayer } from '../context/PlayerContext';
import ArtworkPlaceholder from './ArtworkPlaceholder';
import { COLORS, SPACING, RADIUS, FONTS } from '../constants/theme';
import { Song } from '../types/music';

export const QueueModal: React.FC = () => {
  const { isQueueOpen, setQueueOpen, currentSong, queue, playSong } = usePlayer();

  const upNextSongs = queue.filter(s => s.id !== currentSong?.id);

  return (
    <Modal
      visible={isQueueOpen}
      transparent
      animationType="slide"
      onRequestClose={() => setQueueOpen(false)}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setQueueOpen(false)} style={styles.backBtn}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Play Queue</Text>
          <TouchableOpacity onPress={() => setQueueOpen(false)}>
            <Text style={styles.saveLink}>Save</Text>
          </TouchableOpacity>
        </View>

        {/* Now Playing Section */}
        {currentSong && (
          <View style={styles.nowPlayingSection}>
            <Text style={styles.sectionHeader}>Now Playing</Text>
            <View style={styles.nowPlayingCard}>
              <ArtworkPlaceholder song={currentSong} size={52} />
              <View style={styles.trackInfo}>
                <Text numberOfLines={1} style={styles.songTitle}>
                  {currentSong.title}
                </Text>
                <Text numberOfLines={1} style={styles.artistName}>
                  {currentSong.artist}
                </Text>
              </View>
              <Text style={styles.playingDot}>▶</Text>
            </View>
          </View>
        )}

        {/* Up Next Section */}
        <View style={styles.upNextSection}>
          <Text style={styles.sectionHeader}>Up Next ({upNextSongs.length})</Text>
          <FlatList
            data={upNextSongs}
            keyExtractor={item => `queue_${item.id}`}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  playSong(item);
                }}
                style={styles.queueItem}
              >
                <ArtworkPlaceholder song={item} size={46} />
                <View style={styles.trackInfo}>
                  <Text numberOfLines={1} style={styles.queueTitle}>
                    {item.title}
                  </Text>
                  <Text numberOfLines={1} style={styles.queueArtist}>
                    {item.artist}
                  </Text>
                </View>
                <Text style={styles.dragHandle}>☰</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.cardElevated,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  backText: {
    color: COLORS.text,
    fontSize: 20,
  },
  title: {
    color: '#FFFFFF',
    fontSize: FONTS.sizes.xl,
    fontWeight: '800',
  },
  saveLink: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
  },
  sectionHeader: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: SPACING.sm,
  },
  nowPlayingSection: {
    marginBottom: SPACING.lg,
  },
  nowPlayingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  trackInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  songTitle: {
    color: '#FFFFFF',
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
  },
  artistName: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.sm,
    marginTop: 2,
  },
  playingDot: {
    color: COLORS.accent,
    fontSize: 16,
    marginRight: 6,
  },
  upNextSection: {
    flex: 1,
  },
  queueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingVertical: 10,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.sm,
  },
  queueTitle: {
    color: COLORS.text,
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
  },
  queueArtist: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.xs + 1,
    marginTop: 2,
  },
  dragHandle: {
    color: COLORS.textMuted,
    fontSize: 20,
    paddingHorizontal: 8,
  },
});

export default QueueModal;
