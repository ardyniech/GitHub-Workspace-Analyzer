# AI Peer Reviewer Module

Modul **AI Peer Reviewer** untuk menganalisis perubahan kode (Pull Request diff ataupun berkas edit sebelum commit) secara otomatis.

## Kapabilitas & Deteksi
1. **Logika Bug**: Deteksi off-by-one errors, unhandled null/undefined, race condition, loose null checks.
2. **Redundansi Kode**: Identifikasi kode duplikat, dead code, log sisa debugging (`console.log`), dan loop berulang yang tidak efisien.
3. **Kepatuhan Gaya & SOP Zero Mistake**: Deteksi penggunaan tipe `any`, komentar `TODO/FIXME` tertunda, dan kepatuhan arsitektur modular.
4. **Keamanan**: Deteksi dini secret atau password yang tidak sengaja tertulis di kode (*hardcoded credentials*).

## Titik Akses UI
- **Pull Request List (`PrList`)**: Tombol aksi *AI Review* pada setiap Pull Request.
- **Code Editor (`RepoCodeEditor`)**: Tombol aksi *Peer Review* sebelum melakukan commit & push.
- **Notifikasi**: Integrasi otomatis status hasil review dengan `NotificationCenter`.
