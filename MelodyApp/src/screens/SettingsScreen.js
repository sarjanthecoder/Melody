import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Switch, Alert, StatusBar, TextInput, Modal,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { usePlayer } from '../context/PlayerContext';
import { COLORS, SPACING, RADIUS, FONTS } from '../constants/theme';

const THEMES = [
  { id: 'dark', label: 'Dark (Default)', colors: ['#05070D', '#0D1220'] },
  { id: 'ocean', label: 'Ocean Blue', colors: ['#020b18', '#0a2040'] },
  { id: 'sunset', label: 'Sunset', colors: ['#1a0a0a', '#2d1020'] },
  { id: 'forest', label: 'Forest', colors: ['#060d08', '#0d2010'] },
  { id: 'minimal', label: 'Minimal', colors: ['#111111', '#1a1a1a'] },
  { id: 'purple', label: 'Purple', colors: ['#0a0514', '#1a0830'] },
  { id: 'neon', label: 'Neon', colors: ['#020212', '#060630'] },
];

const EQ_BANDS = ['60Hz', '230Hz', '910Hz', '3.6kHz', '14kHz'];

function Row({ label, icon, right, onPress, danger }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={onPress ? 0.7 : 1} style={styles.row}>
      <View style={styles.rowLeft}>
        <View style={[styles.rowIcon, danger && styles.rowIconDanger]}>
          <Text style={styles.rowIconText}>{icon}</Text>
        </View>
        <Text style={[styles.rowLabel, danger && styles.rowLabelDanger]}>{label}</Text>
      </View>
      {right}
    </TouchableOpacity>
  );
}

