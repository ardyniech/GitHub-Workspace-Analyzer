# Modul: Deploy Automation

## Deskripsi
Modul ini bertugas untuk mengotomasi proses *deployment* repositori, menyimulasikan pemanggilan GitHub Actions, dan menampilkan tautan *One-Click Preview* langsung di dalam Bento Grid dashboard agen AI.

## Komponen & Fitur
1. **DeploymentCard**: UI primitif (kartu Bento) yang secara reaktif menampilkan status *deployment* ('idle', 'building', 'success', 'failed').
2. **DeployEngine**: Logika state-machine untuk mengontrol dan menyimulasikan *build* serta transisi status.
3. **DeployAdapter**: Penyimpanan lokal persisten yang mengunci status *deployment* per repositori.

## Aturan Arsitektur
- Logika penyimpanan (Storage), manipulasi state (Logic), dan tampilan (Primitives) diisolasi murni.
- Komponen menggunakan ukuran file sangat ringkas (< 125 baris) yang patuh pada standar produksi 'Build One and Forget'.
- Dilengkapi dengan batas klik ramah jari (>=44px visual atau padding area sentuh yang luas).

## Ruang Improvement
- Integrasi ke GitHub API nyata untuk mengirim *dispatch event* ke `.github/workflows/deploy.yml` jika token *Personal Access Token* (PAT) milik pengguna tersedia di masa mendatang.