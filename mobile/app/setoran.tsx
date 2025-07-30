import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  Card,
  Button,
  Searchbar,
  FAB,
  Chip,
  Avatar,
  Modal,
  Portal,
  TextInput,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface Setoran {
  id: string;
  peserta: string;
  jumlah: number;
  tanggal: string;
  bulan: string;
  status: 'lunas' | 'belum_lunas';
  metode: 'tunai' | 'transfer';
}

const sampleSetoran: Setoran[] = [
  {
    id: '1',
    peserta: 'Ibu Sari',
    jumlah: 100000,
    tanggal: '2024-01-15',
    bulan: 'Januari 2024',
    status: 'lunas',
    metode: 'tunai',
  },
  {
    id: '2',
    peserta: 'Pak Budi',
    jumlah: 100000,
    tanggal: '2024-01-16',
    bulan: 'Januari 2024',
    status: 'lunas',
    metode: 'transfer',
  },
  {
    id: '3',
    peserta: 'Ibu Rina',
    jumlah: 100000,
    tanggal: '2024-01-17',
    bulan: 'Januari 2024',
    status: 'belum_lunas',
    metode: 'tunai',
  },
];

export default function SetoranScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [setoran, setSetoran] = useState<Setoran[]>(sampleSetoran);
  const [filterStatus, setFilterStatus] = useState<'all' | 'lunas' | 'belum_lunas'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSetoran, setNewSetoran] = useState({
    peserta: '',
    jumlah: '',
    metode: 'tunai',
  });

  const filteredSetoran = setoran.filter(s => {
    const matchesSearch = s.peserta.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         s.bulan.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || s.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddSetoran = () => {
    if (!newSetoran.peserta || !newSetoran.jumlah) {
      Alert.alert('Error', 'Mohon lengkapi semua data');
      return;
    }

    const newItem: Setoran = {
      id: Date.now().toString(),
      peserta: newSetoran.peserta,
      jumlah: parseInt(newSetoran.jumlah),
      tanggal: new Date().toISOString().split('T')[0],
      bulan: new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
      status: 'lunas',
      metode: newSetoran.metode as 'tunai' | 'transfer',
    };

    setSetoran(prev => [newItem, ...prev]);
    setShowAddModal(false);
    setNewSetoran({ peserta: '', jumlah: '', metode: 'tunai' });
    Alert.alert('Sukses', 'Setoran berhasil ditambahkan');
  };

  const handleDeleteSetoran = (item: Setoran) => {
    Alert.alert(
      'Hapus Setoran',
      `Yakin ingin menghapus setoran ${item.peserta}?`,
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Hapus', style: 'destructive', onPress: () => {
          setSetoran(prev => prev.filter(s => s.id !== item.id));
        }},
      ]
    );
  };

  const renderSetoran = ({ item }: { item: Setoran }) => (
    <Card style={styles.setoranCard}>
      <Card.Content>
        <View style={styles.setoranHeader}>
          <Avatar.Text
            size={36}
            label={item.peserta.split(' ').map(n => n[0]).join('')}
            style={styles.avatar}
          />
          <View style={styles.setoranInfo}>
            <Text style={styles.pesertaName}>{item.peserta}</Text>
            <Text style={styles.bulanText}>{item.bulan}</Text>
            <Text style={styles.tanggalText}>{item.tanggal}</Text>
          </View>
          <Chip
            mode="outlined"
            selected={item.status === 'lunas'}
            selectedColor={item.status === 'lunas' ? '#22c55e' : '#f59e0b'}
            style={styles.statusChip}
          >
            {item.status === 'lunas' ? 'Lunas' : 'Belum Lunas'}
          </Chip>
        </View>

        <View style={styles.setoranDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Jumlah:</Text>
            <Text style={styles.detailValue}>Rp {item.jumlah.toLocaleString()}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Metode:</Text>
            <Text style={styles.detailValue}>{item.metode}</Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <Button
            mode="outlined"
            onPress={() => handleDeleteSetoran(item)}
            style={styles.deleteButton}
            icon="delete"
            textColor="#ef4444"
          >
            Hapus
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Setoran</Text>
        <Text style={styles.subtitle}>
          Total: {setoran.length} setoran
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Cari setoran..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
        
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterButton, filterStatus === 'all' && styles.filterActive]}
            onPress={() => setFilterStatus('all')}
          >
            <Text style={[styles.filterText, filterStatus === 'all' && styles.filterTextActive]}>
              Semua
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filterStatus === 'lunas' && styles.filterActive]}
            onPress={() => setFilterStatus('lunas')}
          >
            <Text style={[styles.filterText, filterStatus === 'lunas' && styles.filterTextActive]}>
              Lunas
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filterStatus === 'belum_lunas' && styles.filterActive]}
            onPress={() => setFilterStatus('belum_lunas')}
          >
            <Text style={[styles.filterText, filterStatus === 'belum_lunas' && styles.filterTextActive]}>
              Belum Lunas
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filteredSetoran}
        renderItem={renderSetoran}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="wallet" size={48} color="#cbd5e1" />
            <Text style={styles.emptyText}>Tidak ada setoran</Text>
          </View>
        }
      />

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => setShowAddModal(true)}
        label="Tambah Setoran"
      />

      <Portal>
        <Modal
          visible={showAddModal}
          onDismiss={() => setShowAddModal(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Card>
            <Card.Title title="Tambah Setoran Baru" />
            <Card.Content>
              <TextInput
                label="Nama Peserta"
                value={newSetoran.peserta}
                onChangeText={(text) => setNewSetoran(prev => ({ ...prev, peserta: text }))}
                style={styles.input}
              />
              <TextInput
                label="Jumlah Setoran"
                value={newSetoran.jumlah}
                onChangeText={(text) => setNewSetoran(prev => ({ ...prev, jumlah: text }))}
                style={styles.input}
                keyboardType="numeric"
              />
              <TextInput
                label="Metode Pembayaran"
                value={newSetoran.metode}
                onChangeText={(text) => setNewSetoran(prev => ({ ...prev, metode: text }))}
                style={styles.input}
              />
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => setShowAddModal(false)}>Batal</Button>
              <Button onPress={handleAddSetoran} mode="contained">
                Simpan
              </Button>
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
  searchContainer: {
    padding: 20,
  },
  searchBar: {
    marginBottom: 10,
    elevation: 0,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#e2e8f0',
  },
  filterActive: {
    backgroundColor: '#3b82f6',
  },
  filterText: {
    fontSize: 14,
    color: '#64748b',
  },
  filterTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  listContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  setoranCard: {
    marginBottom: 12,
    elevation: 2,
  },
  setoranHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    marginRight: 12,
  },
  setoranInfo: {
    flex: 1,
  },
  pesertaName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  bulanText: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  tanggalText: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  statusChip: {
    marginLeft: 8,
  },
  setoranDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  deleteButton: {
    borderColor: '#ef4444',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#22c55e',
  },
  modalContainer: {
    margin: 20,
    borderRadius: 12,
  },
  input: {
    marginBottom: 12,
    backgroundColor: 'transparent',
  },
});
