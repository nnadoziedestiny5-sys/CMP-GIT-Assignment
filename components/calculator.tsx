import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, useWindowDimensions, Platform } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function Calculator() {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  
  const { width } = useWindowDimensions();
  // Max width of 500 for web/tablets to keep calculator proportions intact but allow a wider display
  const calcWidth = Math.min(width, 500); 
  const BUTTON_WIDTH = (calcWidth - 60) / 4;

  const handlePress = (value: string) => {
    if (value === 'AC') {
      setDisplay('0');
      setEquation('');
      return;
    }

    if (value === 'C') {
      if (display.length === 1 || display === 'Error') {
        setDisplay('0');
      } else {
        setDisplay(display.slice(0, -1));
      }
      return;
    }

    if (value === '=') {
      try {
        // Safe evaluation simulation for the assignment
        // Using Function instead of eval for slightly better safety, but still simplistic
        const result = new Function('return ' + equation + display)();
        
        // Handle floating point precision issues (e.g. 0.1 + 0.2)
        const finalResult = Math.round(result * 100000000) / 100000000;
        
        setDisplay(String(finalResult));
        setEquation('');
      } catch (e) {
        setDisplay('Error');
      }
      return;
    }

    if (['+', '-', '*', '/'].includes(value)) {
      setEquation(display + ' ' + value + ' ');
      setDisplay('0');
      return;
    }

    if (value === '.') {
      if (!display.includes('.')) {
        setDisplay(display + '.');
      }
      return;
    }

    if (display === '0') {
      setDisplay(value);
    } else {
      setDisplay(display + value);
    }
  };

  const renderButton = (label: string, type: 'num' | 'op' | 'spec' = 'num') => {
    let bgColor = colorScheme === 'dark' ? '#2A2A2D' : '#F2F2F2';
    let textColor = theme.text;

    if (type === 'op') {
      bgColor = theme.tint;
      textColor = '#fff';
    } else if (type === 'spec') {
      bgColor = colorScheme === 'dark' ? '#4A4A4D' : '#D4D4D2';
      textColor = colorScheme === 'dark' ? '#fff' : '#000';
    }

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        style={[
          styles.button,
          { 
            backgroundColor: bgColor,
            width: BUTTON_WIDTH,
            height: BUTTON_WIDTH,
            borderRadius: BUTTON_WIDTH / 2,
          }
        ]}
        onPress={() => handlePress(label)}>
        <ThemedText style={[styles.buttonText, { color: textColor }]}>{label}</ThemedText>
      </TouchableOpacity>
    );
  };

  return (
    <ThemedView style={styles.wrapper}>
      <View style={[styles.container, { width: calcWidth }]}>
        <View style={styles.displayContainer}>
          <ThemedText style={styles.equationText} numberOfLines={1}>{equation}</ThemedText>
          <ThemedText 
            style={[
              styles.displayText, 
              { 
                fontSize: display.length > 7 ? 50 : 70,
                lineHeight: display.length > 7 ? 60 : 80,
              }
            ]} 
            numberOfLines={1} 
            adjustsFontSizeToFit={Platform.OS !== 'web'}>
            {display}
          </ThemedText>
        </View>

        <View style={styles.buttonsContainer}>
          <View style={styles.row}>
            {renderButton('AC', 'spec')}
            {renderButton('C', 'spec')}
            {renderButton('%', 'spec')}
            {renderButton('/', 'op')}
          </View>
          <View style={styles.row}>
            {renderButton('7')}
            {renderButton('8')}
            {renderButton('9')}
            {renderButton('*', 'op')}
          </View>
          <View style={styles.row}>
            {renderButton('4')}
            {renderButton('5')}
            {renderButton('6')}
            {renderButton('-', 'op')}
          </View>
          <View style={styles.row}>
            {renderButton('1')}
            {renderButton('2')}
            {renderButton('3')}
            {renderButton('+', 'op')}
          </View>
          <View style={styles.row}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={[
                styles.button, 
                { 
                  backgroundColor: colorScheme === 'dark' ? '#2A2A2D' : '#F2F2F2',
                  width: BUTTON_WIDTH * 2 + 12, // 12 is the gap
                  height: BUTTON_WIDTH,
                  borderRadius: BUTTON_WIDTH / 2,
                  alignItems: 'flex-start',
                  paddingLeft: BUTTON_WIDTH / 2 - 10,
                }
              ]}
              onPress={() => handlePress('0')}>
              <ThemedText style={[styles.buttonText, { color: theme.text }]}>0</ThemedText>
            </TouchableOpacity>
            {renderButton('.')}
            {renderButton('=', 'op')}
          </View>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: Platform.OS === 'web' ? 'center' : 'flex-end',
  },
  container: {
    padding: 20,
    paddingBottom: Platform.OS === 'web' ? 40 : 20,
    backgroundColor: 'transparent',
  },
  displayContainer: {
    padding: 20,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    minHeight: 180,
    marginBottom: 20,
    width: '100%',
  },
  equationText: {
    fontSize: 28,
    lineHeight: 32,
    opacity: 0.5,
    marginBottom: 10,
    minHeight: 35,
  },
  displayText: {
    fontWeight: '300',
  },
  buttonsContainer: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        cursor: 'pointer',
      }
    }),
  },
  buttonText: {
    fontSize: 32,
    fontWeight: '500',
  },
});

