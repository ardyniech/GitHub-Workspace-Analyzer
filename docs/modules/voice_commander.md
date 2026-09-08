# Voice Commander Module

Modul kontrol suara cerdas berbasis mikrofon untuk memicu aksi repositori secara hands-free.

## Fitur Utama
1. **Analisis Repositori (`ANALYZE_REPO`)**:
   - Mendeteksi perintah audit, keamanan, dan review kode.
   - Mengirim instruksi analisis mendalam langsung ke AI Agent Copilot.
2. **Pencarian Berkas (`SEARCH_FILE`)**:
   - Mengekstrak nama berkas atau kata kunci dari ucapan pengguna.
   - Menjalankan pencarian rekursif pada pohon repositori (`gitTreeApi`) dan menyajikan berkas untuk dibuka.
3. **Pembuatan Issue (`CREATE_ISSUE`)**:
   - Menganalisis ucapan pelaporan bug atau permohonan fitur.
   - Mendaftarkan issue baru ke repositori GitHub via `issueApi.createIssue`.
4. **Visualizer Mikrofon Real-Time**:
   - Menggunakan Web Audio API (`AudioContext` & `AnalyserNode`) untuk mengukur RMS volume suara.
   - Transkripsi real-time menggunakan Web Speech API (`SpeechRecognition`).

## Struktur Modul
- `primitives/`:
  - `VoiceCommanderButton.tsx`: Tombol aktivasi di header aplikasi.
  - `VoiceCommanderModal.tsx`: Modal interaktif dengan visualizer dan konfirmasi perintah.
  - `VoiceCommanderVisualizer.tsx`: Visualisasi gelombang dan meter volume mikrofon.
  - `VoiceIntentCard.tsx`: Kartu pratinjau intensi dan daftar hasil pencarian berkas.
- `logic/`:
  - `types.ts`: Definisi antarmuka intent dan status.
  - `intentParser.ts`: Pengurai kalimat alami ke intent terstruktur.
  - `speechRecognition.ts`: Layanan antarmuka Web Speech dan Audio Context.
  - `useVoiceCommander.ts`: Hook orkestrator perintah suara.
- `storage/`:
  - `voiceHistory.ts`: Penyimpanan lokal riwayat perintah suara.
