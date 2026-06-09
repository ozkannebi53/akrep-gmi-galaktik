import React from 'react';
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
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useGame } from '@/context/GameContext';
import { useColors } from '@/hooks/useColors';

const { width: W } = Dimensions.get('window');

function CurrencyChip({
  icon,
  value,
  color,
}: {
  icon: string;
  value: string;
  color: string;
}) {
  return (
    <View style={[styles.chip, { borderColor: color + '40' }]}>
      <MaterialCommunityIcons name={icon as any} size={14} color={color} />
      <Text style={[styles.chipText, { color: '#FFF' }]}>{value}</Text>
    </View>
  );
}

function SideBtn({
  icon,
  label,
  badge,
  onPress,
}: {
  icon: string;
  label: string;
  badge?: number;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity style={styles.sideBtn} onPress={onPress} activeOpacity={0.75}>
      {badge ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      ) : null}
      <Feather name={icon as any} size={20} color="#C084FC" />
      <Text style={styles.sideBtnLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

function GameBtn({
  label,
  sublabel,
  icon,
  bg,
  onPress,
}: {
  label: string;
  sublabel?: string;
  icon: string;
  bg: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.gameBtn, { borderColor: bg + '99', backgroundColor: bg + '22' }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.gameBtnIcon, { backgroundColor: bg }]}>
        <Feather name={icon as any} size={16} color="#FFF" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.gameBtnLabel}>{label}</Text>
        {sublabel ? (
          <Text style={styles.gameBtnSub}>{sublabel}</Text>
        ) : null}
      </View>
      <Feather name="chevron-right" size={14} color={bg} />
    </TouchableOpacity>
  );
}

