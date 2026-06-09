import React, { useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

interface SettingRowProps {
  icon: string;
  label: string;
  value?: boolean;
  onToggle?: (v: boolean) => void;
  onPress?: () => void;
  sublabel?: string;
  accent?: string;
}

function SettingRow({ icon, label, value, onToggle, onPress, sublabel, accent }: SettingRowProps) {
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      activeOpacity={onPress ? 0.75 : 1}
    >
      <View style={[styles.rowIcon, { backgroundColor: (accent ?? '#8B5CF6') + '22' }]}>
        <Feather name={icon as any} size={18} color={accent ?? '#8B5CF6'} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowLabel}>{label}</Text>
        {sublabel ? <Text style={styles.rowSub}>{sublabel}</Text> : null}
      </View>
      {onToggle !== undefined ? (
        <Switch
          value={value}
          onValueChange={onToggle}
          thumbColor={value ? '#8B5CF6' : '#4B3B6B'}
          trackColor={{ false: '#1E1B4B', true: '#8B5CF640' }}
        />
      ) : onPress ? (
        <Feather name="chevron-right" size={18} color="#4B3B6B" />
      ) : null}
    </TouchableOpacity>
  );
}

export default function AyarlarScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const [muzik, setMuzik] = useState(true);
  const [sesEfekti, setSesEfekti] = useState(true);
  const [titresim, setTitresim] = useState(true);
  const [bildirim, setBildirim] = useState(true);
  const [karanlik, setKaranlik] = useState(true);
  const [otomatikKayit, setOtomatikKayit] = useState(true);

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
        <Text style={styles.headerTitle}>AYARLAR</Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Ses */}
        <Text style={styles.sectionLabel}>SES & TİTREŞİM</Text>
        <View style={styles.section}>
          <SettingRow icon="music" label="Müzik" value={muzik} onToggle={setMuzik} />
          <View style={styles.divider} />
          <SettingRow icon="volume-2" label="Ses Efektleri" value={sesEfekti} onToggle={setSesEfekti} />
          <View style={styles.divider} />
          <SettingRow icon="smartphone" label="Titreşim" value={titresim} onToggle={setTitresim} />
        </View>

        {/* Görünüm */}
        <Text style={styles.sectionLabel}>GÖRÜNÜM</Text>
        <View style={styles.section}>
          <SettingRow icon="moon" label="Karanlık Mod" sublabel="Saf Siyah Uzay" value={karanlik} onToggle={setKaranlik} />
          <View style={styles.divider} />
          <SettingRow icon="globe" label="Dil" sublabel="Türkçe" onPress={() => {}} />
        </View>

        {/* Hesap */}
        <Text style={styles.sectionLabel}>HESAP</Text>
        <View style={styles.section}>
          <SettingRow icon="cloud" label="Bulut Senkronizasyon" value={otomatikKayit} onToggle={setOtomatikKayit} />
          <View style={styles.divider} />
          <SettingRow icon="bell" label="Bildirimler" value={bildirim} onToggle={setBildirim} />
          <View style={styles.divider} />
          <SettingRow icon="shield" label="Gizlilik" onPress={() => {}} />
        </View>

        {/* Destek */}
        <Text style={styles.sectionLabel}>DESTEK</Text>
        <View style={styles.section}>
          <SettingRow icon="help-circle" label="Yardım" onPress={() => {}} />
          <View style={styles.divider} />
          <SettingRow icon="star" label="Uygulamayı Oyla" onPress={() => {}} accent="#F59E0B" />
          <View style={styles.divider} />
          <SettingRow icon="share-2" label="Arkadaşlarına Paylaş" onPress={() => {}} accent="#10B981" />
        </View>

        {/* Version */}
        <View style={styles.versionRow}>
          <Text style={styles.versionText}>AKREP GMİ - GALACTIC v1.0.0</Text>
          <Text style={styles.versionSub}>Akrep GMİ © 2026 Nebi Özkan</Text>
        </View>
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
  scrollContent: {
    paddingHorizontal: 12,
    paddingBottom: 40,
    gap: 4,
  },
  sectionLabel: {
    color: '#6B7280',
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 2,
    marginTop: 16,
    marginBottom: 6,
    marginLeft: 4,
  },
  section: {
    backgroundColor: 'rgba(30,27,75,0.6)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.2)',
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 14,
    gap: 12,
  },
  rowIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  rowSub: {
    color: '#6B7280',
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(139,92,246,0.1)',
    marginLeft: 60,
  },
  versionRow: {
    alignItems: 'center',
    marginTop: 24,
    gap: 4,
  },
  versionText: {
    color: '#4B3B6B',
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
  },
  versionSub: {
    color: '#2D1B69',
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
  },
});
