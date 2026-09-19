import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { usePlayer } from '../context/PlayerContext';
import { COLORS, SPACING, RADIUS, FONTS } from '../constants/theme';
import { Playlist } from '../types/music';
import SongItem from '../components/SongItem';

export const PlaylistsScreen: React.FC = () => {
  const { playlists, songs, playSong, toggleShuffle, setCurrentView } = usePlayer();
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);

  // If viewing a playlist detail matching Screen 7
  if (selectedPlaylist) {
    const playlistSongs = songs.filter(s => selectedPlaylist.songIds.includes(s.id));

    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => setSelectedPlaylist(null)}
            style={styles.backBtn}
          >
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Playlist</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Big Banner Card matching Screen 7 */}
        <View style={styles.bannerCard}>
          <LinearGradient
            colors={selectedPlaylist.artworkColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.bannerArtwork}
          >
            <Text style={styles.bannerInitial}>♫</Text>
          </LinearGradient>

          <View style={styles.bannerMeta}>
            <Text style={styles.bannerTitle}>{selectedPlaylist.title}</Text>
            <Text style={styles.bannerSub}>
              {selectedPlaylist.songCount} songs • {selectedPlaylist.durationString}
            </Text>
          </View>
        </View>

        {/* Shuffle Play Wide Gradient Button matching Screen 7 */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            toggleShuffle();
            if (playlistSongs.length > 0) playSong(playlistSongs[0]);
          }}
          style={styles.shuffleBtnContainer}
        >
          <LinearGradient
            colors={['#6366F1', '#8B5CF6', '#D946EF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.shuffleBtn}
          >
            <Text style={styles.shuffleIcon}>🔀</Text>
            <Text style={styles.shuffleText}>Shuffle Play</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Songs List */}
        <FlatList
          data={playlistSongs.length > 0 ? playlistSongs : songs.slice(0, 6)}
          keyExtractor={item => `pl_song_${item.id}`}
          renderItem={({ item }) => <SongItem song={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  }

  // Playlists List matching Screen 19
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => setCurrentView('home')}
          style={styles.backBtn}
        >
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Playlists</Text>
        <TouchableOpacity style={styles.addBtn}>
          <Text style={styles.addText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={playlists}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setSelectedPlaylist(item)}
            style={styles.playlistItem}
          >
            <LinearGradient
              colors={item.artworkColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.playlistThumbnail}
            >
              <Text style={styles.playlistThumbIcon}>♪</Text>
            </LinearGradient>

            <View style={styles.playlistItemInfo}>
              <Text style={styles.playlistItemTitle}>{item.title}</Text>
              <Text style={styles.playlistItemSub}>
                {item.songCount} songs • {item.durationString}
              </Text>
            </View>

            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>No Playlists Yet</Text>
            <Text style={styles.emptySub}>
              Mock playlists removed. Once your 15 local songs are loaded, your customized playlists will appear here!
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
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
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.cardElevated,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  addText: {
    color: COLORS.primary,
    fontSize: 24,
    fontWeight: '700',
  },
  title: {
    color: '#FFFFFF',
    fontSize: FONTS.sizes.xl,
    fontWeight: '800',
  },
  bannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardElevated,
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.md,
    padding: SPACING.md,
    borderRadius: RADIUS.xxl,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  bannerArtwork: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerInitial: {
    fontSize: 32,
    color: '#FFFFFF',
  },
  bannerMeta: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: FONTS.sizes.lg,
    fontWeight: '800',
  },
  bannerSub: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.xs + 1,
    marginTop: 4,
  },
  shuffleBtnContainer: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  shuffleBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: RADIUS.full,
    gap: 8,
  },
  shuffleIcon: {
    fontSize: 16,
  },
  shuffleText: {
    color: '#FFFFFF',
    fontSize: FONTS.sizes.md,
    fontWeight: '800',
  },
  listContent: {
    paddingBottom: 110,
    gap: SPACING.sm,
  },
  playlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    marginHorizontal: SPACING.lg,
    padding: SPACING.md,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  playlistThumbnail: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playlistThumbIcon: {
    color: '#FFFFFF',
    fontSize: 24,
  },
  playlistItemInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  playlistItemTitle: {
    color: '#FFFFFF',
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
  },
  playlistItemSub: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.xs,
    marginTop: 2,
  },
  chevron: {
    color: COLORS.textMuted,
    fontSize: 24,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: SPACING.xl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: FONTS.sizes.lg,
    fontWeight: '800',
  },
  emptySub: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.sm,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
  },
});

export default PlaylistsScreen;
