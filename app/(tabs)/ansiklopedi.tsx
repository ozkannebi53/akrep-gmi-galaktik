import React from 'react';
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useGame } from '@/context/GameContext';

const ORNEKLER: Record<string, string> = {
  KAR: 'Kış geldi, dağlar karla örtüldü.',
  KARE: 'Tahta üzerinde bir kare çizdi.',
  PARE: 'Eski bir Osmanlı para birimi.',
  ARE: 'Küçük bir arazi ölçüm birimi.',
  PAR: 'Golf alanında standart vuruş sayısı.',
  AKREP: 'Akrep çölde yaşayan bir eklembacaklıdır.',
  ALTIN: 'Altın, değerli bir maden olarak bilinir.',
  ELMA: 'Elmalar ağaçta yetişir.',
};

const TANIMLAR: Record<string, string> = {
  KAR: 'İsim',
  KARE: 'İsim / Geometri',
  PARE: 'İsim / Tarihsel',
  ARE: 'İsim / Ölçü',
  PAR: 'İsim / Spor',
  AKREP: 'İsim / Hayvan',
  ALTIN: 'İsim / Madde',
  ELMA: 'İsim / Meyve',
};

export default function AnsiklopediScreen() {
  const insets = useSafeAreaInsets();
  const { ansiklopedi, playerStats } = useGame();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const renderItem = ({ item }: { item: string }) => (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <Text style={styles.kelime}>{item}</Text>
        <View style={styles.turBadge}>
          <Text style={styles.turText}>{TANIMLAR[item] ?? 'İsim'}</Text>
        </View>
      </View>
      <Text style={styles.anlam}>
        {ORNEKLER[item] ?? `"${item}" kelimesini buldun!`}
      </Text>
    </View>
  );

  return (
    <View style={[styles.root, { backgroundColor: '#07001A' }]}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {Array.from({ length: 20 }).map((_, i) => (
          <View
            key={i}
            style={{
              position: 'absolute',
              width: 2,
              height: 2,
              borderRadius: 1,
              backgroundColor: '#fff',
              opacity: 0.2,
              left: `${(i * 13.3 + 5) % 100}%`,
              top: `${(i * 9.7 + 3) % 100}%`,
            }}
          />
        ))}
      </View>

      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <Text style={styles.headerTitle}>ANSİKLOPEDİ</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{ansiklopedi.length}</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Feather name="book" size={18} color="#8B5CF6" />
          <Text style={styles.statVal}>{ansiklopedi.length}</Text>
          <Text style={styles.statLabel}>Bulunan</Text>
        </View>
        <View style={styles.statCard}>
          <Feather name="star" size={18} color="#F59E0B" />
          <Text style={styles.statVal}>{playerStats.toplamKelime.toLocaleString('tr-TR')}</Text>
          <Text style={styles.statLabel}>Toplam</Text>
        </View>
        <View style={styles.statCard}>
          <Feather name="award" size={18} color="#10B981" />
          <Text style={styles.statVal}>{playerStats.seviye}</Text>
          <Text style={styles.statLabel}>Seviye</Text>
        </View>
      </View>

      {ansiklopedi.length === 0 ? (
        <View style={styles.empty}>
          <Feather name="book-open" size={40} color="#2D1B69" />
          <Text style={styles.emptyTitle}>Henüz kelime yok</Text>
          <Text style={styles.emptyDesc}>
            Oyun oynayarak kelimeleri keşfet ve ansiklopedini doldur!
          </Text>
        </View>
      ) : (
        <FlatList
          data={ansiklopedi}
          keyExtractor={(item) => item}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          scrollEnabled={!!ansiklopedi.length}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 2,
  },
  countBadge: {
    backgroundColor: 'rgba(139,92,246,0.25)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  countText: {
    color: '#C084FC',
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    gap: 8,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(30,27,75,0.6)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.25)',
    padding: 12,
    alignItems: 'center',
    gap: 4,
  },
  statVal: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
  statLabel: {
    color: '#9CA3AF',
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
  },
  list: {
    paddingHorizontal: 12,
    paddingBottom: 30,
    gap: 10,
  },
  card: {
    backgroundColor: 'rgba(30,27,75,0.7)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.3)',
    padding: 14,
    gap: 6,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  kelime: {
    color: '#C084FC',
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 2,
  },
  turBadge: {
    backgroundColor: 'rgba(139,92,246,0.2)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  turText: {
    color: '#A78BFA',
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
  },
  anlam: {
    color: '#9CA3AF',
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    lineHeight: 18,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    color: '#6B7280',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    marginTop: 8,
  },
  emptyDesc: {
    color: '#4B5563',
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    lineHeight: 18,
  },
});
