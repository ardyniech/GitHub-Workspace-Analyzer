# Analytics Module (D3.js Data Visualization)

Modul visualisasi data statistik kontribusi mingguan dan tren aktivitas commit repositori menggunakan pustaka D3.js.

## Fitur
- **Visualisasi D3.js (*Interactive Activity & Trend Chart*)**: Render grafik batang (*bar chart*) dengan gradien warna ungu-indigo modern berpadu garis tren aktivitas (*smooth trend line*) berbasis kurva `d3.curveMonotoneX`.
- **Statistik KPI Komprehensif**: Menampilkan ringkasan metrik commit 4 minggu terakhir serta total volume commit selama 1 tahun secara otomatis.
- **Auto-Sync & Segarkan Cepat**: Tombol segarkan data langsung terhubung ke endpoint GitHub Statistics API (`/stats/commit_activity`).
