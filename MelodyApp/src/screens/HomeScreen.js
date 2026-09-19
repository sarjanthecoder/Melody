import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity,
  StatusBar, Alert, Platform,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { usePlayer } from '../context/PlayerContext';
import SongItem from '../components/SongItem';
import ArtworkPlaceholder from '../components/ArtworkPlaceholder';
import { COLORS, SPACING, RADIUS, FONTS } from '../constants/theme';

export default function HomeScreen({ navigation }) {
  const {
    songs, recentlyPlayed, favorites, playSong, addSong,
  } = usePlayer();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'favourites', 'recent'

  const recentSongs = useMemo(() =>
    recentlyPlayed.slice(0, 10).map(id => songs.find(s => s.id === id)).filter(Boolean),
    [recentlyPlayed, songs]
  );

  const filteredSongs = useMemo(() => {
    let list = songs;
    if (activeTab === 'favourites') list = songs.filter(s => favorites.includes(s.id));
    else if (activeTab === 'recent') list = recentSongs;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(s =>
        s.title.toLowerCase().includes(q) ||
        s.artist.toLowerCase().includes(q) ||
        s.album?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [songs, search, activeTab, favorites, recentSongs]);

  async function handleImport() {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        multiple: true,
        copyToCacheDirectory: false,
      });
      if (result.canceled) return;
      const assets = result.assets || [result];
      assets.forEach(asset => {
        const song = {
          id: `imported_${Date.now()}_${Math.random().toString(36).slice(2)}`,
          title: asset.name?.replace(/\.[^/.]+$/, '') || 'Unknown',
          artist: 'Unknown Artist',
          album: 'Imported',
          duration: 0,
          isBuiltIn: false,
          artwork: null,
          uri: asset.uri,
        };
        addSong(song);
      });
      Alert.alert('Imported', `${assets.length} song(s) added to library.`);
    } catch (e) {
      Alert.alert('Error', 'Could not import songs. Please try again.');
    }
  }

  const listHeaderElement = useMemo(() => (
    <View>
      {/* Header */}
      <LinearGradient colors={['#0D1220', '#05070D']} style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.logoRow}>
            <LinearGradient colors={['#6366F1', '#D946EF']} style={styles.logoIcon}>
              <Text style={styles.logoEmoji}>♪</Text>
            </LinearGradient>
            <View>
              <Text style={styles.logoTitle}>Melody</Text>
              <Text style={styles.logoSub}>Offline Music Player</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('Settings')}
            style={styles.settingsBtn}
          >
            <Text style={styles.settingsIcon}>⚙</Text>
          </TouchableOpacity>
        </View>

        {/* Search bar */}
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search songs, artists, albums..."
            placeholderTextColor={COLORS.textMuted}
            value={search}
            onChangeText={setSearch}
            selectionColor={COLORS.primary}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      {/* Recently Played */}
      {recentSongs.length > 0 && !search && activeTab === 'all' && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recently Played</Text>
            <TouchableOpacity onPress={() => setActiveTab('recent')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal
            data={recentSongs.slice(0, 8)}
            keyExtractor={item => item.id + '_recent'}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recentList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.recentCard}
                onPress={() => playSong(item, songs, songs.findIndex(s => s.id === item.id))}
                activeOpacity={0.75}
              >
                <ArtworkPlaceholder song={item} size={72} style={styles.recentArtwork} />
                <Text style={styles.recentTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.recentArtist} numberOfLines={1}>{item.artist}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* Tabs */}
      <View style={styles.tabsRow}>
        {[
          { key: 'all', label: 'All' },
          { key: 'favourites', label: 'Favourites' },
          { key: 'recent', label: 'Recent' },
        ].map(tab => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setActiveTab(tab.key)}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity onPress={handleImport} style={styles.importBtn}>
          <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.importGrad}>
            <Text style={styles.importText}>＋ Import</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <Text style={styles.songCount}>{filteredSongs.length} songs</Text>
    </View>
  ), [search, activeTab, recentSongs, filteredSongs.length, songs]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <FlatList
        data={filteredSongs}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => (
          <SongItem
            song={item}
            queue={filteredSongs}
            index={index}
            onPress={() => {
              playSong(item, filteredSongs, index);
              navigation.navigate('NowPlaying');
            }}
          />
        )}
        ListHeaderComponent={listHeaderElement}
        contentContainerStyle={styles.listContent}
        initialNumToRender={15}
        maxToRenderPerBatch={20}
        windowSize={10}
        removeClippedSubviews={true}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🎵</Text>
            <Text style={styles.emptyText}>No songs found</Text>
            <Text style={styles.emptyHint}>Import music to get started</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingTop: StatusBar.currentHeight || 44, paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.lg },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  logoIcon: {
    width: 42, height: 42, borderRadius: RADIUS.md,
    alignItems: 'center', justifyContent: 'center',
  },
  logoEmoji: { fontSize: 22 },
  logoTitle: { color: COLORS.text, fontSize: FONTS.sizes.xl, fontWeight: '800' },
  logoSub: { color: COLORS.textSecondary, fontSize: FONTS.sizes.xs },
  settingsBtn: {
    width: 38, height: 38, borderRadius: RADIUS.full,
    backgroundColor: COLORS.card, alignItems: 'center', justifyContent: 'center',
  },
  settingsIcon: { fontSize: 18 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderWidth: 1, borderColor: COLORS.border,
  },
  searchIcon: { fontSize: 14, marginRight: SPACING.sm },
  searchInput: {
    flex: 1, color: COLORS.text, fontSize: FONTS.sizes.md,
  },
  clearIcon: { color: COLORS.textMuted, fontSize: 14 },
  section: { marginTop: SPACING.lg },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: SPACING.lg, marginBottom: SPACING.md,
  },
  sectionTitle: { color: COLORS.text, fontSize: FONTS.sizes.lg, fontWeight: '700' },
  seeAll: { color: COLORS.primary, fontSize: FONTS.sizes.sm },
  recentList: { paddingHorizontal: SPACING.lg, gap: SPACING.md },
  recentCard: { width: 80, alignItems: 'center' },
  recentArtwork: { borderRadius: RADIUS.md, marginBottom: SPACING.xs },
  recentTitle: { color: COLORS.text, fontSize: FONTS.sizes.xs, fontWeight: '600', textAlign: 'center' },
  recentArtist: { color: COLORS.textSecondary, fontSize: 10, textAlign: 'center' },
  tabsRow: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.lg,
    marginTop: SPACING.lg, gap: SPACING.sm,
  },
  tab: {
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full, backgroundColor: COLORS.card,
    borderWidth: 1, borderColor: COLORS.border,
  },
  tabActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  tabText: { color: COLORS.textSecondary, fontSize: FONTS.sizes.sm, fontWeight: '600' },
  tabTextActive: { color: COLORS.text },
  importBtn: { marginLeft: 'auto' },
  importGrad: {
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  importText: { color: COLORS.text, fontSize: FONTS.sizes.sm, fontWeight: '700' },
  songCount: {
    color: COLORS.textMuted, fontSize: FONTS.sizes.xs,
    paddingHorizontal: SPACING.lg, marginTop: SPACING.md, marginBottom: SPACING.xs,
  },
  listContent: { paddingBottom: 130 },
  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyIcon: { fontSize: 48, marginBottom: SPACING.md },
  emptyText: { color: COLORS.text, fontSize: FONTS.sizes.lg, fontWeight: '700' },
  emptyHint: { color: COLORS.textSecondary, fontSize: FONTS.sizes.sm, marginTop: SPACING.xs },
});
