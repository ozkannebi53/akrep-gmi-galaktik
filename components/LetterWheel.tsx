import React, { useCallback, useRef, useState } from 'react';
import {
  Dimensions,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useColors } from '@/hooks/useColors';

interface Props {
  harfler: string[];
  onKelime: (kelime: string) => 'dogru' | 'bonus' | 'yanlis';
  disabled?: boolean;
}

const { width: SCREEN_W } = Dimensions.get('window');
const WHEEL_SIZE = Math.min(SCREEN_W * 0.78, 300);
const CENTER = WHEEL_SIZE / 2;
const WHEEL_RADIUS = WHEEL_SIZE * 0.34;
const LETTER_RADIUS = WHEEL_SIZE * 0.1;

export default function LetterWheel({ harfler, onKelime, disabled }: Props) {
  const colors = useColors();
  const [secili, setSecili] = useState<number[]>([]);
  const [aktifIndex, setAktifIndex] = useState<number | null>(null);
  const [sonucRenk, setSonucRenk] = useState<string | null>(null);
  const seciliRef = useRef<number[]>([]);

  const positions = harfler.map((_, i) => {
    const angle = (2 * Math.PI * i) / harfler.length - Math.PI / 2;
    return {
      x: CENTER + WHEEL_RADIUS * Math.cos(angle),
      y: CENTER + WHEEL_RADIUS * Math.sin(angle),
    };
  });

  const hitTest = useCallback(
    (x: number, y: number): number | null => {
      for (let i = 0; i < positions.length; i++) {
        const dx = x - positions[i].x;
        const dy = y - positions[i].y;
        if (Math.sqrt(dx * dx + dy * dy) < LETTER_RADIUS * 1.3) {
          return i;
        }
      }
      return null;
    },
    [positions]
  );

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled,
      onMoveShouldSetPanResponder: () => !disabled,
      onPanResponderGrant: (evt) => {
        if (disabled) return;
        setSonucRenk(null);
        const { locationX, locationY } = evt.nativeEvent;
        const hit = hitTest(locationX, locationY);
        if (hit !== null) {
          seciliRef.current = [hit];
          setSecili([hit]);
          setAktifIndex(hit);
        }
      },
      onPanResponderMove: (evt) => {
        if (disabled) return;
        const { locationX, locationY } = evt.nativeEvent;
        const hit = hitTest(locationX, locationY);
        setAktifIndex(hit);
        if (hit !== null && !seciliRef.current.includes(hit)) {
          seciliRef.current = [...seciliRef.current, hit];
          setSecili([...seciliRef.current]);
        }
      },
      onPanResponderRelease: () => {
        if (disabled) return;
        const kelime = seciliRef.current
          .map((i) => harfler[i])
          .join('');
        if (kelime.length >= 2) {
          const sonuc = onKelime(kelime);
          if (sonuc === 'dogru') setSonucRenk('#10B981');
          else if (sonuc === 'bonus') setSonucRenk('#F59E0B');
          else setSonucRenk('#EF4444');
          setTimeout(() => setSonucRenk(null), 600);
        }
        seciliRef.current = [];
        setSecili([]);
        setAktifIndex(null);
      },
      onPanResponderTerminate: () => {
        seciliRef.current = [];
        setSecili([]);
        setAktifIndex(null);
      },
    })
  ).current;

  const currentWord = secili.map((i) => harfler[i]).join('');

  const pilBg = sonucRenk
    ? sonucRenk
    : secili.length > 0
    ? colors.primary
    : 'rgba(30,27,75,0.7)';

  return (
    <View style={styles.outer} pointerEvents={disabled ? 'none' : 'auto'}>
      <View
        style={[
          styles.wordPill,
          { backgroundColor: pilBg, borderColor: pilBg === colors.primary ? colors.neonPurple : pilBg },
        ]}
      >
        <Text style={styles.wordPillText}>
          {currentWord.length > 0 ? currentWord : ' '}
        </Text>
      </View>

      <View
        style={[styles.wheel, { width: WHEEL_SIZE, height: WHEEL_SIZE }]}
        {...panResponder.panHandlers}
      >
        <View
          style={[
            styles.outerRing,
            {
              width: WHEEL_SIZE * 0.98,
              height: WHEEL_SIZE * 0.98,
              borderRadius: WHEEL_SIZE * 0.49,
              borderColor: 'rgba(139,92,246,0.25)',
              left: WHEEL_SIZE * 0.01,
              top: WHEEL_SIZE * 0.01,
            },
          ]}
        />
        <View
          style={[
            styles.innerRing,
            {
              width: WHEEL_RADIUS * 1.1,
              height: WHEEL_RADIUS * 1.1,
              borderRadius: WHEEL_RADIUS * 0.55,
              left: CENTER - WHEEL_RADIUS * 0.55,
              top: CENTER - WHEEL_RADIUS * 0.55,
              borderColor: 'rgba(139,92,246,0.2)',
            },
          ]}
        />

        {positions.map((pos, i) => {
          const isSelected = secili.includes(i);
          const isActive = aktifIndex === i;
          const orderIdx = secili.indexOf(i);

          return (
            <View
              key={i}
              style={[
                styles.letterCircle,
                {
                  left: pos.x - LETTER_RADIUS,
                  top: pos.y - LETTER_RADIUS,
                  width: LETTER_RADIUS * 2,
                  height: LETTER_RADIUS * 2,
                  borderRadius: LETTER_RADIUS,
                  backgroundColor: isSelected
                    ? colors.letterSelected
                    : isActive
                    ? 'rgba(192,132,252,0.25)'
                    : colors.letterBg,
                  borderColor: isSelected
                    ? colors.neonPurple
                    : isActive
                    ? colors.neonPurple
                    : colors.wheelBorder,
                  shadowColor: isSelected ? colors.neonPurple : 'transparent',
                  shadowOpacity: isSelected ? 0.9 : 0,
                  shadowRadius: isSelected ? 10 : 0,
                  elevation: isSelected ? 10 : 3,
                },
              ]}
            >
              <Text
                style={[
                  styles.letterText,
                  {
                    color: isSelected
                      ? '#FFFFFF'
                      : isActive
                      ? colors.neonPurple
                      : colors.neonPurple,
                  },
                ]}
              >
                {harfler[i]}
              </Text>
              {isSelected && orderIdx >= 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{orderIdx + 1}</Text>
                </View>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    alignItems: 'center',
  },
  wordPill: {
    paddingHorizontal: 36,
    paddingVertical: 9,
    borderRadius: 50,
    marginBottom: 8,
    borderWidth: 1.5,
    minWidth: 130,
    alignItems: 'center',
  },
  wordPillText: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    letterSpacing: 5,
  },
  wheel: {
    position: 'relative',
  },
  outerRing: {
    position: 'absolute',
    borderWidth: 1,
  },
  innerRing: {
    position: 'absolute',
    borderWidth: 1,
  },
  letterCircle: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    shadowOffset: { width: 0, height: 0 },
  },
  letterText: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
  },
  badge: {
    position: 'absolute',
    top: 1,
    right: 1,
    backgroundColor: '#F59E0B',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 10,
    color: '#000',
    fontFamily: 'Inter_700Bold',
  },
});
