import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';

interface Props {
  kelimeler: string[];
  bulunan: string[];
}

export default function WordGrid({ kelimeler, bulunan }: Props) {
  const colors = useColors();
  const sorted = [...kelimeler].sort((a, b) => a.length - b.length);

  return (
    <View style={styles.container}>
      {sorted.map((kelime, wi) => {
        const found = bulunan.includes(kelime);
        return (
          <View key={wi} style={styles.wordRow}>
            {kelime.split('').map((harf, li) => (
              <View
                key={li}
                style={[
                  styles.cell,
                  {
                    backgroundColor: found
                      ? 'rgba(16,185,129,0.3)'
                      : 'rgba(30, 27, 75, 0.6)',
                    borderColor: found
                      ? colors.success
                      : 'rgba(139, 92, 246, 0.4)',
                    shadowColor: found ? colors.success : 'transparent',
                    shadowOpacity: found ? 0.5 : 0,
                    shadowRadius: found ? 4 : 0,
                    elevation: found ? 3 : 0,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.cellText,
                    { color: found ? '#FFFFFF' : 'transparent' },
                  ]}
                >
                  {harf}
                </Text>
              </View>
            ))}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 6,
  },
  wordRow: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  cell: {
    width: 34,
    height: 34,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 0 },
  },
  cellText: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.5,
  },
});
