# AI Module

Modul asisten pengembangan bertenaga Google Gemini AI (`gemini-3.1-flash-lite`, `gemini-3.8-flash`, `gemini-2.5-flash`, serta `gemini-3.1-flash-live-preview` untuk percakapan audio real-time).

## Fitur
- **Percakapan Suara Real-Time (Live API)**: Dialog audio interaktif langsung dengan model `gemini-3.1-flash-live-preview` melalui WebSocket dupleks penuh, pemrosesan PCM 16-bit 16kHz/24kHz, visualisasi gelombang suara (*audio waveform/orb*), dan deteksi interupsi instan.
- **High-Throughput & Circuit Breaker**: Menggunakan model `gemini-3.1-flash-lite` sebagai pemroses utama dengan mekanisme circuit breaker otomatis untuk menghindari kuota exhausted (429) dan lonjakan trafik (503).
- **Analisis Cerdas Repositori**: Menganalisis berkas `README.md`, struktur proyek, dan riwayat commit secara kontekstual.
- **Generator Otomatis Draft Pull Request (PR)**: Membuat deskripsi PR terstruktur secara instan berdasarkan riwayat commit terbaru (`CommitHistory`) dan audit keamanan otomatis (`Security Scan`).
- **Jendela Chat AI Agent Lega**: Tampilan chat luas berukuran tinggi hingga 640px dengan tombol mode ekspansi layar penuh (*Fullscreen / Mode Lega*) untuk kemudahan interaksi.
- **Proteksi Commit & Copilot Direct-Push (Multi-File Editing hingga 30 Berkas)**: Kemampuan AI Copilot untuk mengusulkan dan memodifikasi hingga 30 berkas sekaligus (`Batch 30`). Dilengkapi pencarian & pemfilteran berkas, kotak centang seleksi berkas individual/semua, pratinjau git diff per berkas, pemindaian celah keamanan, dan tombol simpan *"Commit & Push"* dengan indikator persentase progres, visual bilah progres (*progress bar*), serta tombol pembatalan (*cancel*) darurat.
- **Ekspor Laporan Analisis (*Markdown Export*)**: Fitur unduh rangkuman hasil analisis AI, audit keamanan, dan usulan solusi dalam format Markdown (`.md`) yang rapi dengan satu klik tombol *"Export Laporan"*, siap dibagikan ke tim pengembang atau dilampirkan pada issue/PR.
