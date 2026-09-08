# Background Proactive Linter Module

Modul **Proactive Linter** (`modules/proactiveLinter`) menyediakan audit berkode otomatis di latar belakang (*background linting*) sebelum commit disetujui:

## Fitur Utama
1. **Performance Bottleneck Detection**: Mengidentifikasi alokasi memori berlebih, objek tak ter-memoize pada dependency hook, dan re-render tidak perlu.
2. **Security Vulnerability Auditing**: Mendeteksi penyimpan OIDC token dalam plain-text LocalStorage, eksposur kunci rahasia, atau unhandled rejection.
3. **One-Click Auto-Fixing**: Menyediakan tombol perbaikan langsung (*Auto-Fix*) untuk isu-isu yang terstandarisasi.
