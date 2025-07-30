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
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface Peserta {
  id: string;
  nama: string;
  noHp: string;
  alamat: string;
  status: 'aktif' | 'tidak_aktif';
  totalSetoran: number;
  tunggakan: number;
}

const samplePeserta: Peserta[] = [
  {
    id: '1',
    nama: 'Ibu Sari',
    noHp: '081234567890',
    alamat: 'Jl. Merdeka No. 1',
    status: 'aktif',
    totalSetoran: 2400000,
    tunggakan: 0,
  },
  {
    id: '2',
    nama: 'Pak Budi',
    noHp: '082345678901',
    alamat: 'Jl. Sudirman No. 2',
    status: 'aktif',
    totalSetoran: 2000000,
    tunggakan: 1,
  },
  {
    id: '3',
    nama: 'Ibu Rina',
    noHp: '083456789012',
    alamat: 'Jl. Ahmad Yani No. 3',
    status: 'aktif',
    totalSetoran: 2400000,
    tunggakan: 0,
  },
];

export default function PesertaScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [peserta, setPeserta] = useState<Peserta[]>(samplePeserta);
  const [filterStatus, setFilterStatus] = useState<'all' | 'aktif' | 'tidak_aktif'>('all');

  const filteredPeserta = peserta.filter(p => {
    const matchesSearch = p.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.noHp.includes(searchQuery);
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddPeserta = () => {
    Alert.alert('Tambah Peserta', 'Fitur tambah peserta akan segera tersedia');
  };

  const handleEditPeserta = (peserta: Peserta) => {
    Alert.alert('Edit Peserta', `Edit ${peserta.nama}`);
  };

  const handleDeletePeserta = (peserta: Peserta) => {
    Alert.alert(
      'Hapus Peserta',
      `Yakin ingin menghapus ${peserta.nama}?`,
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Hapus', style: 'destructive', onPress: () => {
          setPeserta(prev => prev.filter(p => p.id !== peserta.id));
        }},
      ]
    );
  };

  const renderPeserta = ({ item }: { item: Peserta }) => (
    <Card style={styles.pesertaCard}>
      <Card.Content>
        <View style={styles.pesertaHeader}>
          <Avatar.Text
            size={40}
            label={item.nama.split(' ').map(n => n[0]).join('')}
            style={styles.avatar}
          />
          <View style={styles.pesertaInfo}>
            <Text style={styles.pesertaName}>{item.nama}</Text>
            <Text style={styles.pesertaPhone}>{item.noHp}</Text>
            <Text style={styles.pesertaAddress}>{item.alamat}</Text>
          </View>
          <Chip
            mode="outlined"
            selected={item.status === 'aktif'}
            selectedColor={item.status === 'aktif' ? '#22c55e' : '#ef4444'}
            style={styles.statusChip}
          >
            {item.status}
          </Chip>
        </View>

        <View style={styles.pesertaStats}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total Setoran</Text>
            <Text style={styles.statValue}>Rp {item.totalSetoran.toLocaleString()}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Tunggakan</Text>
            <Text style={[styles.statValue, { color: item.tunggakan > 0 ? '#ef4444' : '#22c55e' }]}>
              {item.tunggakan}
            </Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <Button
            mode="outlined"
            onPress={() => handleEditPeserta(item)}
            style={styles.actionButton}
            icon="pencil"
          >
            Edit
          </Button>
          <Button
            mode="outlined"
            onPress={() => handleDeletePeserta(item)}
            style={[styles.actionButton, styles.deleteButton]}
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
        <Text style={styles.title}>Peserta Arisan</Text>
        <Text style={styles.subtitle}>
          Total: {filteredPeserta.length} peserta
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Cari peserta..."
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
            style={[styles.filterButton, filterStatus === 'aktif' && styles.filterActive]}
            onPress={() => setFilterStatus('aktif')}
          >
            <Text style={[styles.filterText, filterStatus === 'aktif' && styles.filterTextActive]}>
              Aktif
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filterStatus === 'tidak_aktif' && styles.filterActive]}
            onPress={() => setFilterStatus('tidak_aktif')}
          >
            <Text style={[styles.filterText, filterStatus === 'tidak_aktif' && styles.filterTextActive]}>
              Tidak Aktif
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filteredPeserta}
        renderItem={renderPeserta}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people" size={48} color="#cbd5e1" />
            <Text style={styles.emptyText}>Tidak ada peserta</Text>
          </View>
        }
      />

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={handleAddPeserta}
        label="Tambah Peserta"
      />
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
  pesertaCard: {
    marginBottom: 12,
    elevation: 2,
  },
  pesertaHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  avatar: {
    marginRight: 12,
  },
  pesertaInfo: {
    flex: 1,
  },
  pesertaName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  pesertaPhone: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  pesertaAddress: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  statusChip: {
    marginTop: 4,
  },
  pesertaStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  actionButton: {
    flex: 1,
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
    backgroundColor: '#3b82f6',
  },
});
