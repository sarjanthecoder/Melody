import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import { usePlayer } from '../context/PlayerContext';
import { COLORS, SPACING, RADIUS, FONTS } from '../constants/theme';
import { AppThemeType } from '../types/music';

interface ThemeSelectModalProps {
  visible: boolean;
  onClose: () => void;
}

export const ThemeSelectModal: React.FC<ThemeSelectModalProps> = ({ visible, onClose }) => {
  const { settings, updateSettings } = usePlayer();

  const themes: { name: AppThemeType; previewColors: [string, string] }[] = [
    { name: 'Dark (Default)', previewColors: ['#05070D', '#8B5CF6'] },
    { name: 'Ocean Blue', previewColors: ['#04152D', '#0EA5E9'] },
    { name: 'Sunset', previewColors: ['#200B1A', '#F59E0B'] },
    { name: 'Forest', previewColors: ['#061A14', '#10B981'] },
    { name: 'Minimal', previewColors: ['#121212', '#FFFFFF'] },
    { name: 'Purple', previewColors: ['#1A0B2E', '#D946EF'] },
    { name: 'Neon', previewColors: ['#020208', '#38BDF8'] },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backBtn}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Choose Theme</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.list}>
          {themes.map(t => {
            const isSelected = settings.theme === t.name;
            return (
              <TouchableOpacity
                key={t.name}
                activeOpacity={0.8}
                onPress={() => {
                  updateSettings({ theme: t.name });
                  onClose();
                }}
                style={[styles.themeRow, isSelected && styles.themeRowSelected]}
              >
                <View style={styles.leftInfo}>
                  <View style={[styles.previewDot, { backgroundColor: t.previewColors[1] }]} />
                  <Text style={[styles.themeName, isSelected && styles.themeNameSelected]}>
                    {t.name}
                  </Text>
                </View>
                {isSelected && <Text style={styles.checkIcon}>✓</Text>}
              </TouchableOpacity>
            );
          })}
        </View>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
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
  list: {
    gap: SPACING.sm,
  },
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    paddingVertical: 14,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  themeRowSelected: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(139, 92, 246, 0.12)',
  },
  leftInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  previewDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  themeName: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
  },
  themeNameSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  checkIcon: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: '900',
  },
});

export default ThemeSelectModal;
