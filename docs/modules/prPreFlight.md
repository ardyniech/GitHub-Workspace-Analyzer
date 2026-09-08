# AI PR Pre-Flight Audit Module

Modul **AI PR Pre-Flight** (`modules/prPreFlight`) menyediakan asisten otonom tingkat tinggi yang mensimulasikan proses peer-review ketat dari *Senior Engineer* sebelum perubahan komit didorong (*push*) ke repositori produksi:

## Fitur Utama
1. **Commit Scanning**: Menganalisis berkas-berkas yang terubah pada komit lokal aktif secara komprehensif.
2. **Strict Senior Audits**: Memeriksa bug logika, kebocoran token sensitif, unhandled async exceptions, serta pelanggaran arsitektur LEGO-Cellular.
3. **Interactive Score & Verdict**: Menyediakan skor kelulusan audit (0-100) serta status tegas "Passed" atau "Blocked".
4. **Auto-Fix Integration**: Tombol perbaikan satu-klik untuk langsung membenahi pelanggaran standar produksi.
