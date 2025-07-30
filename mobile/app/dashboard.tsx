import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { Card, Button, FAB } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { useAuth } from '../src/hooks/useAuth';

const { width: screenWidth } = Dimensions.get('window');

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [showDrawModal, setShowDrawModal] = useState(false);

  // Sample data - replace with real data from Supabase
  const stats = {
    totalPeserta: 24,
    totalSetoran: 12500000,
    setoranBulanIni: 2400000,
    tunggakan: 3,
    pemenangTerakhir: 'Ibu Sari',
  };

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'],
    datasets: [
      {
        data: [2000000, 2200000, 2100000, 2400000, 2300000, 2500000],
        color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const pieData = [
    {
      name: 'Lunas',
      population: 21,
      color: '#22c55e',
      legendFontColor: '#374151',
      legendFontSize: 12,
    },
    {
      name: 'Tunggakan',
      population: 3,
      color: '#ef4444',
      legendFontColor: '#374151',
      legendFontSize: 12,
    },
  ];

  const handleDrawLottery = () => {
    const peserta = ['Ibu Sari', 'Pak Budi', 'Ibu Rina', 'Pak Ahmad', 'Ibu Dewi'];
    const pemenang = peserta[Math.floor(Math.random() * peserta.length)];
    Alert.alert(
      'Hasil Undian',
      `Selamat! Pemenang undian bulan ini adalah: ${pemenang}`,
      [{ text: 'OK' }]
    );
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Keluar',
      'Apakah Anda yakin ingin keluar?',
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Keluar', onPress: () => signOut() },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Arisan Srikandi Kudus</Text>
          <Text style={styles.headerSubtitle}>Selamat datang, {user?.email}</Text>
        </View>
        <TouchableOpacity onPress={handleSignOut} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="#ef4444" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Statistics Cards */}
        <View style={styles.statsContainer}>
          <Card style={[styles.statCard, { backgroundColor: '#3b82f6' }]}>
            <Card.Content>
              <View style={styles.statContent}>
                <Ionicons name="people" size={32} color="white" />
                <View>
                  <Text style={styles.statNumber}>{stats.totalPeserta}</Text>
                  <Text style={styles.statLabel}>Total Peserta</Text>
                </View>
              </View>
            </Card.Content>
          </Card>

          <Card style={[styles.statCard, { backgroundColor: '#22c55e' }]}>
            <Card.Content>
              <View style={styles.statContent}>
                <Ionicons name="wallet" size={32} color="white" />
                <View>
                  <Text style={styles.statNumber}>
                    Rp {(stats.totalSetoran / 1000000).toFixed(1)}M
                  </Text>
                  <Text style={styles.statLabel}>Total Setoran</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        </View>

        <View style={styles.statsContainer}>
          <Card style={[styles.statCard, { backgroundColor: '#f59e0b' }]}>
            <Card.Content>
              <View style={styles.statContent}>
                <Ionicons name="calendar" size={32} color="white" />
                <View>
                  <Text style={styles.statNumber}>
                    Rp {(stats.setoranBulanIni / 1000000).toFixed(1)}M
                  </Text>
                  <Text style={styles.statLabel}>Bulan Ini</Text>
                </View>
              </View>
            </Card.Content>
          </Card>

          <Card style={[styles.statCard, { backgroundColor: '#ef4444' }]}>
            <Card.Content>
              <View style={styles.statContent}>
                <Ionicons name="warning" size={32} color="white" />
                <View>
                  <Text style={styles.statNumber}>{stats.tunggakan}</Text>
                  <Text style={styles.statLabel}>Tunggakan</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        </View>

        {/* Charts */}
        <Card style={styles.chartCard}>
          <Card.Content>
            <Text style={styles.chartTitle}>Trend Setoran Bulanan</Text>
            <LineChart
              data={chartData}
              width={screenWidth - 60}
              height={200}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(55, 65, 81, ${opacity})`,
                style: { borderRadius: 16 },
                propsForDots: {
                  r: '4',
                  strokeWidth: '2',
                  stroke: '#22c55e',
                },
              }}
              bezier
              style={styles.chart}
            />
          </Card.Content>
        </Card>

        <Card style={styles.chartCard}>
          <Card.Content>
            <Text style={styles.chartTitle}>Status Pembayaran</Text>
            <PieChart
              data={pieData}
              width={screenWidth - 60}
              height={200}
              chartConfig={{
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </Card.Content>
        </Card>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/peserta')}
          >
            <Ionicons name="people" size={24} color="#3b82f6" />
            <Text style={styles.actionText}>Peserta</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/setoran')}
          >
            <Ionicons name="wallet" size={24} color="#22c55e" />
            <Text style={styles.actionText}>Setoran</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleDrawLottery}
          >
            <Ionicons name="trophy" size={24} color="#f59e0b" />
            <Text style={styles.actionText}>Undian</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/laporan')}
          >
            <Ionicons name="document-text" size={24} color="#8b5cf6" />
            <Text style={styles.actionText}>Laporan</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Winner */}
        <Card style={styles.winnerCard}>
          <Card.Content>
            <View style={styles.winnerContent}>
              <Ionicons name="trophy" size={32} color="#f59e0b" />
              <View style={styles.winnerInfo}>
                <Text style={styles.winnerTitle}>Pemenang Terakhir</Text>
                <Text style={styles.winnerName}>{stats.pemenangTerakhir}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Floating Action Button */}
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => router.push('/setoran')}
        label="Tambah Setoran"
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  logoutButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 5,
    elevation: 3,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10,
  },
  statLabel: {
    fontSize: 12,
    color: 'white',
    marginLeft: 10,
    opacity: 0.9,
  },
  chartCard: {
    marginBottom: 20,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1e293b',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    width: '48%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
    elevation: 3,
  },
  actionText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  winnerCard: {
    marginBottom: 20,
    elevation: 3,
  },
  winnerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  winnerInfo: {
    marginLeft: 15,
  },
  winnerTitle: {
    fontSize: 14,
    color: '#64748b',
  },
  winnerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 2,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#3b82f6',
  },
});
