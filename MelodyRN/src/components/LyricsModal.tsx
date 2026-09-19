import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';
import { usePlayer } from '../context/PlayerContext';
import ArtworkPlaceholder from './ArtworkPlaceholder';
import { COLORS, SPACING, RADIUS, FONTS } from '../constants/theme';

export const LyricsModal: React.FC = () => {
  const { isLyricsOpen, setLyricsOpen, currentSong } = usePlayer();
  const [activeTab, setActiveTab] = useState<'lyrics' | 'details'>('lyrics');

  if (!currentSong) return null;

  const lines = currentSong.lyrics || [
    'No synchronized lyrics available for this track.',
    '',
    'Lyrics will display automatically if embedded in the audio file metadata.',
  ];

  return (
    <Modal
      visible={isLyricsOpen}
      transparent
      animationType="slide"
      onRequestClose={() => setLyricsOpen(false)}
    >
      <View style={styles.container}>
        {/* Header matching Screen 12 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setLyricsOpen(false)} style={styles.backBtn}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>

          <View style={styles.headerInfo}>
            <ArtworkPlaceholder song={currentSong} size={36} />
            <View style={styles.headerText}>
              <Text numberOfLines={1} style={styles.title}>
                {currentSong.title}
              </Text>
              <Text numberOfLines={1} style={styles.artist}>
                {currentSong.artist}
              </Text>
            </View>
          </View>

          <View style={{ width: 40 }} />
        </View>

        {/* Tab Pills */}
        <View style={styles.tabsRow}>
          <TouchableOpacity
            onPress={() => setActiveTab('lyrics')}
            style={[styles.tabChip, activeTab === 'lyrics' && styles.tabChipActive]}
          >
            <Text style={[styles.tabText, activeTab === 'lyrics' && styles.tabTextActive]}>
              Lyrics
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('details')}
            style={[styles.tabChip, activeTab === 'details' && styles.tabChipActive]}
          >
            <Text style={[styles.tabText, activeTab === 'details' && styles.tabTextActive]}>
              Details
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {activeTab === 'lyrics' ? (
          <ScrollView
            style={styles.lyricsScroll}
            contentContainerStyle={styles.lyricsContent}
            showsVerticalScrollIndicator={false}
          >
            {lines.map((line, idx) => {
              const isHighlighted = idx >= 1 && idx <= 3; // Emphasize main chorus lines
              return (
                <Text
                  key={`line_${idx}`}
                  style={[
                    styles.lyricLine,
                    isHighlighted && styles.lyricLineHighlighted,
                  ]}
                >
                  {line}
                </Text>
              );
            })}
          </ScrollView>
        ) : (
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailKey}>Track Title</Text>
              <Text style={styles.detailVal}>{currentSong.title}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailKey}>Artist</Text>
              <Text style={styles.detailVal}>{currentSong.artist}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailKey}>Album</Text>
              <Text style={styles.detailVal}>{currentSong.album || 'Single'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailKey}>Format</Text>
              <Text style={styles.detailVal}>FLAC • 24-bit 96kHz Lossless</Text>
            </View>
          </View>
        )}
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
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
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
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    marginLeft: 10,
  },
  headerText: {
    flex: 1,
  },
  title: {
    color: '#FFFFFF',
    fontSize: FONTS.sizes.md,
    fontWeight: '800',
  },
  artist: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.xs + 1,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: SPACING.sm,
  },
  tabChip: {
    paddingVertical: 7,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tabChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tabText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  lyricsScroll: {
    flex: 1,
    marginTop: SPACING.md,
  },
  lyricsContent: {
    paddingVertical: SPACING.lg,
    gap: 20,
  },
  lyricLine: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.lg,
    lineHeight: 28,
    fontWeight: '600',
  },
  lyricLineHighlighted: {
    color: '#FFFFFF',
    fontSize: FONTS.sizes.xl,
    fontWeight: '800',
    textShadowColor: COLORS.glow,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  detailsCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginTop: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  detailKey: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.md,
  },
  detailVal: {
    color: COLORS.text,
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
  },
});

export default LyricsModal;
