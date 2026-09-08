# Notification Module

Modul Pusat Notifikasi Real-Time (*Real-Time Notification Center*) untuk memberikan umpan balik instan kepada pengguna saat operasi asinkron atau proses asisten AI selesai dijalankan.

## Fitur Utama
- **Event-Driven via Core Dispatcher**: Menerima event `notify:push` dari berbagai modul (misal `ai`, `security`, `repo`, `tester`).
- **Pemberitahuan Status 'Generate Fix PR'**: Memberi tahu pengguna seketika saat AI mulai merancang kode diff dan saat draf Pull Request perbaikan selesai disusun secara lengkap.
- **Badge Unread Count & Popover Interaktif**: Indikator jumlah notifikasi baru dengan animasi denyut (*pulse*), tombol *Tandai Telah Dibaca*, serta pembersihan riwayat notifikasi.
- **Human-Friendly Design**: Menggunakan bahasa yang santun, bebas jargon teknis, dan dilengkapi penanda waktu relatif (*time-ago*).
