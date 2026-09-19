import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  Dimensions,
  Easing,
} from 'react-native';
import { COLORS } from '../constants/theme';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(0.4)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseRing1 = useRef(new Animated.Value(0.7)).current;
  const pulseRing2 = useRef(new Animated.Value(0.7)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const [statusText, setStatusText] = useState('Initializing Masss Audio Engine...');

  useEffect(() => {
    // Logo bounce in
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 900,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 900,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    // Pulsing rings
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseRing1, {
          toValue: 1.4,
          duration: 1400,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseRing1, {
          toValue: 0.8,
          duration: 1400,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseRing2, {
          toValue: 1.6,
          duration: 1800,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseRing2, {
          toValue: 0.8,
          duration: 1800,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Progress bar
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 2200,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    const t1 = setTimeout(() => setStatusText('Bundling 15 Tamil Offline Hits...'), 600);
    const t2 = setTimeout(() => setStatusText('Syncing YouTube Online Streaming...'), 1300);
    const t3 = setTimeout(() => setStatusText('Sarjan Masss Vibes Ready ⚡'), 2000);

    const endTimer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.12,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(() => {
        onFinish();
      });
    }, 2600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(endTimer);
    };
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-15deg', '0deg'],
  });

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Background Neon Glow Circles */}
      <Animated.View
        style={[
          styles.pulseRing,
          styles.ring1,
          { transform: [{ scale: pulseRing1 }] },
        ]}
      />
      <Animated.View
        style={[
          styles.pulseRing,
          styles.ring2,
          { transform: [{ scale: pulseRing2 }] },
        ]}
      />

      {/* Central Circle Cropped Logo */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            transform: [{ scale: scaleAnim }, { rotate: spin }],
          },
        ]}
      >
        <View style={styles.logoBorder}>
          <Image
            source={require('../assets/logo.png')}
            style={styles.logoImage}
            resizeMode="cover"
          />
        </View>
      </Animated.View>

      {/* Equalizer Frequency Bars */}
      <View style={styles.eqContainer}>
        {[14, 24, 18, 28, 20, 26, 16, 22, 12].map((h, i) => (
          <View
            key={i}
            style={[
              styles.eqBar,
              { height: h, opacity: 0.7 + (i % 3) * 0.15 },
            ]}
          />
        ))}
      </View>

      {/* App Brand Name */}
      <Text style={styles.brandTitle}>MELODY</Text>
      <Text style={styles.brandSub}>MUSIC LIVES WITH YOU</Text>

      {/* Sarjan Signature Masss Badge */}
      <View style={styles.masssBadge}>
        <Text style={styles.masssText}>⚡ MASSS EDITION • CRAFTED BY SARJAN ⚡</Text>
      </View>

      {/* Loading Bar */}
      <View style={styles.loaderContainer}>
        <View style={styles.track}>
          <Animated.View style={[styles.fill, { width: progressWidth }]} />
        </View>
        <Text style={styles.statusText}>{statusText}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width,
    height,
    backgroundColor: '#05070D',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99999,
  },
  pulseRing: {
    position: 'absolute',
    borderRadius: 200,
    borderWidth: 2,
  },
  ring1: {
    width: 220,
    height: 220,
    borderColor: 'rgba(14, 165, 233, 0.45)',
  },
  ring2: {
    width: 280,
    height: 280,
    borderColor: 'rgba(217, 70, 239, 0.35)',
  },
  logoContainer: {
    width: 140,
    height: 140,
    marginBottom: 20,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.85,
    shadowRadius: 25,
    elevation: 20,
  },
  logoBorder: {
    width: '100%',
    height: '100%',
    borderRadius: 70,
    borderWidth: 3,
    borderColor: '#D946EF',
    overflow: 'hidden',
    backgroundColor: '#0D1220',
  },
  logoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 70,
  },
  eqContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 30,
    marginBottom: 16,
    gap: 5,
  },
  eqBar: {
    width: 4,
    borderRadius: 2,
    backgroundColor: '#8B5CF6',
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 5,
    color: '#FFFFFF',
    textShadowColor: 'rgba(139, 92, 246, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  brandSub: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 3,
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 4,
    marginBottom: 20,
  },
  masssBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(217, 70, 239, 0.6)',
    marginBottom: 32,
  },
  masssText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: '#FFFFFF',
  },
  loaderContainer: {
    width: 200,
    alignItems: 'center',
  },
  track: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 2,
  },
  statusText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 10,
    fontWeight: '600',
  },
});

export default SplashScreen;