export default function SettingsScreen({ navigation }) {
  const { settings, updateSettings, songs, addSong } = usePlayer();
  const [showTheme, setShowTheme] = useState(false);
  const [showEq, setShowEq] = useState(false);
  const [showSleep, setShowSleep] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(settings.youtubeApiKey || '');
  const [eqBands, setEqBands] = useState(settings.equalizerBands || [0, 0, 0, 0, 0]);
  const [sleepTimer, setSleepTimer] = useState(null);

  const importedSongs = songs.filter(s => !s.isBuiltIn);
  const totalStorage = importedSongs.length * 4; // rough MB estimate

  async function handleImport() {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'audio/*', multiple: true });
      if (result.canceled) return;
      const assets = result.assets || [result];
      assets.forEach(asset => {
        addSong({
          id: `imported_${Date.now()}_${Math.random().toString(36).slice(2)}`,
          title: asset.name?.replace(/\.[^/.]+$/, '') || 'Unknown',
          artist: 'Unknown Artist',
          album: 'Imported',
          duration: 0,
          isBuiltIn: false,
          artwork: null,
          uri: asset.uri,
        });
      });
      Alert.alert('Done', `${assets.length} song(s) imported.`);
    } catch (e) {
      Alert.alert('Error', 'Failed to import songs.');
    }
  }

  const sleepOptions = [
    { label: '15 minutes', value: 15 },
    { label: '30 minutes', value: 30 },
    { label: '2 hours', value: 120 },
    { label: 'Custom', value: null },
    { label: 'Off', value: 0 },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <LinearGradient colors={['#0D1220', '#05070D']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Playback */}
        <Text style={styles.groupLabel}>PLAYBACK</Text>
        <View style={styles.card}>
          <Row
            icon="🌐"
            label="Offline Mode"
            right={
              <Switch
                value={settings.offlineMode}
                onValueChange={v => updateSettings({ offlineMode: v })}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
                thumbColor={COLORS.text}
              />
            }
          />
          <View style={styles.divider} />
          <Row
            icon="🎚"
            label="Audio Quality"
            right={
              <TouchableOpacity
                onPress={() => updateSettings({ audioQuality: settings.audioQuality === 'high' ? 'normal' : 'high' })}
                style={styles.pill}
              >
                <Text style={styles.pillText}>{settings.audioQuality === 'high' ? 'High' : 'Normal'}</Text>
              </TouchableOpacity>
            }
          />
          <View style={styles.divider} />
          <Row
            icon="📻"
            label="Equalizer"
            onPress={() => setShowEq(true)}
            right={<Text style={styles.chevronRight}>›</Text>}
          />
        </View>

        {/* Library */}
        <Text style={styles.groupLabel}>LIBRARY</Text>
        <View style={styles.card}>
          <Row icon="📂" label="Import Music" onPress={handleImport} right={<Text style={styles.chevronRight}>›</Text>} />
          <View style={styles.divider} />
          <Row
            icon="💾"
            label="Storage Used"
            right={
              <Text style={styles.rightText}>
                {importedSongs.length} songs · ~{totalStorage} MB
              </Text>
            }
          />
        </View>

        {/* Timer */}
        <Text style={styles.groupLabel}>TIMER</Text>
        <View style={styles.card}>
          <Row
            icon="⏱"
            label="Sleep Timer"
            onPress={() => setShowSleep(true)}
            right={
              <View style={styles.row2}>
                <Text style={styles.rightText}>
                  {settings.sleepTimerMinutes ? `${settings.sleepTimerMinutes} min` : 'Off'}
                </Text>
                <Text style={styles.chevronRight}>›</Text>
              </View>
            }
          />
        </View>

        {/* Appearance */}
        <Text style={styles.groupLabel}>APPEARANCE</Text>
        <View style={styles.card}>
          <Row
            icon="🎨"
            label="Theme"
            onPress={() => setShowTheme(true)}
            right={
              <View style={styles.row2}>
                <Text style={styles.rightText}>{THEMES.find(t => t.id === settings.theme)?.label || 'Dark'}</Text>
                <Text style={styles.chevronRight}>›</Text>
              </View>
            }
          />
        </View>

        {/* Online */}
        <Text style={styles.groupLabel}>ONLINE MODE (OPTIONAL)</Text>
        <View style={styles.card}>
          <Row
            icon="🌍"
            label="Online Mode"
            right={
              <Switch
                value={settings.onlineMode}
                onValueChange={v => updateSettings({ onlineMode: v })}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
                thumbColor={COLORS.text}
              />
            }
          />
          {settings.onlineMode && (
            <>
              <View style={styles.divider} />
              <Row
                icon="🔑"
                label="YouTube API Key"
                onPress={() => setShowApiKey(true)}
                right={
                  <View style={styles.row2}>
                    <Text style={styles.rightText}>{settings.youtubeApiKey ? '••••••••' : 'Not set'}</Text>
                    <Text style={styles.chevronRight}>›</Text>
                  </View>
                }
              />
            </>
          )}
        </View>

        {/* About */}
        <Text style={styles.groupLabel}>ABOUT</Text>
        <View style={styles.card}>
          <View style={styles.aboutBox}>
            <LinearGradient colors={['#6366F1', '#D946EF']} style={styles.aboutIcon}>
              <Text style={{ fontSize: 28 }}>♪</Text>
            </LinearGradient>
            <Text style={styles.aboutTitle}>Melody</Text>
            <Text style={styles.aboutVersion}>Version 1.0.0</Text>
            <Text style={styles.aboutDesc}>
              A lightweight offline music player.{'\n'}No internet needed.
            </Text>
          </View>
        </View>
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Theme Modal */}
      <Modal visible={showTheme} transparent animationType="slide" onRequestClose={() => setShowTheme(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Choose Theme</Text>
            {THEMES.map(theme => (
              <TouchableOpacity
                key={theme.id}
                style={[styles.themeRow, settings.theme === theme.id && styles.themeRowActive]}
                onPress={() => { updateSettings({ theme: theme.id }); setShowTheme(false); }}
              >
                <LinearGradient colors={theme.colors} style={styles.themePreview} />
                <Text style={styles.themeLabel}>{theme.label}</Text>
                {settings.theme === theme.id && <Text style={styles.checkIcon}>✓</Text>}
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setShowTheme(false)} style={styles.modalClose}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Equalizer Modal */}
      <Modal visible={showEq} transparent animationType="slide" onRequestClose={() => setShowEq(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Equalizer</Text>
              <Switch
                value={settings.equalizerEnabled}
                onValueChange={v => updateSettings({ equalizerEnabled: v })}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
                thumbColor={COLORS.text}
              />
            </View>
            <View style={styles.eqRow}>
              {EQ_BANDS.map((band, i) => (
                <View key={band} style={styles.eqBand}>
                  <Text style={styles.eqValue}>{eqBands[i] > 0 ? '+' : ''}{eqBands[i]}</Text>
                  <View style={styles.eqSliderWrap}>
                    <View style={styles.eqTrack}>
                      <View style={[styles.eqFill, { height: `${50 + eqBands[i] * 5}%` }]} />
                    </View>
                  </View>
                  <Text style={styles.eqLabel}>{band}</Text>
                </View>
              ))}
            </View>
            <View style={styles.eqBtns}>
              {['Custom', 'Pop', 'Rock', 'Bass'].map(preset => (
                <TouchableOpacity key={preset} style={styles.eqPreset}>
                  <Text style={styles.eqPresetText}>{preset}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              onPress={() => { setEqBands([0, 0, 0, 0, 0]); updateSettings({ equalizerBands: [0, 0, 0, 0, 0] }); }}
              style={styles.resetBtn}
            >
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { updateSettings({ equalizerBands: eqBands }); setShowEq(false); }} style={styles.modalClose}>
              <Text style={styles.modalCloseText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Sleep Timer Modal */}
      <Modal visible={showSleep} transparent animationType="slide" onRequestClose={() => setShowSleep(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Sleep Timer</Text>
            <Text style={styles.sleepSubtitle}>Stop music after</Text>
            {sleepOptions.map(opt => (
              <TouchableOpacity
                key={opt.label}
                style={[styles.sleepRow, settings.sleepTimerMinutes === opt.value && styles.sleepRowActive]}
                onPress={() => {
                  if (opt.value !== null) {
                    updateSettings({ sleepTimerMinutes: opt.value });
                  }
                }}
              >
                <Text style={[styles.sleepLabel, settings.sleepTimerMinutes === opt.value && styles.sleepLabelActive]}>
                  {opt.label}
                </Text>
                {settings.sleepTimerMinutes === opt.value && <Text style={styles.checkIcon}>✓</Text>}
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={() => setShowSleep(false)}
              style={[styles.modalClose, { backgroundColor: COLORS.primary, marginTop: SPACING.sm }]}
            >
              <Text style={[styles.modalCloseText, { fontWeight: '700' }]}>Start Timer</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowSleep(false)} style={styles.modalClose}>
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* API Key Modal */}
      <Modal visible={showApiKey} transparent animationType="slide" onRequestClose={() => setShowApiKey(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>YouTube API Key</Text>
            <Text style={styles.apiKeyHint}>Enter your YouTube Data API v3 key to enable online search.</Text>
            <TextInput
              style={styles.apiKeyInput}
              value={tempApiKey}
              onChangeText={setTempApiKey}
              placeholder="AIza..."
              placeholderTextColor={COLORS.textMuted}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              onPress={() => { updateSettings({ youtubeApiKey: tempApiKey }); setShowApiKey(false); }}
              style={[styles.modalClose, { backgroundColor: COLORS.primary }]}
            >
              <Text style={[styles.modalCloseText, { fontWeight: '700' }]}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowApiKey(false)} style={styles.modalClose}>
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: StatusBar.currentHeight || 50,
    paddingHorizontal: SPACING.lg, paddingBottom: SPACING.lg,
  },
  backBtn: { width: 40, alignItems: 'flex-start' },
  backIcon: { color: COLORS.text, fontSize: 24 },
  headerTitle: { color: COLORS.text, fontSize: FONTS.sizes.xl, fontWeight: '700' },
  scroll: { flex: 1 },
  groupLabel: {
    color: COLORS.textMuted, fontSize: FONTS.sizes.xs, fontWeight: '700', letterSpacing: 1.5,
    paddingHorizontal: SPACING.lg, paddingTop: SPACING.xl, paddingBottom: SPACING.sm,
  },
  card: {
    marginHorizontal: SPACING.lg, backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border,
  },
  row: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md,
  },
  row2: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, flex: 1 },
  rowIcon: {
    width: 36, height: 36, borderRadius: RADIUS.sm,
    backgroundColor: 'rgba(139,92,246,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  rowIconDanger: { backgroundColor: 'rgba(239,68,68,0.15)' },
  rowIconText: { fontSize: 18 },
  rowLabel: { color: COLORS.text, fontSize: FONTS.sizes.md, fontWeight: '500' },
  rowLabelDanger: { color: COLORS.error },
  divider: { height: 1, backgroundColor: COLORS.border, marginHorizontal: SPACING.lg },
  pill: {
    backgroundColor: 'rgba(139,92,246,0.2)', paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs, borderRadius: RADIUS.full,
    borderWidth: 1, borderColor: COLORS.primary,
  },
  pillText: { color: COLORS.primary, fontSize: FONTS.sizes.sm, fontWeight: '600' },
  chevronRight: { color: COLORS.textMuted, fontSize: 20 },
  rightText: { color: COLORS.textSecondary, fontSize: FONTS.sizes.sm },
  aboutBox: { padding: SPACING.xl, alignItems: 'center' },
  aboutIcon: {
    width: 64, height: 64, borderRadius: RADIUS.lg,
    alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.md,
  },
  aboutTitle: { color: COLORS.text, fontSize: FONTS.sizes.xxl, fontWeight: '800', marginBottom: SPACING.xs },
  aboutVersion: { color: COLORS.primary, fontSize: FONTS.sizes.sm, marginBottom: SPACING.sm },
  aboutDesc: { color: COLORS.textSecondary, fontSize: FONTS.sizes.sm, textAlign: 'center', lineHeight: 20 },
  // Modals
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#111827',
    borderTopLeftRadius: RADIUS.xxl, borderTopRightRadius: RADIUS.xxl,
    padding: SPACING.xl, paddingBottom: 40,
    borderTopWidth: 1, borderColor: COLORS.border,
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  modalTitle: { color: COLORS.text, fontSize: FONTS.sizes.xl, fontWeight: '700', marginBottom: SPACING.lg },
  modalClose: {
    backgroundColor: COLORS.card, borderRadius: RADIUS.md,
    padding: SPACING.md, alignItems: 'center', marginTop: SPACING.md,
    borderWidth: 1, borderColor: COLORS.border,
  },
  modalCloseText: { color: COLORS.text, fontSize: FONTS.sizes.md },
  themeRow: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    padding: SPACING.md, borderRadius: RADIUS.md, marginBottom: SPACING.xs,
  },
  themeRowActive: { backgroundColor: 'rgba(139,92,246,0.15)', borderWidth: 1, borderColor: COLORS.primary },
  themePreview: { width: 32, height: 32, borderRadius: RADIUS.sm },
  themeLabel: { color: COLORS.text, fontSize: FONTS.sizes.md, flex: 1 },
  checkIcon: { color: COLORS.primary, fontSize: 18, fontWeight: '700' },
  eqRow: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: SPACING.lg, height: 160 },
  eqBand: { alignItems: 'center', flex: 1 },
  eqValue: { color: COLORS.primary, fontSize: FONTS.sizes.xs, marginBottom: SPACING.xs },
  eqSliderWrap: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  eqTrack: {
    width: 4, height: 100, backgroundColor: COLORS.border,
    borderRadius: RADIUS.full, overflow: 'hidden', justifyContent: 'flex-end',
  },
  eqFill: { width: '100%', backgroundColor: COLORS.primary, borderRadius: RADIUS.full },
  eqLabel: { color: COLORS.textMuted, fontSize: 9, marginTop: SPACING.xs, textAlign: 'center' },
  eqBtns: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md },
  eqPreset: {
    flex: 1, padding: SPACING.sm, backgroundColor: COLORS.card,
    borderRadius: RADIUS.sm, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border,
  },
  eqPresetText: { color: COLORS.textSecondary, fontSize: FONTS.sizes.xs },
  resetBtn: { padding: SPACING.md, alignItems: 'center' },
  resetText: { color: COLORS.primary, fontSize: FONTS.sizes.md },
  sleepSubtitle: { color: COLORS.textSecondary, fontSize: FONTS.sizes.sm, marginBottom: SPACING.md, marginTop: -SPACING.sm },
  sleepRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: SPACING.md, borderRadius: RADIUS.md, marginBottom: SPACING.xs,
  },
  sleepRowActive: { backgroundColor: 'rgba(139,92,246,0.15)', borderWidth: 1, borderColor: COLORS.primary },
  sleepLabel: { color: COLORS.textSecondary, fontSize: FONTS.sizes.md },
  sleepLabelActive: { color: COLORS.text, fontWeight: '600' },
  apiKeyHint: { color: COLORS.textSecondary, fontSize: FONTS.sizes.sm, marginBottom: SPACING.lg, marginTop: -SPACING.sm },
  apiKeyInput: {
    backgroundColor: COLORS.card, borderRadius: RADIUS.md, padding: SPACING.md,
    color: COLORS.text, fontSize: FONTS.sizes.md, borderWidth: 1, borderColor: COLORS.border,
    marginBottom: SPACING.sm,
  },
});
