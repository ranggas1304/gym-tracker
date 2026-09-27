import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Jadwal bawaan awal
const jadwalBawaan = {
  Senin: [
    { id: '1', nama: 'Bench press 4x6-8', selesai: false },
    { id: '2', nama: 'Incline dumbbell press 4x8-10', selesai: false },
    { id: '3', nama: 'Chest press machine 3x10-12', selesai: false },
    { id: '4', nama: 'Shoulder press 3x8-10', selesai: false },
    { id: '5', nama: 'Lateral raise 4x12-15', selesai: false },
    { id: '6', nama: 'Rope down 4x12', selesai: false },
    { id: '7', nama: 'Overhead extension 3x12', selesai: false },
    { id: '8', nama: 'Walk 1 jam', selesai: false }
  ],
  Selasa: [
    { id: '9', nama: 'Lat pulldown 4x8-12', selesai: false },
    { id: '10', nama: 'Barbell row 4x8', selesai: false },
    { id: '11', nama: 'Cable row 3x10', selesai: false },
    { id: '12', nama: 'Facepull 4x15', selesai: false },
    { id: '13', nama: 'Barbell curl 4x10', selesai: false },
    { id: '14', nama: 'Hammer curl 3x12', selesai: false },
    { id: '15', nama: 'Walk 30 menit', selesai: false }
  ],
  Rabu: [
    { id: '16', nama: 'Squat 4x6-8', selesai: false },
    { id: '17', nama: 'Romanian deadlift 4x8', selesai: false },
    { id: '18', nama: 'Leg press 4x10', selesai: false },
    { id: '19', nama: 'Leg extension 3x15', selesai: false },
    { id: '20', nama: 'Leg curl 3x15', selesai: false },
    { id: '21', nama: 'Calf raise 5x15', selesai: false },
    { id: '22', nama: 'Walk 30 menit', selesai: false }
  ],
  Kamis: [
    { id: '23', nama: 'Bench press 5x5', selesai: false },
    { id: '24', nama: 'Lat pull down 5x5', selesai: false },
    { id: '25', nama: 'Dumbbell shoulder press 4x8', selesai: false },
    { id: '26', nama: 'Rowing 4x8', selesai: false },
    { id: '27', nama: 'Lateral raise 3x15', selesai: false },
    { id: '28', nama: 'Cable curl 3x15', selesai: false },
    { id: '29', nama: 'Push down 3x15', selesai: false },
    { id: '30', nama: 'Bike 15 menit', selesai: false },
    { id: '31', nama: 'Interval: 30dtk sprint, 90dtk jalan (10x)', selesai: false }
  ],
  Jumat: [
    { id: '32', nama: 'Deadlift 3x5', selesai: false },
    { id: '33', nama: 'Front squat 4x6', selesai: false },
    { id: '34', nama: 'Bulgarian split squat 3x10', selesai: false },
    { id: '35', nama: 'Leg curl 3x15', selesai: false },
    { id: '36', nama: 'Calf raise 5x15', selesai: false },
    { id: '37', nama: 'Walk 40 menit', selesai: false }
  ],
  Sabtu: [
    { id: '38', nama: 'Lateral raise 5x10', selesai: false },
    { id: '39', nama: 'Rear delt fly 4x15', selesai: false },
    { id: '40', nama: 'EZ curl 4x10', selesai: false },
    { id: '41', nama: 'Preacher curl 3x12', selesai: false },
    { id: '42', nama: 'Skull crusher 4x10', selesai: false },
    { id: '43', nama: 'Rope pushdown 3x15', selesai: false },
    { id: '44', nama: 'Jogging 1 jam', selesai: false }
  ],
  Minggu: [
    { id: '45', nama: 'Rest Day (Istirahat Penuh)', selesai: false }
  ]
};

