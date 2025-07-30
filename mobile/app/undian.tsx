import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Animated,
} from 'react-native';
import {
  Card,
  Button,
  Avatar,
  Modal,
  Portal,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface Peserta {
  id: string;
  nama: string;
  hadir: boolean;
}

interface Pemenang {
  nama: string;
  tanggal: string;
  hadiah: string;
}

const samplePeserta: Peserta[] = [
  { id: '1', nama: 'Ibu Sari', hadir: true },
  { id: '2', nama: 'Pak Budi', hadir: true },
  { id: '3', nama: 'Ibu Rina', hadir: true },
  { id: '4', nama: 'Pak Ahmad', hadir: true },
  { id: '5', nama: 'Ibu Dewi', hadir: true },
  { id: '6', nama: 'Ibu Ani', hadir: true },
  { id: '7', nama: 'Pak Joko', hadir: true },
  { id: '8', nama: 'Ibu Murni', hadir: true },
];

const samplePemenang: Pemenang[] = [
  { nama: 'Ibu Sari', tanggal: '2024-01-15', hadiah: 'Rp 2.400.000' },
  { nama: 'Pak Budi', tanggal: '2024-02-15', hadiah: 'Rp 2.400.000' },
  { nama: 'Ibu Rina', tanggal: '2024-03-15', hadiah: 'Rp 2.400.000' },
];

export default function UndianScreen() {
  const [peserta, setPeserta] = useState<Peserta[]>(samplePeserta);
  const [pemenang, setPemenang] = useState<Pemenang[]>(samplePemenang);
  const [showDrawModal, setShowDrawModal] = useState(false);
  const [selectedPemenang, setSelectedPemenang] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [animationValue] = useState(new Animated.Value(0));

  const handleToggleHadir = (id: string) => {
    setPeserta(prev =>
      prev.map(p => (p.id === id ? { ...p, hadir: !p.hadir } : p))
    );
  };

  const handleDrawLottery = () => {
    const pesertaHadir = peserta.filter(p => p.hadir);
    
    if (pesertaHadir.length === 0) {
      Alert.alert('Error', 'Tidak ada peserta yang hadir');
      return;
    }

    setIsDrawing(true);
    setShowDrawModal(true);
    
    // Animation
    Animated.loop(
      Animated.timing(animationValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      })
    ).start();

    // Simulate drawing process
    setTimeout(() => {
      const pemenangBaru = pesertaHadir[Math.floor(Math.random() * pesertaHadir.length)];
      setSelectedPemenang(pemenangBaru.nama);
      setIsDrawing(false);
      
      // Stop animation
      animationValue.stopAnimation();
      
      // Add to history
      const newPemenang: Pemenang = {
        nama: pemenangBaru.nama,
        tanggal: new Date().toISOString().split('T')[0],
        hadiah: 'Rp 2.400.000',
      };
      setPemenang(prev => [newPemenang, ...prev]);
    }, 3000);
  };

  const handleConfirmWinner = () => {
    Alert.alert(
      'Konfirmasi Pemenang',
      `Apakah Anda yakin ${selectedPemenang} adalah pemenang?`,
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Ya', onPress: () => {
          setShowDrawModal(false);
          setSelectedPemenang(null);
          Alert.alert('Selamat!', `${selectedPemenang} telah ditetapkan sebagai pemenang`);
        }},
      ]
    );
  };

  const renderPeserta = ({ item }: { item: Peserta }) => (
    <Card style={styles.pesertaCard}>
      <Card.Content>
        <View style={styles.pesertaRow}>
          <Avatar.Text
            size={40}
            label={item.nama.split(' ').map(n => n[0]).join('')}
            style={[styles.avatar, !item.hadir && styles.avatarInactive]}
          />
          <View style={styles.pesertaInfo}>
            <Text style={[styles.pesertaName, !item.hadir && styles.textInactive]}>
              {item.nama}
            </Text>
            <Text style={[styles.pesertaStatus, !item.hadir && styles.textInactive]}>
              {item.hadir ? 'Hadir' : 'Tidak Hadir'}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => handleToggleHadir(item.id)}
            style={[styles.toggleButton, item.hadir ? styles.toggleActive : styles.toggleInactive]}
          >
            <Ionicons
              name={item.hadir ? 'checkmark-circle' : 'close-circle'}
              size={24}
              color={item.hadir ? '#22c55e' : '#ef4444'}
            />
          </TouchableOpacity>
        </View>
      </Card.Content>
    </Card>
  );

  const renderPemenang = ({ item }: { item: Pemenang }) => (
    <Card style={styles.pemenangCard}>
      <Card.Content>
        <View style={styles.pemenangRow}>
          <Avatar.Text
            size={36}
            label={item.nama.split(' ').map(n => n[0]).join('')}
            style={styles.avatarSmall}
          />
          <View style={styles.pemenangInfo}>
            <Text style={styles.pemenangName}>{item.nama}</Text>
            <Text style={styles.pemenangDate}>{item.tanggal}</Text>
          </View>
          <Text style={styles.pemenangHadiah}>{item.hadiah}</Text>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Undian Arisan</Text>
        <Text style={styles.subtitle}>Pilih peserta hadir dan lakukan undian</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Peserta Hadir</Text>
          <Text style={styles.sectionSubtitle}>
            Centang peserta yang hadir untuk diikutsertakan dalam undian
          </Text>
        </View>

        <FlatList
          data={peserta}
          renderItem={renderPeserta}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.pesertaList}
        />

        <View style={styles.drawSection}>
          <Button
            mode="contained"
            onPress={handleDrawLottery}
            style={styles.drawButton}
            icon="trophy"
            disabled={peserta.filter(p => p.hadir).length === 0}
          >
            Mulai Undian
          </Button>
          <Text style={styles.drawInfo}>
            {peserta.filter(p => p.hadir).length} peserta siap untuk undian
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Riwayat Pemenang</Text>
        </View>

        <FlatList
          data={pemenang}
          renderItem={renderPemenang}
          keyExtractor={(item, index) => index.toString()}
          scrollEnabled={false}
          contentContainerStyle={styles.pemenangList}
        />
      </ScrollView>

      <Portal>
        <Modal
          visible={showDrawModal}
          onDismiss={() => setShowDrawModal(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Card>
            <Card.Title title="Hasil Undian" />
            <Card.Content>
              <View style={styles.modalContent}>
                {isDrawing ? (
                  <Animated.View
                    style={[
                      styles.drawingAnimation,
                      {
                        transform: [
                          {
                            rotate: animationValue.interpolate({
                              inputRange: [0, 1],
                              outputRange: ['0deg', '360deg'],
                            }),
                          },
                        ],
                      },
                    ]}
                  >
                    <Ionicons name="trophy" size={80} color="#f59e0b" />
                  </Animated.View>
                ) : (
                  <View style={styles.winnerDisplay}>
                    <Ionicons name="trophy" size={80} color="#f59e0b" />
                    <Text style={styles.winnerTitle}>Pemenang:</Text>
                    <Text style={styles.winnerName}>{selectedPemenang}</Text>
                    <Text style={styles.winnerPrize}>Hadiah: Rp 2.400.000</Text>
                  </View>
                )}
              </View>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => setShowDrawModal(false)}>Tutup</Button>
              {!isDrawing && selectedPemenang && (
                <Button onPress={handleConfirmWinner} mode="contained">
                  Konfirmasi
                </Button>
              )}
            </Card.Actions>
          </Card>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
  },
  pesertaList: {
    paddingHorizontal: 20,
  },
  pesertaCard: {
    marginBottom: 8,
    elevation: 2,
  },
  pesertaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 12,
  },
  avatarInactive: {
    opacity: 0.5,
  },
  pesertaInfo: {
    flex: 1,
  },
  pesertaName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  pesertaStatus: {
    fontSize: 14,
    color: '#64748b',
  },
  textInactive: {
    color: '#94a3b8',
  },
  toggleButton: {
    padding: 8,
  },
  toggleActive: {
    backgroundColor: '#22c55e20',
    borderRadius: 20,
  },
  toggleInactive: {
    backgroundColor: '#ef444420',
    borderRadius: 20,
  },
  drawSection: {
    padding: 20,
    alignItems: 'center',
  },
  drawButton: {
    marginBottom: 12,
  },
  drawInfo: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  pemenangList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  pemenangCard: {
    marginBottom: 8,
    elevation: 2,
  },
  pemenangRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarSmall: {
    marginRight: 12,
  },
  pemenangInfo: {
    flex: 1,
  },
  pemenangName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  pemenangDate: {
    fontSize: 12,
    color: '#64748b',
  },
  pemenangHadiah: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#22c55e',
  },
  modalContainer: {
    margin: 20,
    borderRadius: 12,
  },
  modalContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  drawingAnimation: {
    alignItems: 'center',
  },
  winnerDisplay: {
    alignItems: 'center',
  },
  winnerTitle: {
    fontSize: 18,
    color: '#64748b',
    marginTop: 12,
  },
  winnerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f59e0b',
    marginTop: 4,
  },
  winnerPrize: {
    fontSize: 16,
    color: '#22c55e',
    marginTop: 8,
  },
});
