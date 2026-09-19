import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Switch,
} from 'react-native';
import { usePlayer } from '../context/PlayerContext';
import { COLORS, SPACING, RADIUS, FONTS } from '../constants/theme';
import { EqualizerPreset } from '../types/music';

export const EqualizerModal: React.FC = () => {
  const {
    isEqualizerOpen,
    setEqualizerOpen,
    settings,
    updateSettings,
    setEqualizerBand,
    setEqualizerPreset,
  } = usePlayer();

  const presets: EqualizerPreset[] = ['Custom', 'Pop', 'Rock', 'Bass'];
  const frequencies = ['60Hz', '230Hz', '910Hz', '3.6kHz', '14kHz'];

  const handleBandAdjust = (index: number, delta: number) => {
    const current = settings.equalizerBands[index] ?? 0;
    const nextVal = Math.max(-10, Math.min(10, current + delta));
    setEqualizerBand(index, nextVal);
  };

  const handleReset = () => {
    setEqualizerPreset('Custom');
    frequencies.forEach((_, idx) => setEqualizerBand(idx, 0));
  };

  return (
    <Modal
      visible={isEqualizerOpen}
      transparent
      animationType="slide"
      onRequestClose={() => setEqualizerOpen(false)}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => setEqualizerOpen(false)}
            style={styles.backBtn}
          >
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Equalizer</Text>

          <Switch
            value={settings.equalizerEnabled}
            onValueChange={val => updateSettings({ equalizerEnabled: val })}
            trackColor={{ false: COLORS.border, true: COLORS.primary }}
            thumbColor={settings.equalizerEnabled ? '#FFFFFF' : COLORS.textSecondary}
          />
        </View>

        {/* Presets Row */}
        <View style={styles.presetsRow}>
          {presets.map(p => {
            const isActive = settings.equalizerPreset === p;
            return (
              <TouchableOpacity
                key={p}
                onPress={() => setEqualizerPreset(p)}
                style={[styles.presetChip, isActive && styles.presetChipActive]}
              >
                <Text style={[styles.presetText, isActive && styles.presetTextActive]}>
                  {p}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 5 Equalizer Vertical Sliders matching Screen 14 */}
        <View style={styles.slidersContainer}>
          {frequencies.map((freq, idx) => {
            const val = settings.equalizerBands[idx] ?? 0;
            // Height proportion from -10 to +10 (total 20 steps, slider height 180)
            const fillHeight = ((val + 10) / 20) * 160;

            return (
              <View key={freq} style={styles.sliderCol}>
                <TouchableOpacity
                  onPress={() => handleBandAdjust(idx, 1)}
                  style={styles.adjustBtn}
                >
                  <Text style={styles.adjustBtnText}>▲</Text>
                </TouchableOpacity>

                <View style={styles.track}>
                  <View style={[styles.barFill, { height: fillHeight }]} />
                  <View
                    style={[
                      styles.thumb,
                      { bottom: Math.max(0, Math.min(150, fillHeight - 10)) },
                    ]}
                  />
                </View>

                <TouchableOpacity
                  onPress={() => handleBandAdjust(idx, -1)}
                  style={styles.adjustBtn}
                >
                  <Text style={styles.adjustBtnText}>▼</Text>
                </TouchableOpacity>

                <Text style={styles.valText}>
                  {val > 0 ? `+${val}` : `${val}`}dB
                </Text>
                <Text style={styles.freqText}>{freq}</Text>
              </View>
            );
          })}
        </View>

        {/* Reset Button */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleReset}
          style={styles.resetBtn}
        >
          <Text style={styles.resetBtnText}>Reset</Text>
        </TouchableOpacity>
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
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
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
  presetsRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: SPACING.md,
  },
  presetChip: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  presetChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  presetText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.xs + 1,
    fontWeight: '700',
  },
  presetTextActive: {
    color: '#FFFFFF',
  },
  slidersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xxl,
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sliderCol: {
    alignItems: 'center',
    gap: 6,
  },
  adjustBtn: {
    padding: 6,
  },
  adjustBtnText: {
    color: COLORS.primary,
    fontSize: 12,
  },
  track: {
    width: 6,
    height: 160,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative',
  },
  barFill: {
    width: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
  },
  thumb: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#D946EF',
    shadowColor: '#D946EF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  },
  valText: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: '700',
    marginTop: 4,
  },
  freqText: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '600',
  },
  resetBtn: {
    backgroundColor: COLORS.cardElevated,
    paddingVertical: 14,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    alignItems: 'center',
  },
  resetBtnText: {
    color: COLORS.text,
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
  },
});

export default EqualizerModal;
