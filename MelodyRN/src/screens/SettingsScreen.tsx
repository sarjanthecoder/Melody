import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
  Alert,
} from 'react-native';
import { usePlayer } from '../context/PlayerContext';
import { COLORS, SPACING, RADIUS, FONTS } from '../constants/theme';
import ThemeSelectModal from '../components/ThemeSelectModal';

export const SettingsScreen: React.FC = () => {
  const {
    settings,
    updateSettings,
    setSleepTimerOpen,
    songs,
    setCurrentView,
    clearMockData,
    searchYouTube,
  } = usePlayer();

  const [themeModalVisible, setThemeModalVisible] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(settings.youtubeApiKey);
  const [isTestingKey, setIsTestingKey] = useState(false);

  const handleSaveApiKey = async () => {
    updateSettings({ youtubeApiKey: apiKeyInput.trim(), onlineMode: true });
    if (!apiKeyInput.trim()) {
      Alert.alert('Cleared', 'YouTube API Key removed.');
      return;
    }

    setIsTestingKey(true);
    try {
      // Test search
      const results = await searchYouTube('Tamil songs');
      Alert.alert(
        'Success! API Key Active',
        `Connected to YouTube Data API v3.\nFound ${results.length} results. You can now search and stream online music from Search screen!`
      );
    } catch (err: any) {
      Alert.alert('API Key Notice', err?.message || 'Key saved. Please verify API quotas.');
    } finally {
      setIsTestingKey(false);
    }
  };

  const handleClearMockData = () => {
    Alert.alert(
      'Remove Mock Songs',
      'Do you want to clear the mock tracks? You can then provide your local folder path to load the 15 real songs.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove Mock Data',
          style: 'destructive',
          onPress: () => {
            clearMockData();
            Alert.alert('Cleared', 'Mock data removed! Ready to load real songs from your directory.');
          },
        },
      ]
    );
  };

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
        <Text style={styles.title}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* YOUTUBE ONLINE STREAMING CONFIG */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>YOUTUBE ONLINE STREAMING</Text>

          <View style={styles.row}>
            <View style={styles.leftRow}>
              <Text style={styles.rowIcon}>🔴</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowLabel}>Online Music Mode</Text>
                <Text style={styles.rowSub}>Search & stream via YouTube API</Text>
              </View>
            </View>
            <Switch
              value={settings.onlineMode}
              onValueChange={val => updateSettings({ onlineMode: val, offlineMode: !val })}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={settings.onlineMode ? '#FFFFFF' : COLORS.textSecondary}
            />
          </View>

          <Text style={styles.inputLabel}>YouTube Data API v3 Key</Text>
          <View style={styles.inputRow}>
            <TextInput
              value={apiKeyInput}
              onChangeText={setApiKeyInput}
              placeholder="Paste AIzaSy... API Key here"
              placeholderTextColor={COLORS.textMuted}
              secureTextEntry
              style={styles.apiKeyInput}
            />
            <TouchableOpacity
              onPress={handleSaveApiKey}
              disabled={isTestingKey}
              style={styles.saveKeyBtn}
            >
              <Text style={styles.saveKeyBtnText}>
                {isTestingKey ? 'Testing...' : 'Save & Test'}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.apiKeyHelp}>
            Enter your Google Cloud YouTube Data API v3 key to enable online search and streaming without premium.
          </Text>
        </View>

        {/* BUNDLED OFFLINE MUSIC STORAGE */}
        <View style={[styles.sectionCard, { marginTop: SPACING.md }]}>
          <Text style={styles.sectionHeader}>BUNDLED OFFLINE STORAGE</Text>

          <View style={styles.row}>
            <View style={styles.leftRow}>
              <Text style={styles.rowIcon}>💾</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowLabel}>Built-in Audio Storage</Text>
                <Text style={styles.rowSub}>82.0 MB • 15 Tamil Songs (Zero Data)</Text>
              </View>
            </View>
            <View style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
              <Text style={{ color: COLORS.success, fontSize: 11, fontWeight: '700' }}>BUNDLED</Text>
            </View>
          </View>
        </View>

        {/* PLAYBACK PREFERENCES */}
        <View style={[styles.sectionCard, { marginTop: SPACING.md }]}>
          <Text style={styles.sectionHeader}>PREFERENCES</Text>

          {/* Theme Row */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setThemeModalVisible(true)}
            style={styles.row}
          >
            <View style={styles.leftRow}>
              <Text style={styles.rowIcon}>🎨</Text>
              <Text style={styles.rowLabel}>Theme</Text>
            </View>
            <View style={styles.rightRow}>
              <Text style={styles.rowValue}>{settings.theme}</Text>
              <Text style={styles.chevron}>›</Text>
            </View>
          </TouchableOpacity>

          {/* Audio Quality Row */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              const nextQuality =
                settings.audioQuality === 'high'
                  ? 'lossless'
                  : settings.audioQuality === 'lossless'
                  ? 'normal'
                  : 'high';
              updateSettings({ audioQuality: nextQuality });
            }}
            style={styles.row}
          >
            <View style={styles.leftRow}>
              <Text style={styles.rowIcon}>🔊</Text>
              <Text style={styles.rowLabel}>Audio Quality</Text>
            </View>
            <View style={styles.rightRow}>
              <Text style={styles.rowValue}>{settings.audioQuality.toUpperCase()}</Text>
              <Text style={styles.chevron}>›</Text>
            </View>
          </TouchableOpacity>

          {/* Sleep Timer Row */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setSleepTimerOpen(true)}
            style={[styles.row, { borderBottomWidth: 0 }]}
          >
            <View style={styles.leftRow}>
              <Text style={styles.rowIcon}>🌙</Text>
              <Text style={styles.rowLabel}>Sleep Timer</Text>
            </View>
            <View style={styles.rightRow}>
              <Text style={styles.rowValue}>
                {settings.sleepTimerMinutes > 0 ? `${settings.sleepTimerMinutes}m` : 'Off'}
              </Text>
              <Text style={styles.chevron}>›</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* App Branding */}
        <View style={styles.aboutFooter}>
          <Text style={styles.aboutLogo}>MELODY</Text>
          <Text style={styles.aboutVersion}>Version 1.0.0 (YouTube Online & Offline)</Text>
          <Text style={styles.aboutTagline}>
            A lightweight music player with YouTube streaming and local offline support.
          </Text>
        </View>
      </ScrollView>

      <ThemeSelectModal
        visible={themeModalVisible}
        onClose={() => setThemeModalVisible(false)}
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
  content: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: 110,
  },
  sectionCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
  },
  sectionHeader: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: SPACING.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  rowIcon: {
    fontSize: 18,
    width: 26,
    textAlign: 'center',
  },
  rowLabel: {
    color: '#FFFFFF',
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
  },
  rowSub: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rowValue: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.sm,
  },
  chevron: {
    color: COLORS.textMuted,
    fontSize: 22,
  },
  inputLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    marginTop: SPACING.md,
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  apiKeyInput: {
    flex: 1,
    backgroundColor: COLORS.background,
    color: COLORS.text,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    fontSize: FONTS.sizes.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  saveKeyBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveKeyBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  apiKeyHelp: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginTop: 6,
    lineHeight: 14,
  },
  clearMockBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  clearMockBtnText: {
    color: COLORS.error,
    fontSize: 11,
    fontWeight: '700',
  },
  aboutFooter: {
    alignItems: 'center',
    marginTop: 35,
    paddingHorizontal: SPACING.xl,
  },
  aboutLogo: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.xl,
    fontWeight: '900',
    letterSpacing: 2,
  },
  aboutVersion: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.xs,
    marginTop: 4,
  },
  aboutTagline: {
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.xs + 1,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
  },
});

export default SettingsScreen;
