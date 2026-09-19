import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { usePlayer } from '../context/PlayerContext';
import { COLORS, SPACING, RADIUS, FONTS } from '../constants/theme';
import { Album } from '../types/music';

const { width } = Dimensions.get('window');
const ALBUM_CARD_WIDTH = (width - SPACING.lg * 2 - SPACING.md) / 2;

export const AlbumsScreen: React.FC = () => {
  const { albums, songs, playSong, setCurrentView } = usePlayer();
  const [filterTab, setFilterTab] = useState<'all' | 'favorites' | 'recent'>('all');

  const handleAlbumPress = (album: Album) => {
    // Find first song from this album or matching artist
    const match = songs.find(s => s.album.toLowerCase() === album.title.toLowerCase() || s.artist.toLowerCase() === album.artist.toLowerCase());
    if (match) {
      playSong(match);
    } else if (songs.length > 0) {
      playSong(songs[0]);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header matching Screen 8 */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => setCurrentView('home')}
          style={styles.backBtn}
        >
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Albums</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Filter Pills */}
      <View style={styles.pillsRow}>
        <TouchableOpacity
          onPress={() => setFilterTab('all')}
          style={[styles.pill, filterTab === 'all' && styles.pillActive]}
        >
          <Text style={[styles.pillText, filterTab === 'all' && styles.pillTextActive]}>
            All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setFilterTab('favorites')}
          style={[styles.pill, filterTab === 'favorites' && styles.pillActive]}
        >
          <Text style={[styles.pillText, filterTab === 'favorites' && styles.pillTextActive]}>
            Favourites
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setFilterTab('recent')}
          style={[styles.pill, filterTab === 'recent' && styles.pillActive]}
        >
          <Text style={[styles.pillText, filterTab === 'recent' && styles.pillTextActive]}>
            Recent
          </Text>
        </TouchableOpacity>
      </View>

      {/* 2-Column Grid */}
      <FlatList
        data={albums}
        numColumns={2}
        keyExtractor={item => item.id}
        columnWrapperStyle={albums.length > 0 ? styles.columnWrapper : undefined}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleAlbumPress(item)}
            style={styles.albumCard}
          >
            <LinearGradient
              colors={item.artworkColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.albumArtwork}
            >
              <Text style={styles.albumInitials}>{item.title.slice(0, 3)}</Text>
              <View style={styles.albumGlow} />
            </LinearGradient>
            <Text numberOfLines={1} style={styles.albumTitle}>
              {item.title}
            </Text>
            <Text numberOfLines={1} style={styles.albumArtist}>
              {item.artist}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>💽</Text>
            <Text style={styles.emptyTitle}>No Albums Loaded</Text>
            <Text style={styles.emptySub}>
              Mock albums removed. Your local 15 audio tracks will automatically populate your album library!
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
  title: {
    color: '#FFFFFF',
    fontSize: FONTS.sizes.xl,
    fontWeight: '800',
  },
  pillsRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
    marginVertical: SPACING.sm,
  },
  pill: {
    paddingVertical: 7,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  pillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  pillText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
  },
  pillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    paddingBottom: 110,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  albumCard: {
    width: ALBUM_CARD_WIDTH,
  },
  albumArtwork: {
    width: ALBUM_CARD_WIDTH,
    height: ALBUM_CARD_WIDTH,
    borderRadius: RADIUS.xl,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  albumInitials: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 1,
  },
  albumGlow: {
    ...StyleSheet.absoluteFill,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: RADIUS.xl,
  },
  albumTitle: {
    color: '#FFFFFF',
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    marginTop: 8,
  },
  albumArtist: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.xs + 1,
    marginTop: 2,
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

export default AlbumsScreen;
