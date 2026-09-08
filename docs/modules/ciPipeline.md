# GitHub Actions CI/CD Pipeline Module

Modul **CI Pipeline** (`modules/ciPipeline`) menyediakan pemantauan status otomatisasi GitHub Actions secara real-time untuk repositori aktif:

## Fitur Utama
1. **Real-time Build & Deployment Status**: Menampilkan status keberhasilan atau kegagalan dari workflow GitHub Actions (build, lint, unit test, dan deploy).
2. **Pipeline Health Metrics**: Menghitung rasio kelulusan (*Success Rate %*), jumlah build yang gagal, dan estimasi rata-rata durasi pipeline.
3. **Commit & Branch Context**: Menyajikan informasi commit SHA, pesan commit, branch target, serta pemrakarsa (*actor*) untuk setiap eksekusi workflow.
