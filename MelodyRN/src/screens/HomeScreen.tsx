import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { usePlayer } from '../context/PlayerContext';
import SongItem from '../components/SongItem';
import ArtworkPlaceholder from '../components/ArtworkPlaceholder';
import { COLORS, SPACING, RADIUS, FONTS } from '../constants/theme';

export const HomeScreen: React.FC = () => {
  const {
    songs,
    albums,
    artists,
    playlists,
    recentlyPlayed,
    playSong,
    setDrawerOpen,
    setCurrentView,
  } = usePlayer();

  const recentSongs = recentlyPlayed
    .map(id => songs.find(s => s.id === id))
    .filter((s): s is typeof songs[0] => Boolean(s));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top Greeting Header matching Screen 5 */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => setDrawerOpen(true)}
          style={styles.menuTrigger}
        >
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>

        <View style={styles.greetingContainer}>
          <Text style={styles.greetingTitle}>Good Morning</Text>
          <Text style={styles.greetingSubtitle}>Let's Play Some Music ♫</Text>
        </View>

        <TouchableOpacity
          onPress={() => Alert.alert('Offline Mode Active', 'Player is ready for your local audio tracks.')}
          style={styles.bellTrigger}
        >
          <Text style={styles.bellIcon}>🔔</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar matching Screen 5 */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setCurrentView('search')}
        style={styles.searchBar}
      >
        <Text style={styles.searchIcon}>🔍</Text>
        <Text style={styles.searchPlaceholder}>Search songs, albums, artists...</Text>
      </TouchableOpacity>

      {/* 4 Circular Category Buttons matching Screen 5 */}
      <View style={styles.categoriesRow}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setCurrentView('songs')}
          style={styles.catItem}
        >
          <View style={styles.catCircle}>
            <Text style={styles.catIcon}>♫</Text>
          </View>
          <Text style={styles.catLabel}>Songs</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setCurrentView('albums')}
          style={styles.catItem}
        >
          <View style={styles.catCircle}>
            <Text style={styles.catIcon}>💽</Text>
          </View>
          <Text style={styles.catLabel}>Albums</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setCurrentView('artists')}
          style={styles.catItem}
        >
          <View style={styles.catCircle}>
            <Text style={styles.catIcon}>👤</Text>
          </View>
          <Text style={styles.catLabel}>Artists</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setCurrentView('playlists')}
          style={styles.catItem}
        >
          <View style={styles.catCircle}>
            <Text style={styles.catIcon}>📋</Text>
          </View>
          <Text style={styles.catLabel}>Playlists</Text>
        </TouchableOpacity>
      </View>

      {/* Recently Played Section */}
      {recentSongs.length > 0 && (
        <>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Recently Played</Text>
            <TouchableOpacity onPress={() => setCurrentView('songs')}>
              <Text style={styles.seeAllLink}>See All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recentCardsScroll}
          >
            {recentSongs.map(song => (
              <TouchableOpacity
                key={`recent_card_${song.id}`}
                activeOpacity={0.8}
                onPress={() => playSong(song)}
                style={styles.recentCard}
              >
                <ArtworkPlaceholder song={song} size={90} />
                <Text numberOfLines={1} style={styles.recentSongTitle}>
                  {song.title}
                </Text>
                <Text numberOfLines={1} style={styles.recentSongArtist}>
                  {song.artist}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </>
      )}

      {/* Your Playlists Section */}
      {playlists.length > 0 && (
        <>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Your Playlists</Text>
            <TouchableOpacity onPress={() => setCurrentView('playlists')}>
              <Text style={styles.seeAllLink}>See All</Text>
            </TouchableOpacity>
          </View>

          {playlists.slice(0, 2).map(pl => (
            <TouchableOpacity
              key={pl.id}
              activeOpacity={0.8}
              onPress={() => {
                const firstSong = songs.find(s => pl.songIds.includes(s.id)) || songs[0];
                if (firstSong) playSong(firstSong);
              }}
              style={styles.playlistCard}
            >
              <ArtworkPlaceholder song={songs[0] || null} size={56} />
              <View style={styles.playlistInfo}>
                <Text style={styles.playlistTitle}>{pl.title}</Text>
                <Text style={styles.playlistSub}>{pl.songCount} songs • {pl.durationString}</Text>
              </View>
              <View style={styles.playlistPlayBtn}>
                <Text style={styles.playlistPlayIcon}>▶</Text>
              </View>
            </TouchableOpacity>
          ))}
        </>
      )}

      {/* Offline Tracks List */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Offline Library</Text>
        <Text style={styles.seeAllLink}>{songs.length} Tracks</Text>
      </View>

      {songs.length > 0 ? (
        songs.map(item => (
          <SongItem key={`home_song_${item.id}`} song={item} />
        ))
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>🎵</Text>
          <Text style={styles.emptyTitle}>Mock songs removed!</Text>
          <Text style={styles.emptySub}>
            Ready to load your 15 real songs. Send the folder path, or tap below to search & stream online songs via YouTube.
          </Text>
          <TouchableOpacity
            onPress={() => setCurrentView('search')}
            style={styles.emptyActionBtn}
          >
            <Text style={styles.emptyActionText}>Search on YouTube Online 🔴</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingBottom: 110,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.sm,
  },
  menuTrigger: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.cardElevated,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  menuIcon: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  greetingContainer: {
    alignItems: 'center',
  },
  greetingTitle: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.xs + 1,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  greetingSubtitle: {
    color: '#FFFFFF',
    fontSize: FONTS.sizes.lg,
    fontWeight: '800',
    marginTop: 2,
  },
  bellTrigger: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.cardElevated,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  bellIcon: {
    fontSize: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
  },
  searchIcon: {
    fontSize: 15,
  },
  searchPlaceholder: {
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.sm,
    flex: 1,
  },
  categoriesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.md,
  },
  catItem: {
    alignItems: 'center',
    gap: 6,
  },
  catCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: 'rgba(139, 92, 246, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  catIcon: {
    color: COLORS.primary,
    fontSize: 22,
    fontWeight: 'bold',
  },
  catLabel: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: '700',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: FONTS.sizes.md + 1,
    fontWeight: '800',
  },
  seeAllLink: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.xs + 1,
    fontWeight: '700',
  },
  recentCardsScroll: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  recentCard: {
    width: 90,
  },
  recentSongTitle: {
    color: '#FFFFFF',
    fontSize: FONTS.sizes.xs,
    fontWeight: '700',
    marginTop: 6,
  },
  recentSongArtist: {
    color: COLORS.textSecondary,
    fontSize: 10,
    marginTop: 1,
  },
  playlistCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardElevated,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
    padding: SPACING.md,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  playlistInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  playlistTitle: {
    color: '#FFFFFF',
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
  },
  playlistSub: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.xs,
    marginTop: 3,
  },
  playlistPlayBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playlistPlayIcon: {
    color: '#FFFFFF',
    fontSize: 14,
    marginLeft: 2,
  },
  emptyCard: {
    backgroundColor: COLORS.card,
    marginHorizontal: SPACING.lg,
    padding: SPACING.xl,
    borderRadius: RADIUS.xxl,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.25)',
    alignItems: 'center',
    marginVertical: SPACING.md,
  },
  emptyIcon: {
    fontSize: 42,
    marginBottom: SPACING.sm,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: FONTS.sizes.lg,
    fontWeight: '800',
    textAlign: 'center',
  },
  emptySub: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.xs + 1,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  emptyActionBtn: {
    backgroundColor: COLORS.primary,
    marginTop: SPACING.lg,
    paddingVertical: 12,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.full,
  },
  emptyActionText: {
    color: '#FFFFFF',
    fontSize: FONTS.sizes.sm,
    fontWeight: '800',
  },
});

export default HomeScreen;
