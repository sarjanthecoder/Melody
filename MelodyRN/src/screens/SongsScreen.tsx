import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { usePlayer } from '../context/PlayerContext';
import SongItem from '../components/SongItem';
import { COLORS, SPACING, RADIUS, FONTS } from '../constants/theme';
import { Song } from '../types/music';

export const SongsScreen: React.FC = () => {
  const { songs, favorites, recentlyPlayed, setCurrentView } = usePlayer();
  const [filterTab, setFilterTab] = useState<'all' | 'favorites' | 'recent'>('all');

  const recentSongs = useMemo(() => {
    return recentlyPlayed
      .map(id => songs.find(s => s.id === id))
      .filter((s): s is Song => Boolean(s));
  }, [recentlyPlayed, songs]);

  const displayedSongs = useMemo(() => {
    if (filterTab === 'favorites') return songs.filter(s => favorites.includes(s.id));
    if (filterTab === 'recent') return recentSongs;
    return songs;
  }, [filterTab, songs, favorites, recentSongs]);

  return (
    <View style={styles.container}>
      {/* Header matching Screen 10 */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => setCurrentView('home')}
          style={styles.backBtn}
        >
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Songs</Text>
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

      {/* Songs FlatList */}
      <FlatList
        data={displayedSongs}
        keyExtractor={item => `song_view_${item.id}`}
        renderItem={({ item }) => <SongItem song={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🎵</Text>
            <Text style={styles.emptyTitle}>No songs yet</Text>
            <Text style={styles.emptySub}>
              {filterTab === 'favorites'
                ? 'No favorites saved yet.'
                : filterTab === 'recent'
                ? 'No recently played tracks.'
                : 'All mock songs removed. Ready to receive your 15 real songs!'}
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
    paddingTop: SPACING.sm,
    paddingBottom: 110,
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

export default SongsScreen;
