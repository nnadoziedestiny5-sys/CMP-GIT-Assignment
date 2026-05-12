import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ModalScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Samuel&apos;s build</ThemedText>
      <ThemedText style={styles.blurb}>
        Custom home + Notes tab, indigo accent theme, and Expo config renamed for Git Assignment 2.0.
      </ThemedText>
      <Link href="/" dismissTo style={styles.link}>
        <ThemedText type="link">Back to dashboard</ThemedText>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  blurb: {
    marginTop: 12,
    textAlign: 'center',
    paddingHorizontal: 8,
    opacity: 0.9,
  },
  link: {
    marginTop: 20,
    paddingVertical: 15,
  },
});
