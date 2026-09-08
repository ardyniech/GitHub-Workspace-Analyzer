# Pre-Commit Tester Module

Modul pengujian otomatis pra-commit dan pra-push untuk memverifikasi kualitas dan keamanan kode sebelum disimpan ke repositori GitHub.

## Fitur
- **Uji Integritas Sintaks & Tanda Kurung**: Memeriksa keseimbangan kurung `()`, kurawal `{}`, dan tanda kurung siku `[]`, serta memvalidasi struktur JSON.
- **Uji Kelengkapan Kode**: Memastikan tidak ada placeholder yang belum selesai seperti `TODO: implement`, `// ...existing code...`, atau potongan kode kosong.
- **Uji Keamanan Kunci Rahasia**: Memindai potensi kebocoran token rahasia GitHub (PAT), kunci API Google/OpenAI, AWS credentials, atau private keys.
- **Modal Interaktif Pra-Commit (`PreCommitTestModal`)**: Menampilkan hasil verifikasi uji dalam hitungan milidetik sebelum commit dieksekusi, dengan opsi perbaikan atau override manual yang aman.
