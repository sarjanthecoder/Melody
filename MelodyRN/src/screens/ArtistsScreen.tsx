import React from 'react';
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
import { Artist } from '../types/music';

export const ArtistsScreen: React.FC = () => {
  const { artists, songs, playSong, setCurrentView } = usePlayer();

  const handleArtistPress = (artist: Artist) => {
    const artistSong = songs.find(s => s.artist.toLowerCase().includes(artist.name.toLowerCase()));
    if (artistSong) {
      playSong(artistSong);
    } else if (songs.length > 0) {
      playSong(songs[0]);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header matching Screen 18 */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => setCurrentView('home')}
          style={styles.backBtn}
        >
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Artists</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Artists List */}
      <FlatList
        data={artists}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => handleArtistPress(item)}
            style={styles.artistRow}
          >
            <LinearGradient
              colors={item.avatarColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>{item.name.slice(0, 2).toUpperCase()}</Text>
            </LinearGradient>

            <View style={styles.artistInfo}>
              <Text style={styles.artistName}>{item.name}</Text>
              <Text style={styles.songCount}>{item.songCount} songs</Text>
            </View>

            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>👤</Text>
            <Text style={styles.emptyTitle}>No Artists Loaded</Text>
            <Text style={styles.emptySub}>
              Mock artists removed. Your local 15 audio tracks will automatically populate your artist library!
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
  listContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: 110,
    gap: SPACING.sm,
  },
  artistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: SPACING.md,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  artistInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  artistName: {
    color: '#FFFFFF',
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
  },
  songCount: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.xs + 1,
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

export default ArtistsScreen;
