import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';

const { width: W } = Dimensions.get('window');
const CARD_W = (W - 48) / 3;

const AKREPLER = [
  { isim: 'Kum Akrebi', renk: '#B45309', unlocked: true },
  { isim: 'Ateş Akrebi', renk: '#DC2626', unlocked: true },
  { isim: 'Elektrik Akrebi', renk: '#2563EB', unlocked: true },
  { isim: 'Nebula Akrebi', renk: '#7C3AED', unlocked: false },
  { isim: 'Kara Delik Akrebi', renk: '#1F2937', unlocked: false },
  { isim: 'Kozmik Kral', renk: '#F59E0B', unlocked: false },
  { isim: 'Buz Akrebi', renk: '#06B6D4', unlocked: false },
  { isim: 'Kristal Akrebi', renk: '#A78BFA', unlocked: false },
  { isim: 'Galaktik Akrebi', renk: '#C084FC', unlocked: false },
];

const EVRIMLER = [
  { isim: 'Aşama I', aciklama: 'Başlangıç formu', seviye: 1, unlocked: true },
  { isim: 'Aşama II', aciklama: 'Güçlü evrim', seviye: 15, unlocked: true },
  { isim: 'Aşama III', aciklama: 'Uzman formu', seviye: 30, unlocked: false },
  { isim: 'Aşama IV', aciklama: 'Usta evrim', seviye: 50, unlocked: false },
  { isim: 'Aşama V', aciklama: 'Galaktik form', seviye: 100, unlocked: false },
];

export default function KoleksiyonScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const [tab, setTab] = useState<'koleksiyon' | 'evrim'>('koleksiyon');
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const unlocked = AKREPLER.filter((a) => a.unlocked).length;

  return (
    <View style={[styles.root, { backgroundColor: '#07001A' }]}>
      {/* Stars */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {Array.from({ length: 25 }).map((_, i) => (
          <View
            key={i}
            style={{
              position: 'absolute',
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              borderRadius: 2,
              backgroundColor: '#fff',
              opacity: Math.random() * 0.4 + 0.1,
              left: `${(i * 11.3 + 5) % 100}%`,
              top: `${(i * 7.7 + 3) % 100}%`,
            }}
          />
        ))}
      </View>

      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <Text style={styles.headerTitle}>AKREPLER</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {(['koleksiyon', 'evrim'] as const).map((t) => (
          <TouchableOpacity
            key={t}
            style={[
              styles.tabBtn,
              tab === t && { borderBottomColor: '#8B5CF6', borderBottomWidth: 2 },
            ]}
            onPress={() => setTab(t)}
          >
            <Text
              style={[
                styles.tabLabel,
                { color: tab === t ? '#C084FC' : '#6B7280' },
              ]}
            >
              {t === 'koleksiyon' ? 'KOLEKSİYON' : 'EVRİM'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {tab === 'koleksiyon' ? (
          <>
            <View style={styles.grid}>
              {AKREPLER.map((a, i) => (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.akrep,
                    {
                      borderColor: a.unlocked ? a.renk + '80' : '#2D1B69',
                      backgroundColor: a.unlocked
                        ? a.renk + '22'
                        : 'rgba(30,27,75,0.4)',
                    },
                  ]}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.akrepIcon,
                      { backgroundColor: a.renk + '33' },
                    ]}
                  >
                    {a.unlocked ? (
                      <Image
                        source={require('@/assets/images/scorpion_main.png')}
                        style={{
                          width: CARD_W * 0.55,
                          height: CARD_W * 0.55,
                          tintColor: a.renk,
                        }}
                        resizeMode="contain"
                      />
                    ) : (
                      <Feather name="lock" size={22} color="#4B3B6B" />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.akrepName,
                      { color: a.unlocked ? '#FFFFFF' : '#4B3B6B' },
                    ]}
                    numberOfLines={2}
                  >
                    {a.isim}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Progress */}
            <View style={styles.progressRow}>
              <Text style={styles.progressLabel}>
                TOPLAM KOLEKSİYON
              </Text>
              <Text style={styles.progressCount}>
                {unlocked} / {AKREPLER.length}
              </Text>
            </View>
            <View style={styles.progressBg}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${(unlocked / AKREPLER.length) * 100}%` },
                ]}
              />
            </View>
          </>
        ) : (
          <View style={styles.evrimList}>
            {EVRIMLER.map((e, i) => (
              <View
                key={i}
                style={[
                  styles.evrimCard,
                  {
                    borderColor: e.unlocked ? '#8B5CF6' : '#2D1B69',
                    backgroundColor: e.unlocked
                      ? 'rgba(139,92,246,0.12)'
                      : 'rgba(30,27,75,0.4)',
                  },
                ]}
              >
                <View
                  style={[
                    styles.evrimNum,
                    { backgroundColor: e.unlocked ? '#8B5CF6' : '#1E1B4B' },
                  ]}
                >
                  <Text style={styles.evrimNumText}>{i + 1}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.evrimIsim,
                      { color: e.unlocked ? '#FFF' : '#4B3B6B' },
                    ]}
                  >
                    {e.isim}
                  </Text>
                  <Text style={styles.evrimAcik}>{e.aciklama}</Text>
                </View>
                {e.unlocked ? (
                  <Feather name="check-circle" size={20} color="#10B981" />
                ) : (
                  <View style={styles.levelBadge}>
                    <Text style={styles.levelBadgeText}>Sev.{e.seviye}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 2,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(139,92,246,0.2)',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  tabLabel: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 1,
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingBottom: 30,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  akrep: {
    width: CARD_W,
    borderRadius: 12,
    borderWidth: 1.5,
    padding: 8,
    alignItems: 'center',
    gap: 6,
  },
  akrepIcon: {
    width: CARD_W * 0.7,
    height: CARD_W * 0.7,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  akrepName: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    textAlign: 'center',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 6,
  },
  progressLabel: {
    color: '#9CA3AF',
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    letterSpacing: 1,
  },
  progressCount: {
    color: '#C084FC',
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
  },
  progressBg: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(139,92,246,0.2)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#8B5CF6',
  },
  evrimList: {
    gap: 10,
  },
  evrimCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1.5,
    padding: 14,
    gap: 12,
  },
  evrimNum: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  evrimNumText: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  evrimIsim: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  evrimAcik: {
    color: '#6B7280',
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
  },
  levelBadge: {
    backgroundColor: 'rgba(139,92,246,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  levelBadgeText: {
    color: '#A78BFA',
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
  },
});
