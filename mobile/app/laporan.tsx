import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  Card,
  Button,
  SegmentedButtons,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

export default function LaporanScreen() {
  const [activeTab, setActiveTab] = useState<'ringkasan' | 'setoran' | 'tunggakan'>('ringkasan');
  const [selectedPeriod, setSelectedPeriod] = useState('bulan');

  // Sample data
  const ringkasanData = {
    totalPeserta: 24,
    totalSetoran: 12500000,
    totalTunggakan: 300000,
    persentaseKehadiran: 87,
    pemenangTerakhir: 'Ibu Sari',
  };

  const setoranBulanan = [
    { month: 'Jan', setoran: 2400000 },
    { month: 'Feb', setoran: 2200000 },
    { month: 'Mar', setoran: 2500000 },
    { month: 'Apr', setoran: 2300000 },
    { month: 'Mei', setoran: 2600000 },
    { month: 'Jun', setoran: 2400000 },
  ];

  const tunggakanData = [
    { name: 'Lunas', jumlah: 21, color: '#22c55e' },
    { name: 'Tunggakan', jumlah: 3, color: '#ef4444' },
  ];

  const chartData = {
    labels: setoranBulanan.map(item => item.month),
    datasets: [
      {
        data: setoranBulanan.map(item => item.setoran / 1000000),
        color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const pieData = tunggakanData.map(item => ({
    name: item.name,
    population: item.jumlah,
    color: item.color,
    legendFontColor: '#374151',
    legendFontSize: 12,
  }));

  const handleExport = () => {
    // Implement export functionality
    Alert.alert('Export', 'Fitur export akan segera tersedia');
  };

  const handleShare = () => {
    // Implement share functionality
    Alert.alert('Share', 'Fitur share akan segera tersedia');
  };

  const renderRingkasan = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.statsGrid}>
        <Card style={styles.statCard}>
          <Card.Content>
            <View style={styles.statRow}>
              <Ionicons name="people" size={24} color="#3b82f6" />
              <View style={styles.statContent}>
                <Text style={styles.statNumber}>{ringkasanData.totalPeserta}</Text>
                <Text style={styles.statLabel}>Total Peserta</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content>
            <View style={styles.statRow}>
              <Ionicons name="wallet" size={24} color="#22c55e" />
              <View style={styles.statContent}>
                <Text style={styles.statNumber}>
                  Rp {(ringkasanData.totalSetoran / 1000000).toFixed(1)}M
                </Text>
                <Text style={styles.statLabel}>Total Setoran</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content>
            <View style={styles.statRow}>
              <Ionicons name="warning" size={24} color="#ef4444" />
              <View style={styles.statContent}>
                <Text style={styles.statNumber}>
                  Rp {(ringkasanData.totalTunggakan / 1000).toFixed(0)}K
                </Text>
                <Text style={styles.statLabel}>Total Tunggakan</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content>
            <View style={styles.statRow}>
              <Ionicons name="checkmark-circle" size={24} color="#8b5cf6" />
              <View style={styles.statContent}>
                <Text style={styles.statNumber}>{ringkasanData.persentaseKehadiran}%</Text>
                <Text style={styles.statLabel}>Kehadiran</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </View>

      <Card style={styles.chartCard}>
        <Card.Title title="Pemenang Terakhir" />
        <Card.Content>
          <View style={styles.winnerContainer}>
            <Ionicons name="trophy" size={48} color="#f59e0b" />
            <Text style={styles.winnerName}>{ringkasanData.pemenangTerakhir}</Text>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.chartCard}>
        <Card.Title title="Status Pembayaran" />
        <Card.Content>
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
    </ScrollView>
  );

  const renderSetoran = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Card style={styles.chartCard}>
        <Card.Title title="Grafik Setoran Bulanan" />
        <Card.Content>
          <BarChart
            data={chartData}
            width={screenWidth - 60}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(55, 65, 81, ${opacity})`,
              style: { borderRadius: 16 },
              propsForBackgroundLines: {
                strokeDasharray: '',
              },
            }}
            style={styles.chart}
            fromZero
          />
        </Card.Content>
      </Card>

      <Card style={styles.summaryCard}>
        <Card.Title title="Ringkasan Setoran" />
        <Card.Content>
          {setoranBulanan.map((item, index) => (
            <View key={index} style={styles.summaryRow}>
              <Text style={styles.summaryMonth}>{item.month}</Text>
              <Text style={styles.summaryAmount}>
                Rp {item.setoran.toLocaleString()}
              </Text>
            </View>
          ))}
        </Card.Content>
      </Card>
    </ScrollView>
  );

  const renderTunggakan = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Card style={styles.chartCard}>
        <Card.Title title="Daftar Tunggakan" />
        <Card.Content>
          <View style={styles.tunggakanList}>
            <View style={styles.tunggakanItem}>
              <Text style={styles.tunggakanName}>Pak Budi</Text>
              <Text style={styles.tunggakanAmount}>Rp 100.000</Text>
            </View>
            <View style={styles.tunggakanItem}>
              <Text style={styles.tunggakanName}>Ibu Dewi</Text>
              <Text style={styles.tunggakanAmount}>Rp 100.000</Text>
            </View>
            <View style={styles.tunggakanItem}>
              <Text style={styles.tunggakanName}>Pak Ahmad</Text>
              <Text style={styles.tunggakanAmount}>Rp 100.000</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.chartCard}>
        <Card.Title title="Analisis Tunggakan" />
        <Card.Content>
          <View style={styles.analysisRow}>
            <Text style={styles.analysisLabel}>Total Tunggakan:</Text>
            <Text style={styles.analysisValue}>Rp 300.000</Text>
          </View>
          <View style={styles.analysisRow}>
            <Text style={styles.analysisLabel}>Jumlah Peserta:</Text>
            <Text style={styles.analysisValue}>3 peserta</Text>
          </View>
          <View style={styles.analysisRow}>
            <Text style={styles.analysisLabel}>Persentase:</Text>
            <Text style={styles.analysisValue}>12.5%</Text>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Laporan</Text>
        <Text style={styles.subtitle}>Analisis dan laporan arisan</Text>
      </View>

      <SegmentedButtons
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as any)}
        buttons={[
          { value: 'ringkasan', label: 'Ringkasan' },
          { value: 'setoran', label: 'Setoran' },
          { value: 'tunggakan', label: 'Tunggakan' },
        ]}
        style={styles.segmentedButtons}
      />

      <View style={styles.content}>
        {activeTab === 'ringkasan' && renderRingkasan()}
        {activeTab === 'setoran' && renderSetoran()}
        {activeTab === 'tunggakan' && renderTunggakan()}
      </View>

      <View style={styles.actionButtons}>
        <Button
          mode="outlined"
          onPress={handleExport}
          icon="download"
          style={styles.actionButton}
        >
          Export
        </Button>
        <Button
          mode="outlined"
          onPress={handleShare}
          icon="share"
          style={styles.actionButton}
        >
          Share
        </Button>
      </View>
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
  segmentedButtons: {
    margin: 20,
  },
  content: {
    flex: 1,
  },
  statsGrid: {
    padding: 20,
  },
  statCard: {
    marginBottom: 12,
    elevation: 2,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statContent: {
    marginLeft: 12,
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  chartCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    elevation: 2,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  winnerContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  winnerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f59e0b',
    marginTop: 8,
  },
  summaryCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  summaryMonth: {
    fontSize: 14,
    color: '#64748b',
  },
  summaryAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  tunggakanList: {
    paddingVertical: 8,
  },
  tunggakanItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tunggakanName: {
    fontSize: 14,
    color: '#1e293b',
  },
  tunggakanAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ef4444',
  },
  analysisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  analysisLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  analysisValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  actionButton: {
    flex: 0.45,
  },
});
