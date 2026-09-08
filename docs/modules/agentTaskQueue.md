# Modul: Agent Task Queue & Offline Worker

## Deskripsi
Modul manajemen antrean latar belakang (background queueing) yang memungkinkan agen AI menjalankan tugas berat (seperti audit OSV atau refactoring massal) secara asinkron tanpa memblokir thread UI. Dilengkapi dengan dukungan Luring (Offline Worker).

## Komponen & Fitur
1. **Offline Worker**: Antrean tugas khusus yang mencadangkan permintaan jaringan (contoh: pembuatan PR) saat perangkat kehilangan koneksi internet. Saat perangkat online, *worker* akan merehidrasi antrean dan melakukan push.
2. **OfflineSyncPanel**: UI interaktif untuk memonitor tugas yang tertunda (pending queue) serta kontrol force-sync ke GitHub (Draft PR simulation).
3. **Task Queue Engine & Executor**: Pipa eksekusi asinkron memori lokal dengan prioritas eksekusi (priority queuing) dan `executeTaskWithAgent` yang mengeksekusi instruksi langsung ke Copilot AI melalui dispatcher dengan tahapan progres real-time.

## Aturan Arsitektur
- `OfflineWorker` harus selalu memeriksa `navigator.onLine` dan mengandalkan `EventBus` (`core/dispatcher.ts`) untuk berkomunikasi dengan UI, menghindari dependensi siklikal.
- Storage berbasis Key-Value cache lokal (Local Storage) yang membungkus semua interaksi file I/O dengan blok `try-catch` aman.

## Ruang Improvement
- Migrasi penyimpanan antrean dari `localStorage` ke `IndexDB` agar dapat mendukung sinkronisasi data yang ukurannya masif (misal diff ratusan file atau base64 gambar).
