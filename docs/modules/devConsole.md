# Hidden Developer Console Module

Modul **Developer Console** (`modules/devConsole`) menyediakan konsol pengembang tersembunyi (*Hidden Developer Console*) untuk memantau proses penalaran internal AI Agent (*Internal AI Reasoning Logs*) dan melacak *Stack Trace* kesalahan secara real-time untuk kebutuhan debugging kelas produksi (*Production-Grade Debugging*):

## Fitur Utama
1. **Real-time Reasoning Logs**: Menangkap log penalaran agent (`level: 'reasoning'`) dan peristiwa dari sistem.
2. **Error Stack Trace Inspector**: Menampilkan *stack trace* lengkap untuk error asinkron dengan fitur salin 1-klik.
3. **Filter Tingkat Log**: Menyaring log berdasarkan kategori `ALL`, `REASONING`, `ERROR`, `WARN`, dan `INFO`.
4. **Floating Toggle**: Tombol tersembunyi (`DevConsoleToggle`) di pojok kanan bawah UI.