export default function AnaMenuScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { playerStats, currentPuzzle, setPuzzleIndex } = useGame();

  const topPad =
    Platform.OS === 'web' ? 67 : insets.top;

  const xpPct = playerStats.xp / playerStats.maxXp;
  const passPct = playerStats.kozmikPass / playerStats.kozmikPassMax;

  const fmt = (n: number) =>
    n >= 1000 ? n.toLocaleString('tr-TR') : String(n);

  return (
    <View style={[styles.root, { backgroundColor: '#07001A' }]}>
      {/* Stars background */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {Array.from({ length: 40 }).map((_, i) => (
          <View
            key={i}
            style={{
              position: 'absolute',
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              borderRadius: 2,
              backgroundColor: '#ffffff',
              opacity: Math.random() * 0.6 + 0.2,
              left: `${(i * 7.3 + 3) % 100}%`,
              top: `${(i * 13.7 + 5) % 100}%`,
            }}
          />
        ))}
      </View>

      {/* Top header */}
      <View style={[styles.header, { paddingTop: topPad + 6 }]}>
        <View style={styles.playerInfo}>
          <View style={styles.avatar}>
            <Feather name="user" size={18} color="#C084FC" />
          </View>
          <View>
            <Text style={styles.playerName}>Galaktik Oyuncu</Text>
            <Text style={styles.playerLevel}>Seviye {playerStats.seviye}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.passChip, { borderColor: '#F59E0B55' }]}
        >
          <MaterialCommunityIcons name="star-four-points" size={14} color="#F59E0B" />
          <Text style={styles.passText}>
            KOZMİK PASS {fmt(playerStats.kozmikPass)}/{playerStats.kozmikPassMax}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Currency bar */}
      <View style={styles.currencyBar}>
        <CurrencyChip icon="circle" value={fmt(playerStats.altin)} color="#F59E0B" />
        <CurrencyChip icon="diamond-stone" value={fmt(playerStats.elmas)} color="#60A5FA" />
        <CurrencyChip icon="star-four-points" value={fmt(playerStats.yildiz)} color="#A78BFA" />
        <TouchableOpacity style={styles.menuBtn}>
          <Feather name="menu" size={18} color="#C084FC" />
        </TouchableOpacity>
      </View>

      {/* Kozmik Pass Bar */}
      <View style={styles.passBarRow}>
        <View style={styles.passBarBg}>
          <View style={[styles.passBarFill, { width: `${passPct * 100}%` }]} />
        </View>
        <Text style={styles.passBarLabel}>
          {playerStats.kozmikPass}/{playerStats.kozmikPassMax}
        </Text>
      </View>

      {/* Main content */}
      <View style={styles.mainRow}>
        {/* Left sidebar */}
        <View style={styles.sidebar}>
          <SideBtn icon="target" label="GÖREV" badge={3} />
          <SideBtn icon="zap" label="AKREP" />
          <SideBtn icon="shopping-bag" label="MAĞAZA" />
          <SideBtn icon="package" label="SANDIK" />
          <SideBtn icon="award" label="LİGLER" />
        </View>

        {/* Center: Scorpion card */}
        <View style={styles.scorpionCard}>
          <View style={[styles.cardBg, { borderColor: '#8B5CF640' }]}>
            <Image
              source={require('@/assets/images/scorpion_main.png')}
              style={styles.scorpionImg}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.scorpionTitle}>A K R E P</Text>
          <Text style={styles.scorpionSubtitle}>G M İ</Text>
          <View style={styles.xpBarBg}>
            <View style={[styles.xpBarFill, { width: `${xpPct * 100}%` }]} />
          </View>
          <Text style={styles.xpLabel}>
            {fmt(playerStats.xp)} / {fmt(playerStats.maxXp)}
          </Text>
        </View>

        {/* Right: Game mode buttons */}
        <View style={styles.gameBtns}>
          <GameBtn
            label="OYNA"
            sublabel={`Bölüm ${currentPuzzle.bolum}`}
            icon="play"
            bg="#059669"
            onPress={() => {
              setPuzzleIndex(0);
              router.push('/oyun');
            }}
          />
          <GameBtn
            label="ÇOK"
            sublabel="OYUNCULU"
            icon="users"
            bg="#1D4ED8"
            onPress={() => {}}
          />
          <GameBtn
            label="BOSS"
            sublabel="SAVAŞLARI"
            icon="zap"
            bg="#DC2626"
            onPress={() => {}}
          />
          <GameBtn
            label="GÜNLÜK"
            sublabel="ETKİNLİK"
            icon="gift"
            bg="#D97706"
            onPress={() => {}}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingBottom: 4,
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(139,92,246,0.2)',
    borderWidth: 1,
    borderColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerName: {
    color: '#FFF',
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  playerLevel: {
    color: '#9CA3AF',
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
  },
  passChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'rgba(245,158,11,0.08)',
  },
  passText: {
    color: '#F59E0B',
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
  },
  currencyBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 6,
    marginBottom: 4,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'rgba(139,92,246,0.08)',
    flex: 1,
  },
  chipText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  menuBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(139,92,246,0.15)',
    borderWidth: 1,
    borderColor: '#8B5CF640',
    alignItems: 'center',
    justifyContent: 'center',
  },
  passBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
    marginBottom: 6,
  },
  passBarBg: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(139,92,246,0.2)',
    overflow: 'hidden',
  },
  passBarFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: '#8B5CF6',
  },
  passBarLabel: {
    color: '#9CA3AF',
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
  },
  mainRow: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 6,
    paddingBottom: 4,
    gap: 4,
  },
  sidebar: {
    width: 56,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  sideBtn: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: 'rgba(30,27,75,0.7)',
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  sideBtnLabel: {
    fontSize: 6.5,
    color: '#9CA3AF',
    fontFamily: 'Inter_500Medium',
    marginTop: 2,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  badgeText: {
    fontSize: 9,
    color: '#FFF',
    fontFamily: 'Inter_700Bold',
  },
  scorpionCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBg: {
    width: W * 0.38,
    height: W * 0.38,
    borderRadius: W * 0.19,
    backgroundColor: 'rgba(88,28,135,0.15)',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  scorpionImg: {
    width: W * 0.34,
    height: W * 0.34,
  },
  scorpionTitle: {
    color: '#F59E0B',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 4,
    marginTop: 8,
  },
  scorpionSubtitle: {
    color: '#C084FC',
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 6,
  },
  xpBarBg: {
    width: W * 0.34,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(139,92,246,0.2)',
    overflow: 'hidden',
    marginTop: 8,
  },
  xpBarFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: '#8B5CF6',
  },
  xpLabel: {
    color: '#9CA3AF',
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
    marginTop: 3,
  },
  gameBtns: {
    width: 112,
    justifyContent: 'center',
    gap: 8,
  },
  gameBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 8,
    gap: 6,
  },
  gameBtnIcon: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameBtnLabel: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.5,
  },
  gameBtnSub: {
    color: '#9CA3AF',
    fontSize: 8,
    fontFamily: 'Inter_400Regular',
  },
});
