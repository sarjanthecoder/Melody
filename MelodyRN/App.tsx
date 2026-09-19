import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PlayerProvider, usePlayer } from './src/context/PlayerContext';
import HomeScreen from './src/screens/HomeScreen';
import SongsScreen from './src/screens/SongsScreen';
import AlbumsScreen from './src/screens/AlbumsScreen';
import ArtistsScreen from './src/screens/ArtistsScreen';
import PlaylistsScreen from './src/screens/PlaylistsScreen';
import SearchScreen from './src/screens/SearchScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import NowPlayingScreen from './src/screens/NowPlayingScreen';
import MiniPlayer from './src/components/MiniPlayer';
import DrawerMenu from './src/components/DrawerMenu';
import SplashScreen from './src/components/SplashScreen';
import { COLORS, FONTS, RADIUS, SPACING } from './src/constants/theme';

const MainNavigator: React.FC = () => {
  const { currentView, setCurrentView, isNowPlayingOpen, closeNowPlaying } = usePlayer();
  const [showSplash, setShowSplash] = React.useState(true);

  const renderActiveScreen = () => {
    switch (currentView) {
      case 'songs':
        return <SongsScreen />;
      case 'albums':
        return <AlbumsScreen />;
      case 'artists':
        return <ArtistsScreen />;
      case 'playlists':
        return <PlaylistsScreen />;
      case 'search':
        return <SearchScreen />;
      case 'settings':
        return <SettingsScreen />;
      case 'home':
      default:
        return <HomeScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      {/* Main View Area */}
      <View style={styles.screenContainer}>{renderActiveScreen()}</View>

      {/* Initial Masss Splash Screen Animation */}
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      {/* Floating MiniPlayer */}
      <MiniPlayer />

      {/* 4 Bottom Tabs matching Reference (Home, Search, Library, More) */}
      <View style={styles.bottomNav}>
        {/* Home */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setCurrentView('home')}
          style={styles.navItem}
        >
          <Text style={[styles.navIcon, currentView === 'home' && styles.activeNavIcon]}>
            🏠
          </Text>
          <Text style={[styles.navLabel, currentView === 'home' && styles.activeNavLabel]}>
            Home
          </Text>
          {currentView === 'home' && <View style={styles.activeTabGlow} />}
        </TouchableOpacity>

        {/* Search */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setCurrentView('search')}
          style={styles.navItem}
        >
          <Text style={[styles.navIcon, currentView === 'search' && styles.activeNavIcon]}>
            🔍
          </Text>
          <Text style={[styles.navLabel, currentView === 'search' && styles.activeNavLabel]}>
            Search
          </Text>
          {currentView === 'search' && <View style={styles.activeTabGlow} />}
        </TouchableOpacity>

        {/* Library (Songs) */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setCurrentView('songs')}
          style={styles.navItem}
        >
          <Text
            style={[
              styles.navIcon,
              (currentView === 'songs' || currentView === 'albums' || currentView === 'artists' || currentView === 'playlists') &&
                styles.activeNavIcon,
            ]}
          >
            📚
          </Text>
          <Text
            style={[
              styles.navLabel,
              (currentView === 'songs' || currentView === 'albums' || currentView === 'artists' || currentView === 'playlists') &&
                styles.activeNavLabel,
            ]}
          >
            Library
          </Text>
          {(currentView === 'songs' || currentView === 'albums' || currentView === 'artists' || currentView === 'playlists') && (
            <View style={styles.activeTabGlow} />
          )}
        </TouchableOpacity>

        {/* More / Settings */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setCurrentView('settings')}
          style={styles.navItem}
        >
          <Text style={[styles.navIcon, currentView === 'settings' && styles.activeNavIcon]}>
            ⋯
          </Text>
          <Text style={[styles.navLabel, currentView === 'settings' && styles.activeNavLabel]}>
            More
          </Text>
          {currentView === 'settings' && <View style={styles.activeTabGlow} />}
        </TouchableOpacity>
      </View>

      {/* Side Drawer Menu */}
      <DrawerMenu />

      {/* Full Screen Now Playing Modal */}
      <Modal
        visible={isNowPlayingOpen}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={closeNowPlaying}
      >
        <SafeAreaView style={styles.modalSafeArea}>
          <StatusBar barStyle="light-content" />
          <NowPlayingScreen />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <PlayerProvider>
        <MainNavigator />
      </PlayerProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  modalSafeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  screenContainer: {
    flex: 1,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardElevated,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingVertical: SPACING.sm,
    paddingBottom: SPACING.md,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 4,
    position: 'relative',
  },
  navIcon: {
    color: COLORS.textMuted,
    fontSize: 18,
  },
  activeNavIcon: {
    color: COLORS.primary,
    textShadowColor: COLORS.glow,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  navLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  activeNavLabel: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  activeTabGlow: {
    position: 'absolute',
    bottom: -6,
    width: 20,
    height: 3,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
  },
});
