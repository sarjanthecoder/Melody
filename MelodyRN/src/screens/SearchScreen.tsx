import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { usePlayer } from '../context/PlayerContext';
import { COLORS, SPACING, RADIUS, FONTS } from '../constants/theme';
import ArtworkPlaceholder from '../components/ArtworkPlaceholder';

export const SearchScreen: React.FC = () => {
  const {
    songs,
    artists,
    playSong,
    setCurrentView,
    settings,
    searchYouTube,
    onlineSearchResults,
    isSearchingOnline,
  } = usePlayer();

  const [query, setQuery] = useState('');
  const [searchMode, setSearchMode] = useState<'local' | 'youtube'>(
    settings.onlineMode && settings.youtubeApiKey ? 'youtube' : 'local'
  );

  const filteredSongs = useMemo(() => {
    if (!query.trim()) return songs.slice(0, 5);
    const q = query.toLowerCase();
    return songs.filter(
      s =>
        s.title.toLowerCase().includes(q) ||
        s.artist.toLowerCase().includes(q) ||
        (s.album && s.album.toLowerCase().includes(q))
    );
  }, [query, songs]);

  const filteredArtists = useMemo(() => {
    if (!query.trim()) return artists.slice(0, 4);
    const q = query.toLowerCase();
    return artists.filter(a => a.name.toLowerCase().includes(q));
  }, [query, artists]);

  const handleSearchSubmit = () => {
    if (searchMode === 'youtube' && query.trim()) {
      searchYouTube(query.trim()).catch(() => {});
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with Search Input */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => setCurrentView('home')}
          style={styles.backBtn}
        >
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Search</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Mode Switcher: Local Offline vs YouTube Online */}
      <View style={styles.modeTabs}>
        <TouchableOpacity
          onPress={() => setSearchMode('local')}
          style={[styles.modeTab, searchMode === 'local' && styles.modeTabActive]}
        >
          <Text style={[styles.modeTabText, searchMode === 'local' && styles.modeTabTextActive]}>
            Local Offline
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSearchMode('youtube')}
          style={[styles.modeTab, searchMode === 'youtube' && styles.modeTabActive]}
        >
          <Text style={[styles.modeTabText, searchMode === 'youtube' && styles.modeTabTextActive]}>
            YouTube Online 🔴
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          value={query}
          onChangeText={txt => {
            setQuery(txt);
            if (searchMode === 'youtube' && txt.length > 3) {
              searchYouTube(txt).catch(() => {});
            }
          }}
          onSubmitEditing={handleSearchSubmit}
          placeholder={
            searchMode === 'youtube'
              ? 'Search any song on YouTube...'
              : 'Search songs, artists...'
          }
          placeholderTextColor={COLORS.textMuted}
          style={styles.searchInput}
          autoFocus
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')} style={styles.clearBtn}>
            <Text style={styles.clearBtnText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* YOUTUBE ONLINE RESULTS */}
        {searchMode === 'youtube' ? (
          <View>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>YouTube Results</Text>
              {isSearchingOnline && <ActivityIndicator size="small" color={COLORS.primary} />}
            </View>

            {!settings.youtubeApiKey && (
              <TouchableOpacity
                onPress={() => setCurrentView('settings')}
                style={styles.apiKeyNoticeCard}
              >
                <Text style={styles.apiKeyNoticeTitle}>YouTube API Key Needed</Text>
                <Text style={styles.apiKeyNoticeSub}>
                  Tap here to open Settings and enter your free YouTube Data API key.
                </Text>
              </TouchableOpacity>
            )}

            {onlineSearchResults.map(song => (
              <TouchableOpacity
                key={song.id}
                activeOpacity={0.7}
                onPress={() => playSong(song)}
                style={styles.songRow}
              >
                {song.artwork ? (
                  <Image source={{ uri: song.artwork }} style={styles.onlineThumb} />
                ) : (
                  <ArtworkPlaceholder song={song} size={46} />
                )}
                <View style={styles.songInfo}>
                  <Text numberOfLines={1} style={styles.songTitle}>
                    {song.title}
                  </Text>
                  <Text numberOfLines={1} style={styles.songArtist}>
                    {song.artist}
                  </Text>
                </View>
                <Text style={styles.playIcon}>▶</Text>
              </TouchableOpacity>
            ))}

            {onlineSearchResults.length === 0 && !isSearchingOnline && query.length > 0 && (
              <Text style={styles.emptyText}>Type a song name and press Enter to search YouTube.</Text>
            )}
          </View>
        ) : (
          /* LOCAL OFFLINE RESULTS */
          <View>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Songs</Text>
              <TouchableOpacity onPress={() => setCurrentView('songs')}>
                <Text style={styles.seeAllLink}>See All</Text>
              </TouchableOpacity>
            </View>

            {filteredSongs.slice(0, 5).map(song => (
              <TouchableOpacity
                key={`search_song_${song.id}`}
                activeOpacity={0.7}
                onPress={() => playSong(song)}
                style={styles.songRow}
              >
                <ArtworkPlaceholder song={song} size={46} />
                <View style={styles.songInfo}>
                  <Text numberOfLines={1} style={styles.songTitle}>
                    {song.title}
                  </Text>
                  <Text numberOfLines={1} style={styles.songArtist}>
                    {song.artist}
                  </Text>
                </View>
                <Text style={styles.playIcon}>▶</Text>
              </TouchableOpacity>
            ))}

            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Artists</Text>
              <TouchableOpacity onPress={() => setCurrentView('artists')}>
                <Text style={styles.seeAllLink}>See All</Text>
              </TouchableOpacity>
            </View>

            {filteredArtists.map(artist => (
              <TouchableOpacity
                key={`search_artist_${artist.id}`}
                activeOpacity={0.7}
                onPress={() => setCurrentView('artists')}
                style={styles.artistRow}
              >
                <LinearGradient
                  colors={artist.avatarColors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.artistAvatar}
                >
                  <Text style={styles.artistAvatarText}>
                    {artist.name.slice(0, 2).toUpperCase()}
                  </Text>
                </LinearGradient>
                <Text style={styles.artistName}>{artist.name}</Text>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
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
  modeTabs: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
    marginVertical: SPACING.xs,
  },
  modeTab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modeTabActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  modeTabText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  modeTabTextActive: {
    color: '#FFFFFF',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: FONTS.sizes.md,
    paddingVertical: SPACING.sm + 2,
  },
  clearBtn: {
    padding: 4,
  },
  clearBtnText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 110,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: FONTS.sizes.md,
    fontWeight: '800',
  },
  seeAllLink: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.xs + 1,
    fontWeight: '700',
  },
  apiKeyNoticeCard: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderWidth: 1,
    borderColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    marginVertical: SPACING.sm,
  },
  apiKeyNoticeTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  apiKeyNoticeSub: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  songRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: SPACING.sm + 2,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  onlineThumb: {
    width: 46,
    height: 46,
    borderRadius: RADIUS.md,
    backgroundColor: '#000',
  },
  songInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  songTitle: {
    color: '#FFFFFF',
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
  },
  songArtist: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.xs,
    marginTop: 2,
  },
  playIcon: {
    color: COLORS.primary,
    fontSize: 14,
    paddingRight: 6,
  },
  artistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: SPACING.sm + 2,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  artistAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  artistAvatarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  artistName: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    marginLeft: SPACING.md,
  },
  chevron: {
    color: COLORS.textMuted,
    fontSize: 22,
    paddingRight: 6,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 30,
  },
});

export default SearchScreen;
