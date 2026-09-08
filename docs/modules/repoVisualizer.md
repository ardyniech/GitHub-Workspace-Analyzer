# Real-Time Repository Visualizer Module

Modul **Repo Visualizer** (`modules/repoVisualizer`) menyediakan antarmuka visual dinamis untuk memetakan struktur file fisik dan dependensi fungsional antar modul system secara interaktif:

## Fitur Utama
1. **Peta Arsitektur (ERD Map)**: Visualisasi relasi/hubungan antar-sel fungsional (`core`, `modules`, `shared`) untuk melacak aliran data.
2. **Struktur Folder (Hierarchy Tree)**: Representasi hirarkis interaktif yang menunjukkan struktur folder dan berkas proyek fisik.
3. **Eksekusi Refactoring Otonom Terintegrasi**: Mengirim tugas dekomposisi dan refaktor langsung ke antrean tugas Agen AI (`agentTaskQueue`) dan memicu Copilot Agent via dispatcher untuk eksekusi nyata, yang memperbarui diagram arsitektur secara real-time.
