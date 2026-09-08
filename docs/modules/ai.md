# Modul: AI Agent Executor & Autonomous Direct-Execution Engine

## Deskripsi
Modul ini bertindak sebagai otak komputasi untuk menjalankan analisis dan tindakan otonom (Agentic Execution), mem-parsing instruksi secara langsung, menghasilkan perubahan kode lengkap dalam blok `copilot`, dan langsung mengeksekusi commit/push ke repositori GitHub tanpa siklus tanya-jawab atau konfirmasi berbelit-belit.

## Komponen & Fitur
1. **Autonomous Direct-Execution Protocol**: Menghilangkan basa-basi dan rencana panjang; AI Agent langsung menghasilkan blok kode lengkap siap deploy.
2. **Auto-Pilot Mode (`AutoPilotBadge`)**: Saklar visual untuk beralih antara eksekusi langsung otonom (1-click/instant sync) dan mode review manual.
3. **Zero-Confirmation Latency**: Menerapkan perubahan kode, migrasi, atau perbaikan celah keamanan secara instan ke branch repositori.
4. **Context Injector**: Menarik metadata repositori (README, struktur, commit, memori) untuk disertakan ke dalam prompt sistem sebelum dieksekusi.
5. **Agent Modals**: Isolasi sub-fitur AI (Memory, Proactive Linter, Security Scan) yang terdekomposisi sesuai batas baris.

## Aturan Arsitektur
- Harus mengikuti batasan `< 125 lines` per berkas.
- Komunikasi antar modul menggunakan `dispatcher`.
- Penanganan error bersahabat dengan format `[Module:AI] Error in <fungsi>: <pesan>`.

## Ruang Improvement
- Menambah kapabilitas rollback instan (1-click revert) jika eksekusi otonom menghasilkan perubahan yang ingin dibatalkan oleh pengguna.
