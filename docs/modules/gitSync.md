# Git Sync & Remote Push Module

Modul **Git Sync** (`modules/gitSync`) menyediakan fungsionalitas manajemen git remote dan sinkronisasi push langsung ke repositori GitHub:

## Fitur Utama
1. **Pemeriksaan Status Git Lokal**: Membaca cabang aktif (`branch`), commit hash terbaru (`lastCommitHash`), pesan commit, dan status kebersihan *working tree*.
2. **Push 1-Klik ke GitHub**: Menghubungkan remote URL GitHub dan mengeksekusi `git push -u origin main` langsung dari antarmuka web melalui endpoint server `/api/git/push`.
3. **Integrasi Kredensial Otomatis**: Memanfaatkan token GitHub yang tersimpan di modul `auth` untuk push terautentikasi tanpa mengekspos kredensial ke log publik.
4. **CI/CD Workflow Terintegrasi**: Dilengkapi dengan file workflow `.github/workflows/ci-cd.yml` yang siap mengeksekusi linter dan build produksi saat kode dipush.
