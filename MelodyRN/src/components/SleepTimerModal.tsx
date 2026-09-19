import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { usePlayer } from '../context/PlayerContext';
import { COLORS, SPACING, RADIUS, FONTS } from '../constants/theme';

export const SleepTimerModal: React.FC = () => {
  const { isSleepTimerOpen, setSleepTimerOpen, setSleepTimer, settings } = usePlayer();
  const [selectedMinutes, setSelectedMinutes] = useState<number>(
    settings.sleepTimerMinutes > 0 ? settings.sleepTimerMinutes : 30
  );

  const timerOptions = [
    { label: '15 minutes', value: 15 },
    { label: '30 minutes', value: 30 },
    { label: '1 hour', value: 60 },
    { label: '2 hours', value: 120 },
    { label: 'Turn Off', value: 0 },
  ];

  const handleStart = () => {
    setSleepTimer(selectedMinutes);
    setSleepTimerOpen(false);
    if (selectedMinutes > 0) {
      Alert.alert('Sleep Timer Active', `Music will automatically stop in ${selectedMinutes} minutes.`);
    } else {
      Alert.alert('Sleep Timer Cancelled', 'Playback will continue continuously.');
    }
  };

  return (
    <Modal
      visible={isSleepTimerOpen}
      transparent
      animationType="slide"
      onRequestClose={() => setSleepTimerOpen(false)}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => setSleepTimerOpen(false)}
            style={styles.backBtn}
          >
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Sleep Timer</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Big Glowing Moon Icon matching Screen 15 */}
        <View style={styles.iconSection}>
          <View style={styles.moonGlowContainer}>
            <Text style={styles.moonEmoji}>🌙</Text>
          </View>
          <Text style={styles.subText}>Stop music after</Text>
        </View>

        {/* Radio Options List */}
        <View style={styles.optionsList}>
          {timerOptions.map(opt => {
            const isSelected = selectedMinutes === opt.value;
            return (
              <TouchableOpacity
                key={opt.label}
                activeOpacity={0.8}
                onPress={() => setSelectedMinutes(opt.value)}
                style={[styles.optionCard, isSelected && styles.optionCardSelected]}
              >
                <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                  {isSelected && <View style={styles.radioDot} />}
                </View>
                <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Start Timer Gradient Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleStart}
          style={styles.startBtnContainer}
        >
          <LinearGradient
            colors={['#6366F1', '#8B5CF6', '#D946EF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.startBtnGradient}
          >
            <Text style={styles.startBtnText}>
              {selectedMinutes === 0 ? 'Disable Timer' : 'Start Timer'}
            </Text>
          </LinearGradient>
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
  iconSection: {
    alignItems: 'center',
    marginVertical: SPACING.md,
  },
  moonGlowContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 20,
    elevation: 8,
    marginBottom: SPACING.md,
  },
  moonEmoji: {
    fontSize: 44,
  },
  subText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
  },
  optionsList: {
    gap: SPACING.sm,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingVertical: 14,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  optionCardSelected: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderColor: COLORS.primary,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.textMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  radioCircleSelected: {
    borderColor: COLORS.accent,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.accent,
  },
  optionLabel: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
  },
  optionLabelSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  startBtnContainer: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  startBtnGradient: {
    paddingVertical: 16,
    borderRadius: RADIUS.full,
    alignItems: 'center',
  },
  startBtnText: {
    color: '#FFFFFF',
    fontSize: FONTS.sizes.md,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});

export default SleepTimerModal;
