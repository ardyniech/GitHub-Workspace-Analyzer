# Modul: AI Repository Recommendations & Quick Execution

## Deskripsi
Modul **Repo Recommendation & Quick Execution** (`modules/repoRecommendation`) menyediakan rekomendasi peningkatan kualitas repositori bertenaga AI beserta tombol aksi cepat 1-klik (*1-click Quick Agent Task Execution*), *Batch Fix Autonomous Pipeline*, dan *Live Codebase Health Inspector*.

## Fitur Utama
1. **AI Improvement Recommendations**: Menghasilkan rekomendasi arsitektur, keamanan manifes, CI/CD pipelines, unit testing, performa, dan dokumentasi manusiawi.
2. **1-Click Quick Action Grid**: Tombol eksekusi instan untuk *Hardening Keamanan*, *Setup CI/CD*, *Generate Unit Tests*, *Modular Refactoring (<125 baris)*, *Human-Friendly Docs*, dan *Optimasi Performa*.
3. **Batch Autonomous Fix All Pipeline**: Menjadwalkan seluruh usulan perbaikan kritis ke antrean agen latar belakang secara berurutan dalam 1 klik.
4. **Live Codebase Health Inspector**: Pemantauan skor kepatuhan batas baris (<125 baris), modularitas, keamanan, dan *gate* CI/CD.
5. **Repository Readiness Score**: Menghitung persentase kesiapan repositori berdasarkan jumlah rekomendasi yang telah selesai dieksekusi.
6. **Dispatcher Event Integration**: Mengirimkan tugas secara asinkron ke `agentTaskQueue` dan memicu eksekusi perintah langsung di modul `ai`.
7. **State Persistence**: Menyimpan status rekomendasi selesai atau ditutup per repositori di penyimpanan lokal.

## Kepatuhan Arsitektur
- Seluruh berkas berukuran `< 125 baris`.
- Komunikasi antar modul 100% menggunakan `core/dispatcher`.
- Penanganan error terstandar: `[Module:repoRecommendation] Error in <fungsi>: <pesan>`.

## Ruang Improvement
- Pemindaian AST lanjutan untuk memetakan ketergantungan antar-fungsi secara visual dalam diagram interaktif.

