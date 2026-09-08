# OSV Dependency Vulnerability Audit Module

Modul **OSV Audit** (`modules/osvAudit`) memindai dan memverifikasi dependensi proyek pada `package.json` terhadap database kerentanan keamanan terbuka OSV (Open Source Vulnerabilities API `https://api.osv.dev/v1/querybatch`).

## Fitur Utama
1. **OSV Database Cross-Referencing**: Memeriksa nama paket dan versi terinstal di ekosistem `npm` secara langsung ke API resmi OSV.
2. **Vulnerability Alerts**: Menyorot temuan kerentanan keamanan lengkap dengan tingkat keparahan (*CRITICAL*, *HIGH*, *MODERATE*, *LOW*), ringkasan ancaman, dan saran perbaikan (*patch version*).
3. **Integration with System Health Dashboard**: Menyajikan ringkasan skor keamanan (*Security Score %*) dan peringatan kerentanan langsung di dalam panel System Health Dashboard.
