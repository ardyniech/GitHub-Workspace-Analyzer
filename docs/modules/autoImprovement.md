# Auto-Improvement Engine Module

Modul **Auto-Improvement Engine** (`modules/autoImprovement`) memantau hasil generasi kode AI Agent terhadap riwayat review Pull Request secara kontinu untuk memperbarui *Style Guide* dan pedoman koding internal secara otonom:

## Fitur Utama
1. **Dynamic Style Guide Manifest**: Pengelolaan versi dan pedoman koding terpusat (`StyleGuideManifest`).
2. **Autonomous Improvement Cycle**: Membandingkan hasil review PR historis dan mensintesis aturan koding baru.
3. **Persistensi Lokal**: Menyimpan evolusi pedoman koding dan riwayat audit di `localStorage`.
4. **Interactive Inspector Modal**: Modal `AutoImprovementModal` untuk memicu siklus evaluasi manual dan melihat aturan aktif.
