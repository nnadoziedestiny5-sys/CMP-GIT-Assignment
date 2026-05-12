import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabTwoScreen() {
  const scheme = useColorScheme();
  const accent = scheme === 'dark' ? '#A78BFA' : '#8B5CF6';

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#EDE9FE', dark: '#4C1D95' }}
      headerImage={
        <View style={styles.headerIconWrap} accessibilityRole="image">
          <Ionicons name="map-outline" size={100} color={accent} style={styles.headerIcon} />
        </View>
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Notes</ThemedText>
      </ThemedView>
      <ThemedText style={styles.body}>
        This is a customized version of the Expo starter app. I have updated the theme, 
        branding, and content to make it unique for this assignment.
      </ThemedText>
      <ThemedView style={styles.bulletRow}>
        <Ionicons name="checkmark-circle" size={20} color={accent} />
        <ThemedText>Tabs and routing unchanged — only content and theme accents.</ThemedText>
      </ThemedView>
      <ThemedView style={styles.bulletRow}>
        <Ionicons name="checkmark-circle" size={20} color={accent} />
        <ThemedText>Ready to connect your own GitHub remote and push when your lecturer allows.</ThemedText>
      </ThemedView>
      <ExternalLink href="https://docs.expo.dev/">
        <ThemedText type="link">Expo documentation</ThemedText>
      </ExternalLink>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerIconWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  headerIcon: {
    opacity: 0.95,
  },
  titleContainer: {
    marginBottom: 12,
  },
  body: {
    marginBottom: 16,
    lineHeight: 22,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 10,
  },
});