export default function App() {
  const [isReady, setIsReady] = useState(false);

  const [namaMakanan, setNamaMakanan] = useState('');
  const [kaloriInput, setKaloriInput] = useState('');
  const [riwayatKalori, setRiwayatKalori] = useState([]);
  
  const daftarHari = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
  const [hariAktif, setHariAktif] = useState('Senin');
  const [inputLatihanBaru, setInputLatihanBaru] = useState('');
  const [jadwalLatihan, setJadwalLatihan] = useState(jadwalBawaan);

  // Memuat data dari memori HP saat aplikasi dibuka
  useEffect(() => {
    const muatData = async () => {
      try {
        const date = new Date();
        const tanggalHariIni = date.toLocaleDateString();
        const indexHari = date.getDay() === 0 ? 6 : date.getDay() - 1;
        setHariAktif(daftarHari[indexHari]);

        const tanggalTersimpan = await AsyncStorage.getItem('@tanggal_terakhir');
        const jadwalTersimpan = await AsyncStorage.getItem('@jadwal_latihan');
        const kaloriTersimpan = await AsyncStorage.getItem('@riwayat_kalori');

        let jadwalBerjalan = jadwalTersimpan ? JSON.parse(jadwalTersimpan) : jadwalBawaan;

        if (tanggalTersimpan !== tanggalHariIni) {
          Object.keys(jadwalBerjalan).forEach((hari) => {
            jadwalBerjalan[hari] = jadwalBerjalan[hari].map(latihan => ({ ...latihan, selesai: false }));
          });
          
          setJadwalLatihan(jadwalBerjalan);
          setRiwayatKalori([]);
          await AsyncStorage.setItem('@tanggal_terakhir', tanggalHariIni);
        } else {
          setJadwalLatihan(jadwalBerjalan);
          if (kaloriTersimpan) setRiwayatKalori(JSON.parse(kaloriTersimpan));
        }
      } catch (error) {
        console.error("Gagal memuat data", error);
      } finally {
        setIsReady(true);
      }
    };

    muatData();
  }, []);

  // Auto-save data latihan
  useEffect(() => {
    if (isReady) {
      AsyncStorage.setItem('@jadwal_latihan', JSON.stringify(jadwalLatihan));
    }
  }, [jadwalLatihan, isReady]);

  // Auto-save data kalori
  useEffect(() => {
    if (isReady) {
      AsyncStorage.setItem('@riwayat_kalori', JSON.stringify(riwayatKalori));
    }
  }, [riwayatKalori, isReady]);

  const tambahLatihan = () => {
    if (!inputLatihanBaru) return;
    const tugasBaru = { id: Date.now().toString(), nama: inputLatihanBaru, selesai: false };
    setJadwalLatihan({ ...jadwalLatihan, [hariAktif]: [...jadwalLatihan[hariAktif], tugasBaru] });
    setInputLatihanBaru('');
  };

  const hapusLatihan = (idYangDihapus) => {
    setJadwalLatihan({ ...jadwalLatihan, [hariAktif]: jadwalLatihan[hariAktif].filter((item) => item.id !== idYangDihapus) });
  };

  const toggleSelesai = (idTugas) => {
    setJadwalLatihan({ ...jadwalLatihan, [hariAktif]: jadwalLatihan[hariAktif].map((item) => item.id === idTugas ? { ...item, selesai: !item.selesai } : item) });
  };

  const tambahKalori = () => {
    if (!kaloriInput || isNaN(kaloriInput)) {
      alert('Masukkan jumlah kalori berupa angka!');
      return;
    }
    const entriBaru = {
      id: Date.now().toString(),
      makanan: namaMakanan || 'Makan/Minum',
      kalori: parseInt(kaloriInput, 10),
      waktu: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setRiwayatKalori([...riwayatKalori, entriBaru]);
    setNamaMakanan('');
    setKaloriInput('');
  };

  const hapusKalori = (idYangDihapus) => {
    setRiwayatKalori(riwayatKalori.filter((item) => item.id !== idYangDihapus));
  };

  const totalKalori = riwayatKalori.reduce((total, item) => total + item.kalori, 0);

  if (!isReady) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#007aff" />
        <Text style={{marginTop: 10, color: '#8e8e93'}}>Memuat data kamu...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll}>
        <Text style={styles.header}>Tracker Latihan</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Jadwal Latihan Mingguan</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daysWrapper}>
            {daftarHari.map((hari) => (
              <TouchableOpacity key={hari} style={[styles.dayTab, hariAktif === hari && styles.dayTabActive]} onPress={() => setHariAktif(hari)}>
                <Text style={[styles.dayText, hariAktif === hari && styles.dayTextActive]}>{hari}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.divider} />
          <Text style={styles.subtitle}>To-Do List: {hariAktif}</Text>

          {jadwalLatihan[hariAktif].length > 0 ? (
            jadwalLatihan[hariAktif].map((latihan) => (
              <View key={latihan.id} style={[styles.checklistItem, latihan.selesai && styles.checklistItemDone]}>
                <TouchableOpacity style={styles.checkboxWrapper} onPress={() => toggleSelesai(latihan.id)}>
                  <View style={[styles.checkbox, latihan.selesai && styles.checkboxDone]}>
                    {latihan.selesai && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={[styles.checklistTitle, latihan.selesai && styles.textDone]}>{latihan.nama}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => hapusLatihan(latihan.id)} style={styles.deleteTaskBtn}>
                  <Text style={styles.deleteText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>Belum ada jadwal untuk hari ini.</Text>
          )}

          <View style={[styles.inputRow, {marginTop: 10}]}>
            <TextInput style={[styles.input, {flex: 1, marginRight: 10, marginBottom: 0}]} placeholder="Tambah jadwal baru..." value={inputLatihanBaru} onChangeText={setInputLatihanBaru} />
            <TouchableOpacity style={styles.addButton} onPress={tambahLatihan}>
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Asupan Kalori Harian</Text>
          <View style={styles.inputRow}>
            <TextInput style={[styles.input, {flex: 2, marginRight: 10, marginBottom: 0}]} placeholder="Nama Makanan" value={namaMakanan} onChangeText={setNamaMakanan} />
            <TextInput style={[styles.input, {flex: 1, marginBottom: 0}]} placeholder="Kalori" keyboardType="numeric" value={kaloriInput} onChangeText={setKaloriInput} />
          </View>
          <TouchableOpacity style={[styles.addButton, {width: '100%', marginTop: 10}]} onPress={tambahKalori}>
            <Text style={styles.buttonText}>Tambah Makanan</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <Text style={styles.totalText}>Total Hari Ini: {totalKalori} kcal</Text>
          {riwayatKalori.length > 0 ? (
            <View style={styles.historyContainer}>
              {riwayatKalori.map((item) => (
                <View key={item.id} style={styles.historyItem}>
                  <View style={{flex: 1}}>
                    <Text style={styles.foodName}>{item.makanan}</Text>
                    <Text style={styles.timeText}>{item.waktu}</Text>
                  </View>
                  <View style={styles.rightSide}>
                    <Text style={styles.calorieValue}>+{item.kalori}</Text>
                    <TouchableOpacity style={styles.deleteBtn} onPress={() => hapusKalori(item.id)}>
                      <Text style={styles.deleteText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>Belum ada makanan yang dicatat hari ini.</Text>
          )}
        </View>
        <View style={{height: 40}}/>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f7' },
  scroll: { padding: 20, paddingTop: 40 },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, color: '#1c1c1e' },
  card: { backgroundColor: 'white', padding: 20, borderRadius: 15, marginBottom: 15, shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  cardTitle: { fontSize: 18, fontWeight: '600', color: '#000', marginBottom: 10 },
  subtitle: { color: '#8e8e93', marginBottom: 15, fontSize: 14, fontWeight: '600' },
  daysWrapper: { flexDirection: 'row', marginBottom: 5 },
  dayTab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f2f2f7', marginRight: 8 },
  dayTabActive: { backgroundColor: '#007aff' },
  dayText: { color: '#8e8e93', fontWeight: '600' },
  dayTextActive: { color: 'white' },
  checklistItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fafafa', padding: 12, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#e5e5ea' },
  checklistItemDone: { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' },
  checkboxWrapper: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  checkbox: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#d1d1d6', marginRight: 15, justifyContent: 'center', alignItems: 'center' },
  checkboxDone: { backgroundColor: '#34c759', borderColor: '#34c759' },
  checkmark: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  checklistTitle: { fontSize: 15, fontWeight: '600', color: '#1c1c1e', flexShrink: 1 },
  textDone: { color: '#9ca3af', textDecorationLine: 'line-through' },
  deleteTaskBtn: { padding: 8 },
  inputRow: { flexDirection: 'row' },
  input: { borderWidth: 1, borderColor: '#e5e5ea', padding: 12, borderRadius: 10, backgroundColor: '#fafafa', fontSize: 15 },
  addButton: { backgroundColor: '#34c759', padding: 12, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  divider: { height: 1, backgroundColor: '#e5e5ea', marginVertical: 15 },
  totalText: { fontSize: 20, fontWeight: 'bold', color: '#1c1c1e', marginBottom: 10 },
  historyContainer: { marginTop: 5 },
  historyItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f2f2f7' },
  foodName: { fontSize: 16, fontWeight: '500' },
  timeText: { fontSize: 12, color: '#8e8e93', marginTop: 2 },
  rightSide: { flexDirection: 'row', alignItems: 'center' },
  calorieValue: { fontSize: 16, fontWeight: 'bold', color: '#1c1c1e' },
  deleteBtn: { marginLeft: 12, paddingVertical: 6, paddingHorizontal: 10, backgroundColor: '#ffe5e5', borderRadius: 8 },
  deleteText: { color: '#ff3b30', fontWeight: 'bold', fontSize: 14 },
  emptyText: { color: '#8e8e93', fontStyle: 'italic', textAlign: 'center', marginTop: 10, marginBottom: 10 }
});