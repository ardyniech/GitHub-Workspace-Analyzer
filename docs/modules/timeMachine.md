# Modul: Time Machine & Automated Commit Rollback

## Deskripsi
Modul **Time Machine** (`modules/timeMachine`) menyediakan mekanisme pemulihan versi dan pencatatan titik pemulihan (*restore point*) otonom 1-klik untuk repositori kode, memungkinkan developer atau pengguna awam memulihkan perubahan kode tanpa risiko kerusakan struktur Git.

## Fitur Utama
1. **1-Click Safe Rollback**: Membatalkan perubahan dari commit tertentu dengan otomatis membuat commit pengembalian (*revert / rollback snapshot*) tanpa menghilangkan riwayat.
2. **Instant Restore Point Snapshot**: Membuat penanda checkpoint manual/otomatis sebelum perubahan skala besar dilakukan.
3. **Commit Snapshot Timeline**: Menampilkan daftar checkpoint dan commit terkini dengan label pembeda (Versi Aktif HEAD vs Titik Pemulihan).
4. **Dispatcher Event Integration**: Menyinkronkan perubahan ke modul `gitSync` dan sistem notifikasi global via event `git:status_updated` dan `timeMachine:refresh`.

## Kepatuhan Arsitektur
- Seluruh berkas berukuran `< 125 baris`.
- Komunikasi antar-modul 100% terisolasi melalui `core/dispatcher`.
- Penanganan error terstandar: `[Module:TimeMachine] Error in <fungsi>: <pesan>`.

## Ruang Improvement
- Visualisasi perbandingan baris (*side-by-side diff snapshot*) langsung di dalam modal sebelum tombol konfirmasi rollback ditekan.
