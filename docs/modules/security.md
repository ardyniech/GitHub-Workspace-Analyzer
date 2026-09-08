# Security Module

Modul audit keamanan komprehensif (*Security & Manifest Vulnerability Auditor*) untuk menganalisis keamanan kode dan dependensi repositori GitHub secara otomatis dengan bantuan Gemini AI.

## Fitur Utama
- **Audit Manifes (package.json & requirements.txt)**: Secara otomatis memindai dan mem-parsing berkas manifes dependensi pada repositori terpilih.
- **Deteksi Celah & Dependensi Usang (Outdated Packages)**: Menganalisis risiko keamanan serta dependensi yang tertinggal dengan Gemini dan memberikan rekomendasi peningkatan versi (*safe upgrade version*).
- **Pendeteksi Kebocoran Kunci Rahasia**: Memindai token GitHub, Google/Gemini API key, OpenAI key, AWS access key, private keys, serta kredensial hardcoded.
- **Pemeriksaan Pola Kode Berbahaya**: Mendeteksi penggunaan fungsi eksekusi tidak aman seperti `eval()` dan protokol tanpa enkripsi `http://`.
- **Integrasi Tab Dashboard**: Tersedia langsung pada tab *Audit Manifes* di dalam panel repositori.
