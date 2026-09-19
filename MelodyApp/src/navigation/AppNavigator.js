import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, StyleSheet } from 'react-native';

import { PlayerProvider } from '../context/PlayerContext';
import HomeScreen from '../screens/HomeScreen';
import NowPlayingScreen from '../screens/NowPlayingScreen';
import SettingsScreen from '../screens/SettingsScreen';
import MiniPlayer from '../components/MiniPlayer';
import { COLORS } from '../constants/theme';

const Stack = createStackNavigator();

function MainStack() {
  return (
    <View style={styles.container}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: COLORS.background },
          presentation: 'card',
          animationEnabled: true,
          cardStyleInterpolator: ({ current }) => ({
            cardStyle: { opacity: current.progress },
          }),
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="NowPlaying"
          component={NowPlayingScreen}
          options={{
            presentation: 'modal',
            cardStyleInterpolator: ({ current, layouts }) => ({
              cardStyle: {
                transform: [
                  {
                    translateY: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.height, 0],
                    }),
                  },
                ],
              },
            }),
          }}
        />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
      <MiniPlayer />
    </View>
  );
}

export default function AppNavigator() {
  return (
    <PlayerProvider>
      <NavigationContainer>
        <MainStack />
      </NavigationContainer>
    </PlayerProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
});
