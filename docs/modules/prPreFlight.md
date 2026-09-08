# Modul: PR Pre-Flight

## Deskripsi
Modul ini bertindak sebagai gerbang (gatekeeper) analisis pra-komit (pre-flight). AI akan melakukan simulasi audit terhadap perubahan kode yang direncanakan sebelum dipush ke GitHub. 

## Komponen & Fitur
1. **Fix-It Engine**: Menganalisis judul/pesan komit terhadap "SOP Zero Mistake" dan aturan arsitektur, mendeteksi konflik, dan mengeluarkan rekomendasi sintaks perbaikan otomatis (autofix) langsung di timeline riwayat komit.
2. **PreFlightModal**: Antarmuka bagi pengguna untuk memicu simulasi audit arsitektur sebelum mengeksekusi komit sesungguhnya.

## Aturan Arsitektur
- Logika audit (`logic/fixItEngine.ts`) berjalan terpisah dari komponen React (`primitives/`), menjaga UI tetap responsif.
- Payload konflik diringkas dan diberi kategori (Critical, High, Medium, Low) agar informasinya user-friendly dan bukan hanya stack trace mentah.

## Ruang Improvement
- Menghubungkan Fix-It Engine langsung ke editor kode sehingga `proposedFix` dapat langsung di-*apply* dengan satu klik (One-Click Auto Fix).
