# Modul: System Health

## Deskripsi
Modul ini bertanggung jawab untuk memantau performa, latensi, penggunaan token, dan alokasi memori sistem secara real-time. Dilengkapi dengan UI dashboard interaktif (Bento Grid) yang memudahkan pengguna memantau kesehatan AI Agent.

## Komponen & Fitur
1. **HealthChart**: Visualisasi performa latensi dan token.
2. **MemoryFragmentationOverlay**: Representasi visual sektor memori AI (Short-term cache, Long-term insights, dan Memory Leaks/Fragmentasi).
3. **OSV Audit**: Integrasi status keamanan dependensi (OSV).

## Aturan Arsitektur
- Beroperasi dalam batasan <125 baris per file.
- `SystemHealthModal` dan visualizer diisolasi secara ketat dan hanya menggunakan utilitas dari `shared/atoms`.

## Ruang Improvement
- Menambah kapabilitas alerting otomatis ke dalam modul notifikasi jika `Memory Fragmentation` melebih ambang batas 30%.
