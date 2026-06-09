import React, { useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useGame } from '@/context/GameContext';

const LIGLER = ['Bronz', 'Gümüş', 'Altın', 'Elmas', 'Usta', 'Efsane', 'Galaktik', 'Kozmik'];
const LIG_RENKLER: Record<string, string> = {
  Bronz: '#B45309',
  Gümüş: '#9CA3AF',
  Altın: '#F59E0B',
  Elmas: '#60A5FA',
  Usta: '#8B5CF6',
  Efsane: '#EC4899',
  Galaktik: '#C084FC',
  Kozmik: '#FBBF24',
};

const OYUNCULAR = [
  { isim: 'NebulaMaster', puan: 98450, seviye: 342 },
  { isim: 'GalaktiKral', puan: 87230, seviye: 289 },
  { isim: 'KozmikKahraman', puan: 76180, seviye: 245 },
  { isim: 'YıldızAvcısı', puan: 65990, seviye: 198 },
  { isim: 'AkrepEfendisi', puan: 54770, seviye: 175 },
  { isim: 'Galaktik Oyuncu', puan: 48320, seviye: 127, isMe: true },
  { isim: 'MeteoraVardım', puan: 42100, seviye: 115 },
  { isim: 'UzayKaşifi', puan: 38560, seviye: 98 },
  { isim: 'KristalYıldız', puan: 31200, seviye: 84 },
  { isim: 'AtomikAkrep', puan: 27890, seviye: 72 },
];

const KATEGORILER = ['Global', 'Ülke', 'Arkadaş'] as const;

export default function LiderlikScreen() {
  const insets = useSafeAreaInsets();
  const { playerStats } = useGame();
  const [kategori, setKategori] = useState<typeof KATEGORILER[number]>('Global');
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const currentLig = 'Elmas';
  const ligRenk = LIG_RENKLER[currentLig];

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
              opacity: 0.15,
              left: `${(i * 13.3 + 5) % 100}%`,
              top: `${(i * 9.7 + 3) % 100}%`,
            }}
          />
        ))}
      </View>

      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <Text style={styles.headerTitle}>LİDERLİK</Text>
        <View style={[styles.ligBadge, { borderColor: ligRenk + '60', backgroundColor: ligRenk + '20' }]}>
          <MaterialCommunityIcons name="diamond-stone" size={14} color={ligRenk} />
          <Text style={[styles.ligText, { color: ligRenk }]}>{currentLig} Ligi</Text>
        </View>
      </View>

      {/* Kategori tabs */}
      <View style={styles.katTabs}>
        {KATEGORILER.map((k) => (
          <TouchableOpacity
            key={k}
            style={[
              styles.katBtn,
              kategori === k && { backgroundColor: 'rgba(139,92,246,0.25)', borderColor: '#8B5CF6' },
            ]}
            onPress={() => setKategori(k)}
          >
            <Text style={[styles.katLabel, { color: kategori === k ? '#C084FC' : '#6B7280' }]}>
              {k}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Lig listesi */}
      <View style={styles.ligRow}>
        {LIGLER.map((l) => (
          <TouchableOpacity
            key={l}
            style={[
              styles.ligBtn,
              l === currentLig && { borderColor: LIG_RENKLER[l], backgroundColor: LIG_RENKLER[l] + '30' },
            ]}
          >
            <Text
              style={[
                styles.ligBtnText,
                { color: l === currentLig ? LIG_RENKLER[l] : '#4B3B6B' },
              ]}
              numberOfLines={1}
            >
              {l}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {OYUNCULAR.map((o, i) => (
          <View
            key={i}
            style={[
              styles.row,
              o.isMe && { borderColor: '#8B5CF6', backgroundColor: 'rgba(139,92,246,0.15)' },
            ]}
          >
            <View style={[
              styles.rank,
              i === 0 && { backgroundColor: '#F59E0B20' },
              i === 1 && { backgroundColor: '#9CA3AF20' },
              i === 2 && { backgroundColor: '#B4530920' },
            ]}>
              <Text style={[
                styles.rankText,
                i === 0 && { color: '#F59E0B' },
                i === 1 && { color: '#9CA3AF' },
                i === 2 && { color: '#B45309' },
              ]}>
                {i < 3 ? ['🥇', '🥈', '🥉'][i] : `#${i + 1}`}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.oyuncu, o.isMe && { color: '#C084FC' }]}>{o.isim}</Text>
              <Text style={styles.seviyelbl}>Seviye {o.seviye}</Text>
            </View>
            <Text style={styles.puan}>{o.puan.toLocaleString('tr-TR')}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 2,
  },
  ligBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  ligText: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
  },
  katTabs: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    gap: 8,
    marginBottom: 10,
  },
  katBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.2)',
  },
  katLabel: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  ligRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    gap: 4,
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  ligBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2D1B69',
  },
  ligBtnText: {
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
  },
  list: {
    paddingHorizontal: 12,
    paddingBottom: 30,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30,27,75,0.5)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.15)',
    padding: 12,
    gap: 12,
  },
  rank: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(139,92,246,0.1)',
  },
  rankText: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
    color: '#6B7280',
  },
  oyuncu: {
    color: '#FFF',
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
  seviyelbl: {
    color: '#6B7280',
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
  },
  puan: {
    color: '#F59E0B',
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
  },
});
