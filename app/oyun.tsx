import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useGame } from '@/context/GameContext';
import LetterWheel from '@/components/LetterWheel';
import WordGrid from '@/components/WordGrid';

const { width: W } = Dimensions.get('window');

function formatTimer(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec < 10 ? '0' : ''}${sec}`;
}

function TimerArc({ timer, maxTimer }: { timer: number; maxTimer: number }) {
  const pct = timer / maxTimer;
  const color = pct > 0.5 ? '#10B981' : pct > 0.25 ? '#F59E0B' : '#EF4444';
  return (
    <View style={styles.timerContainer}>
      <View style={[styles.timerRing, { borderColor: color + '44' }]}>
        <View style={[styles.timerFill, { borderColor: color }]} />
        <Text style={[styles.timerText, { color }]}>{formatTimer(timer)}</Text>
      </View>
    </View>
  );
}

function ActionBtn({
  icon,
  label,
  onPress,
  accent,
  badge,
}: {
  icon: string;
  label: string;
  onPress: () => void;
  accent?: string;
  badge?: number;
}) {
  return (
    <TouchableOpacity style={styles.actionBtn} onPress={onPress} activeOpacity={0.75}>
      {badge ? (
        <View style={styles.actionBadge}>
          <Text style={styles.actionBadgeText}>{badge}</Text>
        </View>
      ) : null}
      <Feather name={icon as any} size={18} color={accent ?? '#C084FC'} />
      <Text style={[styles.actionLabel, { color: accent ?? '#C084FC' }]}>{label}</Text>
    </TouchableOpacity>
  );
}

function MesajOverlay({ mesaj }: { mesaj: string }) {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    fadeAnim.setValue(1);
    Animated.sequence([
      Animated.delay(300),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();
  }, [mesaj]);

  if (!mesaj) return null;
  const color = mesaj.includes('BONUS')
    ? '#F59E0B'
    : '#10B981';

  return (
    <Animated.View
      style={[styles.mesajOverlay, { opacity: fadeAnim }]}
      pointerEvents="none"
    >
      <Text style={[styles.mesajText, { color }]}>{mesaj}</Text>
    </Animated.View>
  );
}

export default function OyunScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const {
    currentPuzzle,
    bulunanKelimeler,
    bonusBulunan,
    timer,
    timerActive,
    oyunBitti,
    kazandi,
    playerStats,
    sonMesaj,
    kelimeBulundu,
    timeriBaslat,
    sonrakiBolum,
    resetOyun,
  } = useGame();

  const [harfler, setHarfler] = useState<string[]>(currentPuzzle.harfler);
  const [localMesaj, setLocalMesaj] = useState('');
  const mesajKey = useRef(0);

  useEffect(() => {
    setHarfler(currentPuzzle.harfler);
    timeriBaslat();
  }, [currentPuzzle]);

  useEffect(() => {
    if (sonMesaj) {
      mesajKey.current++;
      setLocalMesaj(sonMesaj);
    }
  }, [sonMesaj]);

  const handleKelime = (kelime: string): 'dogru' | 'bonus' | 'yanlis' => {
    const sonuc = kelimeBulundu(kelime);
    if (sonuc === 'dogru') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else if (sonuc === 'bonus') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
    return sonuc;
  };

  const kariştir = () => {
    setHarfler((prev) => [...prev].sort(() => Math.random() - 0.5));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const fmt = (n: number) => n.toLocaleString('tr-TR');
  const tamamlananPct = bulunanKelimeler.length / currentPuzzle.kelimeler.length;

  return (
    <View style={[styles.root, { backgroundColor: '#07001A' }]}>
      {/* Stars bg */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {Array.from({ length: 35 }).map((_, i) => (
          <View
            key={i}
            style={{
              position: 'absolute',
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              borderRadius: 2,
              backgroundColor: '#fff',
              opacity: Math.random() * 0.5 + 0.15,
              left: `${(i * 7.3 + 3) % 100}%`,
              top: `${(i * 13.7 + 5) % 100}%`,
            }}
          />
        ))}
      </View>

      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 4 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="chevron-left" size={22} color="#C084FC" />
        </TouchableOpacity>
        <Text style={styles.bolumTitle}>BÖLÜM {currentPuzzle.bolum}</Text>
        <View style={styles.headerRight}>
          <View style={styles.currencyRow}>
            <MaterialCommunityIcons name="circle" size={13} color="#F59E0B" />
            <Text style={styles.currencyVal}>{fmt(playerStats.altin)}</Text>
          </View>
          <TouchableOpacity style={styles.settingsBtn}>
            <Feather name="settings" size={18} color="#8B5CF6" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
      >
        {/* Word grid + timer row */}
        <View style={styles.topSection}>
          {/* Left: İpucu + Bonus */}
          <View style={styles.leftBar}>
            <TouchableOpacity style={styles.ipucuBtn}>
              <Feather name="lightbulb" size={18} color="#F59E0B" />
              <Text style={styles.ipucuStar}>100</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.bonusBtn, bonusBulunan.length > 0 && { borderColor: '#F59E0B' }]}
            >
              <Feather name="mail" size={14} color={bonusBulunan.length > 0 ? '#F59E0B' : '#6B7280'} />
              {bonusBulunan.length > 0 ? (
                <View style={styles.bonusBadge}>
                  <Text style={styles.bonusBadgeText}>{bonusBulunan.length}</Text>
                </View>
              ) : null}
              <Text style={styles.bonusLabel}>BONUS{'\n'}KELİME</Text>
            </TouchableOpacity>
          </View>

          {/* Center: Word Grid */}
          <View style={styles.wordGridArea}>
            <WordGrid
              kelimeler={currentPuzzle.kelimeler}
              bulunan={bulunanKelimeler}
            />
          </View>

          {/* Right: Star + Actions */}
          <View style={styles.rightBar}>
            <View style={styles.starRow}>
              <MaterialCommunityIcons name="star" size={14} color="#F59E0B" />
              <Text style={styles.starCount}>{bulunanKelimeler.length * 5}</Text>
            </View>
            <ActionBtn icon="shuffle" label="KARİŞTİR" onPress={kariştir} />
            <ActionBtn icon="rotate-ccw" label="GERİ AL" onPress={() => {}} />
            <ActionBtn icon="gift" label="GÜNLÜK\nÖDÜL" onPress={() => {}} accent="#F59E0B" badge={1} />
          </View>
        </View>

        {/* Progress bar */}
        <View style={styles.progressRow}>
          <View style={styles.progressBg}>
            <Animated.View
              style={[
                styles.progressFill,
                { width: `${tamamlananPct * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.progressLabel}>
            {bulunanKelimeler.length}/{currentPuzzle.kelimeler.length}
          </Text>
        </View>

        {/* Floating mesaj */}
        <View style={styles.mesajContainer} pointerEvents="none">
          <MesajOverlay key={mesajKey.current} mesaj={localMesaj} />
        </View>

        {/* Timer */}
        <TimerArc timer={timer} maxTimer={currentPuzzle.sureDk} />

        {/* Letter Wheel */}
        <LetterWheel
          harfler={harfler}
          onKelime={handleKelime}
          disabled={oyunBitti}
        />
      </ScrollView>

      {/* Win / Lose overlay */}
      {oyunBitti && (
        <View style={styles.overlay}>
          <View style={styles.overlayCard}>
            {kazandi ? (
              <>
                <View style={styles.starsRow}>
                  {[0, 1, 2].map((s) => (
                    <MaterialCommunityIcons
                      key={s}
                      name="star"
                      size={36}
                      color="#F59E0B"
                    />
                  ))}
                </View>
                <Text style={styles.overlayTitle}>TEBRİKLER!</Text>
                <Text style={styles.overlaySub}>Bölümü tamamladın!</Text>
                <View style={styles.rewardRow}>
                  <View style={styles.reward}>
                    <MaterialCommunityIcons name="circle" size={18} color="#F59E0B" />
                    <Text style={styles.rewardVal}>+300</Text>
                  </View>
                  <View style={styles.reward}>
                    <MaterialCommunityIcons name="diamond-stone" size={18} color="#60A5FA" />
                    <Text style={styles.rewardVal}>+5</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={[styles.overlayBtn, { backgroundColor: '#059669' }]}
                  onPress={sonrakiBolum}
                >
                  <Text style={styles.overlayBtnText}>SONRAKI BÖLÜM</Text>
                  <Feather name="arrow-right" size={16} color="#FFF" />
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={styles.loseIcon}>
                  <MaterialCommunityIcons name="timer-off" size={42} color="#EF4444" />
                </View>
                <Text style={[styles.overlayTitle, { color: '#EF4444' }]}>SÜRE DOLDU!</Text>
                <Text style={styles.overlaySub}>
                  {bulunanKelimeler.length}/{currentPuzzle.kelimeler.length} kelime buldun
                </Text>
                <View style={styles.loseActions}>
                  <TouchableOpacity
                    style={[styles.overlayBtn, { backgroundColor: '#8B5CF6', flex: 1 }]}
                    onPress={resetOyun}
                  >
                    <Feather name="rotate-ccw" size={15} color="#FFF" />
                    <Text style={styles.overlayBtnText}>TEKRAR DENE</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.overlayBtn, { backgroundColor: '#1E1B4B', flex: 1 }]}
                    onPress={() => router.back()}
                  >
                    <Feather name="home" size={15} color="#C084FC" />
                    <Text style={[styles.overlayBtnText, { color: '#C084FC' }]}>ANA MENÜ</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 4,
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(139,92,246,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bolumTitle: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 3,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  currencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(245,158,11,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F59E0B40',
  },
  currencyVal: {
    color: '#F59E0B',
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
  },
  settingsBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(139,92,246,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 20,
    alignItems: 'center',
  },
  topSection: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 8,
    paddingVertical: 8,
    gap: 6,
  },
  leftBar: {
    width: 52,
    alignItems: 'center',
    gap: 10,
    paddingTop: 4,
  },
  ipucuBtn: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: 'rgba(245,158,11,0.12)',
    borderWidth: 1,
    borderColor: '#F59E0B40',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ipucuStar: {
    color: '#F59E0B',
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    marginTop: 1,
  },
  bonusBtn: {
    width: 46,
    padding: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(30,27,75,0.6)',
    borderWidth: 1,
    borderColor: '#2D1B69',
    alignItems: 'center',
    position: 'relative',
  },
  bonusBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#EF4444',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bonusBadgeText: {
    color: '#FFF',
    fontSize: 9,
    fontFamily: 'Inter_700Bold',
  },
  bonusLabel: {
    color: '#6B7280',
    fontSize: 8,
    fontFamily: 'Inter_500Medium',
    textAlign: 'center',
    marginTop: 3,
  },
  wordGridArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightBar: {
    width: 52,
    alignItems: 'center',
    gap: 10,
    paddingTop: 4,
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  starCount: {
    color: '#F59E0B',
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
  },
  actionBtn: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: 'rgba(30,27,75,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  actionLabel: {
    fontSize: 7,
    fontFamily: 'Inter_500Medium',
    textAlign: 'center',
    marginTop: 1,
  },
  actionBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    width: 15,
    height: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  actionBadgeText: {
    color: '#FFF',
    fontSize: 8,
    fontFamily: 'Inter_700Bold',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
    width: '100%',
    marginBottom: 4,
  },
  progressBg: {
    flex: 1,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(139,92,246,0.15)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: '#8B5CF6',
  },
  progressLabel: {
    color: '#9CA3AF',
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
  },
  mesajContainer: {
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mesajOverlay: {
    alignItems: 'center',
  },
  mesajText: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 2,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 6,
  },
  timerRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerFill: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
  },
  timerText: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  overlayCard: {
    width: W * 0.82,
    backgroundColor: '#0D0025',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(139,92,246,0.4)',
    padding: 28,
    alignItems: 'center',
    gap: 12,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  loseIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(239,68,68,0.15)',
    borderWidth: 2,
    borderColor: '#EF444440',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayTitle: {
    color: '#F59E0B',
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 3,
    textAlign: 'center',
  },
  overlaySub: {
    color: '#9CA3AF',
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
  },
  rewardRow: {
    flexDirection: 'row',
    gap: 16,
    marginVertical: 4,
  },
  reward: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(245,158,11,0.1)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F59E0B30',
  },
  rewardVal: {
    color: '#F59E0B',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
  overlayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 12,
    width: '100%',
  },
  overlayBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 1,
  },
  loseActions: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
});
