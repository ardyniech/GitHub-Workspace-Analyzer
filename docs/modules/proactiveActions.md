# Modul: Workspace Synchronizer & Proactive Actions

## Deskripsi
Modul pemersatu konteks ruang kerja. Saat pengguna berpindah antar-repositori di dalam aplikasi, agen AI akan melacak status (preference) pengguna secara mulus dan membangkitkan konteks pra-analisis (Proactive Action) khusus untuk repositori terkait.

## Komponen & Fitur
1. **Workspace Synchronizer**: Penyelaras state berbasis *Singleton* untuk melacak "Aktif Repo" dan "Mode Tampilan".
2. **Proactive Memory**: Fitur yang secara otonom "berpikir" sebelum diperintah, menanamkan kesimpulan audit dasar saat repositori pertama kali di-*mount* ke memori.
3. **Local Cache Manager**: Menyediakan pembungkus (wrapper) aman dengan dukungan *Generic Types* TypeScript untuk manajemen penyimpanan sesi.

## Aturan Arsitektur
- Modul bersifat utilitas dasar tanpa representasi UI (*headless logic*).
- 100% *Type-Safe* (mengeliminasi penggunaan tipe `any` mentah, diganti dengan generics `T`).

## Ruang Improvement
- Menambahkan enkripsi ringan pada layer penyimpanan memori (misalnya AES-GCM dengan kunci dinamis yang diturunkan dari sesi login) untuk mencegah eksfiltrasi token OAuth pengguna.
