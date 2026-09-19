import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import { usePlayer } from '../context/PlayerContext';
import { COLORS, SPACING, RADIUS, FONTS } from '../constants/theme';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = Math.min(width * 0.78, 300);

export const DrawerMenu: React.FC = () => {
  const { isDrawerOpen, setDrawerOpen, setCurrentView, currentView } = usePlayer();

  const menuItems = [
    { key: 'home', label: 'Home', icon: '🏠' },
    { key: 'songs', label: 'Songs', icon: '♫' },
    { key: 'albums', label: 'Albums', icon: '💽' },
    { key: 'artists', label: 'Artists', icon: '👤' },
    { key: 'playlists', label: 'Playlists', icon: '📋' },
    { key: 'favorites', label: 'Favourites', icon: '♥' },
    { key: 'recent', label: 'Recently Played', icon: '🕒' },
    { key: 'settings', label: 'Settings', icon: '⚙' },
  ] as const;

  const handleSelect = (key: typeof menuItems[number]['key']) => {
    setDrawerOpen(false);
    if (key === 'favorites' || key === 'recent') {
      setCurrentView('songs');
    } else {
      setCurrentView(key as any);
    }
  };

  return (
    <Modal
      visible={isDrawerOpen}
      transparent
      animationType="fade"
      onRequestClose={() => setDrawerOpen(false)}
    >
      <View style={styles.backdrop}>
        <TouchableWithoutFeedback onPress={() => setDrawerOpen(false)}>
          <View style={styles.dismissArea} />
        </TouchableWithoutFeedback>

        <View style={styles.drawerContent}>
          {/* User Profile Header */}
          <View style={styles.profileSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>👤</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>Music Lover</Text>
              <View style={styles.offlineBadge}>
                <View style={styles.offlineDot} />
                <Text style={styles.offlineText}>Offline Mode</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Navigation Items */}
          <View style={styles.itemsList}>
            {menuItems.map(item => {
              const isActive = currentView === item.key;
              return (
                <TouchableOpacity
                  key={item.key}
                  activeOpacity={0.7}
                  onPress={() => handleSelect(item.key)}
                  style={[styles.menuItem, isActive && styles.activeMenuItem]}
                >
                  <Text style={[styles.menuIcon, isActive && styles.activeMenuText]}>
                    {item.icon}
                  </Text>
                  <Text style={[styles.menuLabel, isActive && styles.activeMenuText]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Bottom Storage Bar */}
          <View style={styles.storageSection}>
            <View style={styles.storageHeader}>
              <Text style={styles.storageLabel}>Storage Used</Text>
              <Text style={styles.storageValue}>82.0 MB • 15 Songs Bundled</Text>
            </View>
            <View style={styles.storageTrack}>
              <View style={[styles.storageBar, { width: '100%' }]} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(5, 7, 13, 0.75)',
    flexDirection: 'row',
  },
  dismissArea: {
    flex: 1,
  },
  drawerContent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: COLORS.cardElevated,
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: SPACING.lg,
    borderRightWidth: 1,
    borderRightColor: COLORS.cardBorder,
    justifyContent: 'space-between',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  avatarText: {
    fontSize: 24,
  },
  profileInfo: {
    justifyContent: 'center',
  },
  userName: {
    color: '#FFFFFF',
    fontSize: FONTS.sizes.lg,
    fontWeight: '800',
  },
  offlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 3,
  },
  offlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.accent,
  },
  offlineText: {
    color: COLORS.accent,
    fontSize: 11,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  itemsList: {
    flex: 1,
    gap: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: RADIUS.md,
  },
  activeMenuItem: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  menuIcon: {
    fontSize: 18,
    marginRight: 14,
    color: COLORS.textSecondary,
    width: 24,
    textAlign: 'center',
  },
  menuLabel: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
  },
  activeMenuText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  storageSection: {
    backgroundColor: COLORS.card,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  storageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  storageLabel: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  storageValue: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: '700',
  },
  storageTrack: {
    height: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  storageBar: {
    width: '22%',
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
});

export default DrawerMenu;
