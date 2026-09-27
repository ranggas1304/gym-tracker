import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, Modal, Alert, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Kalori States
  const [namaMakanan, setNamaMakanan] = useState('');
  const [kaloriInput, setKaloriInput] = useState('');
  const [riwayatKalori, setRiwayatKalori] = useState([]);
  const [targetKalori, setTargetKalori] = useState(2500);
  const [modalVisible, setModalVisible] = useState(false);
  const [inputTargetBaru, setInputTargetBaru] = useState('');

  // Air Putih States
  const [gelasAir, setGelasAir] = useState(0);
  const targetAirGelas = 8;

  // Berat Badan States
  const [beratInput, setBeratInput] = useState('');
  const [riwayatBerat, setRiwayatBerat] = useState([]);

  // Jadwal Latihan States
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
        const targetTersimpan = await AsyncStorage.getItem('@target_kalori');
        const airTersimpan = await AsyncStorage.getItem('@jumlah_air');
        const beratTersimpan = await AsyncStorage.getItem('@riwayat_berat');
        const darkModeTersimpan = await AsyncStorage.getItem('@dark_mode');

        let jadwalBerjalan = jadwalTersimpan ? JSON.parse(jadwalTersimpan) : jadwalBawaan;

        if (targetTersimpan) setTargetKalori(parseInt(targetTersimpan, 10));
        if (airTersimpan) setGelasAir(parseInt(airTersimpan, 10));
        if (beratTersimpan) setRiwayatBerat(JSON.parse(beratTersimpan));
        if (darkModeTersimpan !== null) setIsDarkMode(JSON.parse(darkModeTersimpan));

        if (tanggalTersimpan !== tanggalHariIni) {
          Object.keys(jadwalBerjalan).forEach((hari) => {
            jadwalBerjalan[hari] = jadwalBerjalan[hari].map(latihan => ({ ...latihan, selesai: false }));
          });
          
          setJadwalLatihan(jadwalBerjalan);
          setRiwayatKalori([]);
          setGelasAir(0);
          await AsyncStorage.setItem('@tanggal_terakhir', tanggalHariIni);
          await AsyncStorage.setItem('@jumlah_air', '0');
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

  // Auto-save data
  useEffect(() => { if (isReady) AsyncStorage.setItem('@jadwal_latihan', JSON.stringify(jadwalLatihan)); }, [jadwalLatihan, isReady]);
  useEffect(() => { if (isReady) AsyncStorage.setItem('@riwayat_kalori', JSON.stringify(riwayatKalori)); }, [riwayatKalori, isReady]);
  useEffect(() => { if (isReady) AsyncStorage.setItem('@jumlah_air', gelasAir.toString()); }, [gelasAir, isReady]);
  useEffect(() => { if (isReady) AsyncStorage.setItem('@riwayat_berat', JSON.stringify(riwayatBerat)); }, [riwayatBerat, isReady]);
  useEffect(() => { if (isReady) AsyncStorage.setItem('@dark_mode', JSON.stringify(isDarkMode)); }, [isDarkMode, isReady]);

  const simpanTargetBaru = async () => {
    const angkaTarget = parseInt(inputTargetBaru, 10);
    if (!angkaTarget || isNaN(angkaTarget)) {
      alert('Masukkan target kalori yang valid!');
      return;
    }
    setTargetKalori(angkaTarget);
    await AsyncStorage.setItem('@target_kalori', angkaTarget.toString());
    setInputTargetBaru('');
    setModalVisible(false);
  };

  const hapusSemuaBerat = () => {
    Alert.alert('Konfirmasi', 'Hapus semua riwayat berat badan?', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Hapus Semua', style: 'destructive', onPress: () => setRiwayatBerat([]) }
    ]);
  };

  const hapusSemuaKalori = () => {
    Alert.alert('Konfirmasi', 'Hapus semua riwayat makanan hari ini?', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Hapus Semua', style: 'destructive', onPress: () => setRiwayatKalori([]) }
    ]);
  };

  const resetAir = () => {
    setGelasAir(0);
  };

  const resetLatihanHariIni = () => {
    Alert.alert('Konfirmasi', `Reset centang latihan hari ${hariAktif}?`, [
      { text: 'Batal', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: () => {
        setJadwalLatihan({
          ...jadwalLatihan,
          [hariAktif]: jadwalLatihan[hariAktif].map(item => ({ ...item, selesai: false }))
        });
      }}
    ]);
  };

  const tambahBeratBadan = () => {
    const formattedInput = beratInput.replace(',', '.');
    const beratAngka = parseFloat(formattedInput);

    if (!beratAngka || isNaN(beratAngka)) {
      alert('Masukkan angka berat badan yang valid (contoh: 65.5)');
      return;
    }
    const entriBeratBaru = {
      id: Date.now().toString(),
      berat: beratAngka,
      tanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    };
    setRiwayatBerat([entriBeratBaru, ...riwayatBerat]);
    setBeratInput('');
  };

  const hapusBeratBadan = (idDihapus) => {
    setRiwayatBerat(riwayatBerat.filter(item => item.id !== idDihapus));
  };

  const tambahAir = () => setGelasAir(gelasAir + 1);
  const kurangAir = () => { if (gelasAir > 0) setGelasAir(gelasAir - 1); };

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
  const sisaKalori = targetKalori - totalKalori;
  const persentaseProgressKalori = Math.min((totalKalori / targetKalori) * 100, 100);
  const persentaseProgressAir = Math.min((gelasAir / targetAirGelas) * 100, 100);

  // Perhitungan Statistik Mingguan
  let totalSemuaLatihan = 0;
  let totalLatihanSelesai = 0;
  Object.keys(jadwalLatihan).forEach((hari) => {
    totalSemuaLatihan += jadwalLatihan[hari].length;
    totalLatihanSelesai += jadwalLatihan[hari].filter(item => item.selesai).length;
  });
  const persentaseWorkoutMingguan = totalSemuaLatihan > 0 ? Math.round((totalLatihanSelesai / totalSemuaLatihan) * 100) : 0;

  if (!isReady) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: isDarkMode ? '#000' : '#f2f2f7' }]}>
        <ActivityIndicator size="large" color="#007aff" />
        <Text style={{marginTop: 10, color: '#8e8e93'}}>Memuat data kamu...</Text>
      </View>
    );
  }

  // Dinamis Style berdasarkan Mode Aktif
  const themeContainer = { backgroundColor: isDarkMode ? '#000000' : '#f2f2f7' };
  const themeCard = { backgroundColor: isDarkMode ? '#1c1c1e' : '#ffffff' };
  const themeTextMain = { color: isDarkMode ? '#ffffff' : '#1c1c1e' };
  const themeInput = { backgroundColor: isDarkMode ? '#2c2c2e' : '#fafafa', color: isDarkMode ? '#ffffff' : '#1c1c1e', borderColor: isDarkMode ? '#3a3a3c' : '#e5e5ea' };
  const themeSubCard = { backgroundColor: isDarkMode ? '#2c2c2e' : '#fafafa', borderColor: isDarkMode ? '#3a3a3c' : '#e5e5ea' };
  const themeDayTab = { backgroundColor: isDarkMode ? '#2c2c2e' : '#f2f2f7' };
  const themeDayText = { color: isDarkMode ? '#aeaeb2' : '#8e8e93' };

  return (
    <SafeAreaView style={[styles.container, themeContainer]}>
      <ScrollView style={styles.scroll}>
        
        {/* HEADER & TOGGLE DARK MODE */}
        <View style={styles.headerRow}>
          <Text style={[styles.header, themeTextMain]}>Tracker Latihan</Text>
          <View style={styles.darkModeToggleContainer}>
            <Text style={[styles.darkModeLabel, {color: isDarkMode ? '#aeaeb2' : '#8e8e93'}]}>{isDarkMode ? '🌙 Dark' : '☀️ Light'}</Text>
            <Switch
              value={isDarkMode}
              onValueChange={(val) => setIsDarkMode(val)}
              trackColor={{ false: '#d1d1d6', true: '#007aff' }}
              thumbColor={'#ffffff'}
            />
          </View>
        </View>

        {/* KARTU STATISTIK MINGGUAN */}
        <View style={[styles.cardStatistik, isDarkMode && {backgroundColor: '#1c1c1e', borderWidth: 1, borderColor: '#3a3a3c'}]}>
          <Text style={styles.statCardTitle}>Ringkasan Minggu Ini</Text>
          <View style={styles.statRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{totalLatihanSelesai}/{totalSemuaLatihan}</Text>
              <Text style={styles.statLabel}>Latihan Selesai</Text>
            </View>
            <View style={styles.statDividerVertical} />
            <View style={styles.statBox}>
              <Text style={[styles.statValue, {color: '#007aff'}]}>{persentaseWorkoutMingguan}%</Text>
              <Text style={styles.statLabel}>Proses Mingguan</Text>
            </View>
          </View>
        </View>

        {/* KARTU BERAT BADAN */}
        <View style={[styles.card, themeCard]}>
          <View style={styles.calorieHeaderRow}>
            <Text style={[styles.cardTitle, themeTextMain]}>Catatan Berat Badan</Text>
            {riwayatBerat.length > 0 && (
              <TouchableOpacity onPress={hapusSemuaBerat}>
                <Text style={styles.textHapusSemua}>Hapus Semua</Text>
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.subtitle}>Pantau progres bulking atau cutting rutinmu.</Text>

          <View style={styles.inputRow}>
            <TextInput 
              style={[styles.input, themeInput, {flex: 1, marginRight: 10, marginBottom: 0}]} 
              placeholder="Berat (kg, contoh: 65.5)" 
              placeholderTextColor={isDarkMode ? '#636366' : '#9ca3af'}
              keyboardType="decimal-pad" 
              value={beratInput} 
              onChangeText={setBeratInput} 
            />
            <TouchableOpacity style={styles.addButton} onPress={tambahBeratBadan}>
              <Text style={styles.buttonText}>Catat</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.divider, isDarkMode && {backgroundColor: '#3a3a3c'}]} />

          {riwayatBerat.length > 0 ? (
            <View style={styles.historyContainer}>
              {riwayatBerat.map((item, index) => {
                let selisihTeks = null;
                if (index < riwayatBerat.length - 1) {
                  const selisih = item.berat - riwayatBerat[index + 1].berat;
                  if (selisih !== 0) {
                    const tanda = selisih > 0 ? '+' : '';
                    selisihTeks = `${tanda}${selisih.toFixed(1)} kg`;
                  }
                }
                return (
                  <View key={item.id} style={[styles.historyItem, isDarkMode && {borderBottomColor: '#2c2c2e'}]}>
                    <View style={{flex: 1}}>
                      <Text style={[styles.foodName, themeTextMain]}>{item.berat.toFixed(1)} kg</Text>
                      <Text style={styles.timeText}>{item.tanggal}</Text>
                    </View>
                    <View style={styles.rightSide}>
                      {selisihTeks && (
                        <Text style={[styles.selisihBadge, {color: selisihTeks.startsWith('+') ? '#ff453a' : '#32d74b'}]}>
                          {selisihTeks}
                        </Text>
                      )}
                      <TouchableOpacity style={styles.deleteBtn} onPress={() => hapusBeratBadan(item.id)}>
                        <Text style={styles.deleteText}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          ) : (
            <Text style={styles.emptyText}>Belum ada riwayat berat badan yang dicatat.</Text>
          )}
        </View>

        {/* KARTU ASUPAN & TARGET KALORI */}
        <View style={[styles.card, themeCard]}>
          <View style={styles.calorieHeaderRow}>
            <Text style={[styles.cardTitle, themeTextMain]}>Asupan Kalori Harian</Text>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={[styles.targetButton, isDarkMode && {backgroundColor: '#1a2634'}]}>
              <Text style={styles.targetButtonText}>Target: {targetKalori}</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.progressContainer, themeSubCard]}>
            <View style={styles.progressInfo}>
              <Text style={[styles.progressText, themeTextMain]}>Terkumpul: <Text style={{fontWeight: 'bold'}}>{totalKalori}</Text></Text>
              <Text style={[styles.progressText, themeTextMain]}>Sisa: <Text style={{fontWeight: 'bold', color: sisaKalori < 0 ? '#ff453a' : '#32d74b'}}>{sisaKalori}</Text></Text>
            </View>
            <View style={[styles.progressBarBackground, isDarkMode && {backgroundColor: '#3a3a3c'}]}>
              <View style={[styles.progressBarFill, { width: `${persentaseProgressKalori}%`, backgroundColor: sisaKalori < 0 ? '#ff453a' : '#32d74b' }]} />
            </View>
          </View>

          <View style={styles.inputRow}>
            <TextInput style={[styles.input, themeInput, {flex: 2, marginRight: 10, marginBottom: 0}]} placeholder="Nama Makanan" placeholderTextColor={isDarkMode ? '#636366' : '#9ca3af'} value={namaMakanan} onChangeText={setNamaMakanan} />
            <TextInput style={[styles.input, themeInput, {flex: 1, marginBottom: 0}]} placeholder="Kalori" placeholderTextColor={isDarkMode ? '#636366' : '#9ca3af'} keyboardType="numeric" value={kaloriInput} onChangeText={setKaloriInput} />
          </View>

          <View style={styles.actionRowKalori}>
            <TouchableOpacity style={[styles.addButton, {flex: 2, marginTop: 10}]} onPress={tambahKalori}>
              <Text style={styles.buttonText}>Tambah Makanan</Text>
            </TouchableOpacity>
            {riwayatKalori.length > 0 && (
              <TouchableOpacity style={[styles.hapusSemuaKaloriBtn, isDarkMode && {backgroundColor: '#3a1d1d'}]} onPress={hapusSemuaKalori}>
                <Text style={styles.hapusSemuaKaloriText}>Hapus Semua</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={[styles.divider, isDarkMode && {backgroundColor: '#3a3a3c'}]} />
          
          {riwayatKalori.length > 0 ? (
            <View style={styles.historyContainer}>
              {riwayatKalori.map((item) => (
                <View key={item.id} style={[styles.historyItem, isDarkMode && {borderBottomColor: '#2c2c2e'}]}>
                  <View style={{flex: 1}}>
                    <Text style={[styles.foodName, themeTextMain]}>{item.makanan}</Text>
                    <Text style={styles.timeText}>{item.waktu}</Text>
                  </View>
                  <View style={styles.rightSide}>
                    <Text style={[styles.calorieValue, themeTextMain]}>+{item.kalori}</Text>
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

        {/* KARTU CATATAN AIR PUTIH */}
        <View style={[styles.card, themeCard]}>
          <View style={styles.calorieHeaderRow}>
            <Text style={[styles.cardTitle, themeTextMain]}>Catatan Air Putih</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {gelasAir > 0 && (
                <TouchableOpacity onPress={resetAir} style={{marginRight: 8}}>
                  <Text style={styles.textHapusSemua}>Reset</Text>
                </TouchableOpacity>
              )}
              <View style={[styles.targetButtonAir, isDarkMode && {backgroundColor: '#1b2a32'}]}>
                <Text style={styles.targetButtonTextAir}>Target: {targetAirGelas} Gelas</Text>
              </View>
            </View>
          </View>

          <View style={[styles.progressContainer, themeSubCard]}>
            <View style={styles.progressInfo}>
              <Text style={[styles.progressText, themeTextMain]}>Minum: <Text style={{fontWeight: 'bold'}}>{gelasAir} Gelas</Text></Text>
              <Text style={[styles.progressText, themeTextMain]}>Status: <Text style={{fontWeight: 'bold', color: gelasAir >= targetAirGelas ? '#32d74b' : '#0a84ff'}}>{gelasAir >= targetAirGelas ? 'Target Tercapai! 💧' : 'Kurang ' + (targetAirGelas - gelasAir) + ' gelas'}</Text></Text>
            </View>
            <View style={[styles.progressBarBackground, isDarkMode && {backgroundColor: '#3a3a3c'}]}>
              <View style={[styles.progressBarFill, { width: `${persentaseProgressAir}%`, backgroundColor: '#0a84ff' }]} />
            </View>
          </View>

          <View style={styles.waterButtonRow}>
            <TouchableOpacity style={[styles.waterMinusBtn, isDarkMode && {backgroundColor: '#3a1d1d'}]} onPress={kurangAir}>
              <Text style={styles.waterBtnText}>- 1 Gelas</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.waterPlusBtn} onPress={tambahAir}>
              <Text style={styles.waterBtnTextWhite}>+ 1 Gelas Air</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* KARTU JADWAL LATIHAN */}
        <View style={[styles.card, themeCard]}>
          <View style={styles.calorieHeaderRow}>
            <Text style={[styles.cardTitle, themeTextMain]}>Jadwal Latihan Mingguan</Text>
            <TouchableOpacity onPress={resetLatihanHariIni}>
              <Text style={styles.textHapusSemua}>Reset Hari Ini</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daysWrapper}>
            {daftarHari.map((hari) => (
              <TouchableOpacity key={hari} style={[styles.dayTab, themeDayTab, hariAktif === hari && styles.dayTabActive]} onPress={() => setHariAktif(hari)}>
                <Text style={[styles.dayText, themeDayText, hariAktif === hari && styles.dayTextActive]}>{hari}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={[styles.divider, isDarkMode && {backgroundColor: '#3a3a3c'}]} />
          <Text style={styles.subtitle}>To-Do List: {hariAktif}</Text>

          {jadwalLatihan[hariAktif].length > 0 ? (
            jadwalLatihan[hariAktif].map((latihan) => (
              <View key={latihan.id} style={[styles.checklistItem, isDarkMode ? {backgroundColor: '#2c2c2e', borderColor: '#3a3a3c'} : null, latihan.selesai && (isDarkMode ? {backgroundColor: '#1b3320', borderColor: '#23482d'} : styles.checklistItemDone)]}>
                <TouchableOpacity style={styles.checkboxWrapper} onPress={() => toggleSelesai(latihan.id)}>
                  <View style={[styles.checkbox, isDarkMode && {borderColor: '#636366'}, latihan.selesai && styles.checkboxDone]}>
                    {latihan.selesai && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={[styles.checklistTitle, themeTextMain, latihan.selesai && styles.textDone]}>{latihan.nama}</Text>
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
            <TextInput style={[styles.input, themeInput, {flex: 1, marginRight: 10, marginBottom: 0}]} placeholder="Tambah jadwal baru..." placeholderTextColor={isDarkMode ? '#636366' : '#9ca3af'} value={inputLatihanBaru} onChangeText={setInputLatihanBaru} />
            <TouchableOpacity style={styles.addButton} onPress={tambahLatihan}>
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{height: 40}}/>
      </ScrollView>

      {/* Modal Popup untuk Mengubah Target Kalori */}
      <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDarkMode && {backgroundColor: '#1c1c1e'}]}>
            <Text style={[styles.modalTitle, themeTextMain]}>Atur Target Kalori Harian</Text>
            <TextInput style={[styles.input, themeInput]} placeholder="Contoh: 2500" placeholderTextColor={isDarkMode ? '#636366' : '#9ca3af'} keyboardType="numeric" value={inputTargetBaru} onChangeText={setInputTargetBaru} />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalBtn, {backgroundColor: isDarkMode ? '#2c2c2e' : '#e5e5ea'}]} onPress={() => setModalVisible(false)}>
                <Text style={{color: isDarkMode ? '#fff' : '#000', fontWeight: '600'}}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, {backgroundColor: '#007aff'}]} onPress={simpanTargetBaru}>
                <Text style={{color: '#fff', fontWeight: '600'}}>Simpan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f7' },
  scroll: { padding: 20, paddingTop: 40 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  header: { fontSize: 28, fontWeight: 'bold', color: '#1c1c1e' },
  darkModeToggleContainer: { flexDirection: 'row', alignItems: 'center' },
  darkModeLabel: { marginRight: 8, fontSize: 13, fontWeight: '600' },
  card: { backgroundColor: 'white', padding: 20, borderRadius: 15, marginBottom: 15, shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  cardStatistik: { backgroundColor: '#1c1c1e', padding: 20, borderRadius: 15, marginBottom: 15, shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  statCardTitle: { fontSize: 15, fontWeight: '600', color: '#aeaeb2', marginBottom: 12, textAlign: 'center' },
  statRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  statBox: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 4 },
  statLabel: { fontSize: 13, color: '#8e8e93' },
  statDividerVertical: { width: 1, height: '80%', backgroundColor: '#3a3a3c' },
  cardTitle: { fontSize: 18, fontWeight: '600', color: '#000' },
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
  input: { borderWidth: 1, borderColor: '#e5e5ea', padding: 12, borderRadius: 10, backgroundColor: '#fafafa', fontSize: 15, marginBottom: 10 },
  addButton: { backgroundColor: '#34c759', padding: 12, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  divider: { height: 1, backgroundColor: '#e5e5ea', marginVertical: 15 },
  calorieHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  textHapusSemua: { color: '#ff3b30', fontSize: 13, fontWeight: '600' },
  actionRowKalori: { flexDirection: 'row', alignItems: 'center' },
  hapusSemuaKaloriBtn: { flex: 1, backgroundColor: '#ffe5e5', padding: 12, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginLeft: 10, marginTop: 10 },
  hapusSemuaKaloriText: { color: '#ff3b30', fontWeight: 'bold', fontSize: 14 },
  targetButton: { backgroundColor: '#eef2ff', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  targetButtonText: { color: '#007aff', fontSize: 12, fontWeight: 'bold' },
  targetButtonAir: { backgroundColor: '#e0f2fe', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  targetButtonTextAir: { color: '#0284c7', fontSize: 12, fontWeight: 'bold' },
  progressContainer: { marginBottom: 15, backgroundColor: '#fafafa', padding: 10, borderRadius: 10, borderWidth: 1, borderColor: '#e5e5ea' },
  progressInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressText: { fontSize: 13, color: '#3a3a3c' },
  progressBarBackground: { height: 8, backgroundColor: '#e5e5ea', borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 4 },
  waterButtonRow: { flexDirection: 'row', justifyContent: 'space-between' },
  waterMinusBtn: { flex: 1, backgroundColor: '#ffe5e5', padding: 12, borderRadius: 10, alignItems: 'center', marginRight: 8 },
  waterPlusBtn: { flex: 2, backgroundColor: '#007aff', padding: 12, borderRadius: 10, alignItems: 'center' },
  waterBtnText: { color: '#ff3b30', fontWeight: 'bold', fontSize: 15 },
  waterBtnTextWhite: { color: 'white', fontWeight: 'bold', fontSize: 15 },
  historyContainer: { marginTop: 5 },
  historyItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f2f2f7' },
  foodName: { fontSize: 16, fontWeight: '500' },
  timeText: { fontSize: 12, color: '#8e8e93', marginTop: 2 },
  rightSide: { flexDirection: 'row', alignItems: 'center' },
  selisihBadge: { fontSize: 13, fontWeight: 'bold', marginRight: 8 },
  calorieValue: { fontSize: 16, fontWeight: 'bold', color: '#1c1c1e' },
  deleteBtn: { marginLeft: 12, paddingVertical: 6, paddingHorizontal: 10, backgroundColor: '#ffe5e5', borderRadius: 8 },
  deleteText: { color: '#ff3b30', fontWeight: 'bold', fontSize: 14 },
  emptyText: { color: '#8e8e93', fontStyle: 'italic', textAlign: 'center', marginTop: 10, marginBottom: 10 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '80%', backgroundColor: 'white', padding: 20, borderRadius: 15, shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#1c1c1e' },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 },
  modalBtn: { paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8, marginLeft: 10 }
});