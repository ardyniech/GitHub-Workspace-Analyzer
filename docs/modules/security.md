# Security Module

Modul pemindai keamanan otomatis (*Security Scan*) untuk mendeteksi celah keamanan kode sebelum perubahan di-commit ke repositori GitHub.

## Fitur
- **Pendeteksi Kebocoran Kunci Rahasia**: Memindai token GitHub, Google/Gemini API key, OpenAI key, AWS access key, private keys, serta kredensial hardcoded.
- **Audit Dependensi**: Memeriksa berkas dependensi (`package.json`) terhadap paket yang usang, deprecated (seperti `request`, `moment`), atau versi wildcard berbahaya (`*`, `latest`).
- **Pemeriksaan Pola Kode Berbahaya**: Mendeteksi penggunaan fungsi eksekusi tidak aman seperti `eval()` dan protokol tanpa enkripsi `http://`.
- **Integrasi AiChat & Copilot**: Terhubung langsung di dalam kartu usulan commit AiChat dengan proteksi otomatis sebelum commit dilakukan.
